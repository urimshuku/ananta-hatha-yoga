/**
 * Update the www → apex Cloudflare redirect rule to use HTTP 308
 * (preserves POST bodies; 301 may convert POST to GET).
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=your_token node scripts/cloudflare-www-redirect-308.mjs
 *
 * Token needs: Zone → Redirect Rules → Edit (or Zone → Zone → Edit).
 */

const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID ?? "de44fcad18d27d93fb96582612a9aff8";
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!API_TOKEN) {
  console.error(
    "Missing CLOUDFLARE_API_TOKEN.\n\n" +
      "Create one at https://dash.cloudflare.com/profile/api-tokens with\n" +
      "「Zone → Redirect Rules → Edit」for navahathayoga.com, then run:\n\n" +
      "  CLOUDFLARE_API_TOKEN=your_token node scripts/cloudflare-www-redirect-308.mjs",
  );
  process.exit(1);
}

const API = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}`;
const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
};

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, { headers, ...options });
  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    throw new Error(
      `Cloudflare API ${options.method ?? "GET"} ${path} failed: ${JSON.stringify(body.errors ?? body)}`,
    );
  }

  return body.result;
}

function isWwwToApexRule(rule) {
  const expression = rule.expression ?? "";
  const statusCode = rule.action_parameters?.from_value?.status_code;
  const target =
    rule.action_parameters?.from_value?.target_url?.value ??
    rule.action_parameters?.from_value?.target_url?.expression ??
    "";

  const matchesHost =
    /www\.navahathayoga\.com/i.test(expression) ||
    /www\.navahathayoga\.com/i.test(target) ||
    /concat\("https:\/\/navahathayoga\.com/i.test(target);

  return rule.action === "redirect" && matchesHost && statusCode !== 308;
}

async function main() {
  const entrypoint = await api("/rulesets/phases/http_request_dynamic_redirect/entrypoint");
  const rules = entrypoint?.rules ?? [];
  const updatedRules = rules.map((rule) => {
    if (!isWwwToApexRule(rule)) return rule;

    return {
      ...rule,
      action_parameters: {
        ...rule.action_parameters,
        from_value: {
          ...rule.action_parameters.from_value,
          status_code: 308,
        },
      },
    };
  });

  const changed = updatedRules.some((rule, index) => rule !== rules[index]);

  if (!changed) {
    const has308 = rules.some(
      (rule) =>
        rule.action === "redirect" &&
        rule.action_parameters?.from_value?.status_code === 308 &&
        (/www\.navahathayoga\.com/i.test(rule.expression ?? "") ||
          /www\.navahathayoga\.com/i.test(
            rule.action_parameters?.from_value?.target_url?.value ?? "",
          )),
    );

    if (has308) {
      console.log("www → apex redirect is already using status code 308.");
      return;
    }

    console.error(
      "No matching www → apex redirect rule found in Redirect Rules.\n" +
        "Update it manually in Cloudflare Dashboard → Rules → Redirect Rules:\n" +
        "  If hostname equals www.navahathayoga.com → redirect to https://navahathayoga.com\n" +
        "  Status code: 308 (Permanent, preserve method)",
    );
    process.exit(1);
  }

  await api(`/rulesets/${entrypoint.id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: entrypoint.name,
      kind: entrypoint.kind,
      phase: entrypoint.phase,
      rules: updatedRules,
    }),
  });

  console.log("Updated www → apex redirect rule to HTTP 308.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
