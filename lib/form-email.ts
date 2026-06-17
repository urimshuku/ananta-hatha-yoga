import "server-only";

import { Resend } from "resend";

interface SendFormNotificationOptions {
  subject: string;
  replyTo: string;
  text: string;
}

let resend: Resend | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(getRequiredEnv("RESEND_API_KEY"));
  }

  return resend;
}

export async function sendFormNotification({
  subject,
  replyTo,
  text,
}: SendFormNotificationOptions): Promise<void> {
  const { error } = await getResendClient().emails.send({
    from: getRequiredEnv("RESEND_FROM_EMAIL"),
    to: getRequiredEnv("FORM_NOTIFICATION_EMAIL"),
    subject,
    replyTo,
    text,
  });

  if (error) {
    throw new Error(
      `Resend failed to send form notification: ${error.name}: ${error.message}`,
    );
  }
}
