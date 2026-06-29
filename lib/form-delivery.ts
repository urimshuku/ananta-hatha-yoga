import { getCloudflareContext } from "@opennextjs/cloudflare";

import { sendFormNotification } from "./form-email";
import {
  getPendingSubmissions,
  markEmailed,
  recordEmailFailure,
  saveSubmission,
  type FormSubmissionType,
} from "./form-store";

/**
 * Zero-loss form delivery.
 *
 * The user should never wait on (or fail because of) email delivery:
 *   1. Durably store the submission in D1 when available.
 *   2. Return success to the caller immediately.
 *   3. Send the notification email in the background (with retries).
 *
 * If D1 is configured, a failed background email is retried by the cron job.
 * The API only surfaces an error when nothing could be stored and the request
 * context is unavailable (extremely rare).
 */

interface DeliverInput {
  type: FormSubmissionType;
  subject: string;
  replyTo: string;
  /** Formatted plain-text email body. */
  body: string;
  /** Full raw submission, stored verbatim for recovery. */
  payload: unknown;
}

function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function deliverEmail(
  id: string,
  input: DeliverInput,
  persisted: boolean,
): Promise<void> {
  try {
    await sendFormNotification({
      subject: input.subject,
      replyTo: input.replyTo,
      text: input.body,
    });

    if (persisted) {
      await markEmailed(id).catch((err) =>
        console.error(`Failed to mark submission ${id} as emailed:`, err),
      );
    }
  } catch (emailError) {
    const message =
      emailError instanceof Error ? emailError.message : "Unknown email error";

    if (persisted) {
      console.error(
        `Email delivery deferred for submission ${id} (will retry): ${message}`,
      );
      await recordEmailFailure(id, message).catch(() => {});
      return;
    }

    console.error(
      `Email delivery failed and submission was not persisted: ${message}`,
    );
  }
}

/**
 * Accept a validated form submission: persist when possible, then deliver email
 * in the background. Does not throw when email delivery fails.
 */
export async function acceptSubmission(input: DeliverInput): Promise<void> {
  const id = newSubmissionId();
  const createdAt = new Date().toISOString();

  let persisted = false;
  try {
    await saveSubmission({
      id,
      type: input.type,
      subject: input.subject,
      replyTo: input.replyTo,
      body: input.body,
      payload: JSON.stringify(input.payload),
      createdAt,
    });
    persisted = true;
  } catch (error) {
    console.error("Failed to persist submission to D1:", error);
  }

  const task = () => deliverEmail(id, input, persisted);

  try {
    const { ctx } = await getCloudflareContext({ async: true });
    ctx.waitUntil(task());
    return;
  } catch {
    // Local dev or missing execution context — deliver synchronously instead.
    await task();
  }
}

export interface FlushResult {
  processed: number;
  sent: number;
  failed: number;
}

/**
 * Retry delivery of any stored submissions whose email has not yet succeeded.
 * Invoked from the scheduled (cron) handler.
 */
export async function flushPendingSubmissions(
  env: Record<string, unknown>,
  limit = 25,
): Promise<FlushResult> {
  const db = env.DB as D1Database | undefined;
  if (!db) {
    console.warn("D1 binding 'DB' is not configured; skipping form email flush.");
    return { processed: 0, sent: 0, failed: 0 };
  }

  const pending = await getPendingSubmissions(limit, db);

  let sent = 0;
  let failed = 0;

  for (const row of pending) {
    try {
      await sendFormNotification(
        { subject: row.subject, replyTo: row.reply_to, text: row.body },
        env,
      );
      await markEmailed(row.id, db);
      sent += 1;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown email error";
      await recordEmailFailure(row.id, message, db).catch(() => {});
      failed += 1;
    }
  }

  return { processed: pending.length, sent, failed };
}
