import { Router, type IRouter } from "express";
import { CreateContactMessageBody } from "@workspace/api-zod";
// Resend integration (Replit Connectors blueprint id: "resend")
import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Recipient + sender are overridable via env. Once the garage-india.in domain is
// verified at resend.com/domains, set CONTACT_FROM to an address on that domain
// (e.g. "GARAGE Website <website@garage-india.in>") so Resend will deliver to any
// recipient. Until then Resend test mode only allows sending to the account owner.
const CONTACT_RECIPIENT = process.env["CONTACT_RECIPIENT"] || "hello@garage-india.in";
const CONTACT_FROM = process.env["CONTACT_FROM"] || "GARAGE Website <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

router.post("/contact", async (req, res) => {
  const parsed = CreateContactMessageBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Please provide a valid name, email, and message." });
    return;
  }

  const { name, email, message } = parsed.data;

  const text = `New enquiry from the GARAGE website\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const html = `<div style="font-family: Helvetica, Arial, sans-serif; color: #050505; line-height: 1.6;">
    <h2 style="margin: 0 0 16px;">New enquiry from the GARAGE website</h2>
    <p style="margin: 0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p style="margin: 0 0 16px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p style="margin: 0 0 6px;"><strong>Message:</strong></p>
    <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
  </div>`;

  try {
    const connectors = new ReplitConnectors();
    const response = await connectors.proxy("resend", "/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_RECIPIENT],
        reply_to: email,
        subject: `New enquiry from ${name}`,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      logger.error({ status: response.status, body }, "Resend send failed");
      res.status(502).json({ error: "We couldn't send your message right now. Please try again later." });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Contact send error");
    res.status(502).json({ error: "We couldn't send your message right now. Please try again later." });
  }
});

export default router;
