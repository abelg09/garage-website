---
name: Resend test-mode delivery limit
description: Why GARAGE contact emails only reach the account owner until a domain is verified
---

# Resend test mode only delivers to the account owner

When using the Resend connector with the default `onboarding@resend.dev` sender,
Resend returns **403 validation_error** for any recipient other than the account
owner's address, with: "You can only send testing emails to your own email
address (...). To send emails to other recipients, please verify a domain at
resend.com/domains, and change the `from` address to an email using this domain."

**Why:** Resend accounts start in test mode. Sending to arbitrary recipients
(e.g. hello@garage-india.in) requires a verified sending domain.

**How to apply:** The contact route (`artifacts/api-server/src/routes/contact.ts`)
reads `CONTACT_FROM` / `CONTACT_RECIPIENT` env vars (defaults: onboarding@resend.dev
and hello@garage-india.in). Once the user verifies their domain in Resend, set
`CONTACT_FROM` to an address on that domain — no code change needed. The pipeline
itself is correct; a 502 from /api/contact in dev is almost always this account
constraint, not a code bug. Confirm by sending a test to the owner address (200).
