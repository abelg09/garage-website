import { useState } from "react";
import { toast } from "sonner";
import type { ContactContent } from "../lib/types";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const EMPTY: FormState = { name: "", email: "", message: "" };

export function ContactForm({ content }: { content: ContactContent }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      toast.error(content.requiredMessage);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        toast.error(data?.error ?? content.genericErrorMessage);
        return;
      }

      toast.success(content.successMessage);
      setForm(EMPTY);
    } catch {
      toast.error(content.networkErrorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <p className="eyebrow contact-form-label">{content.formLabel}</p>
      <div className="contact-field">
        <label htmlFor="contact-name">{content.nameLabel}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={update("name")}
          maxLength={120}
          required
        />
      </div>
      <div className="contact-field">
        <label htmlFor="contact-email">{content.emailFieldLabel}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          maxLength={200}
          required
        />
      </div>
      <div className="contact-field">
        <label htmlFor="contact-message">{content.messageLabel}</label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={update("message")}
          maxLength={5000}
          required
        />
      </div>
      <button type="submit" className="contact-submit" disabled={submitting}>
        {submitting ? content.submittingLabel : content.submitLabel}
      </button>
    </form>
  );
}
