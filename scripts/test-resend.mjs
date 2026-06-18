/**
 * Send a test notification through Resend using .env.local variables.
 * Usage: npm run test:resend
 */

const required = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "FORM_NOTIFICATION_EMAIL"];

for (const name of required) {
  if (!process.env[name]?.trim()) {
    console.error(`Missing ${name}. Add it to .env.local and try again.`);
    process.exit(1);
  }
}

const { RESEND_API_KEY, RESEND_FROM_EMAIL, FORM_NOTIFICATION_EMAIL } = process.env;

const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: RESEND_FROM_EMAIL,
    to: [FORM_NOTIFICATION_EMAIL],
    subject: "Nava Hatha Yoga — Resend test",
    text: [
      "This is a test email from the Nava Hatha Yoga site.",
      "",
      "If you received this, contact and registration form delivery is configured correctly.",
      `Sent at: ${new Date().toISOString()}`,
    ].join("\n"),
  }),
});

const body = await response.json().catch(() => ({}));

if (!response.ok) {
  console.error("Resend API error:", response.status, body);
  process.exit(1);
}

console.log("Test email sent successfully.");
console.log("Message id:", body.id ?? "(see Resend dashboard)");
console.log("Delivered to:", FORM_NOTIFICATION_EMAIL);
