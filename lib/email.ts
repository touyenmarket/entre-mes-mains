import nodemailer from "nodemailer";
import { SITE } from "@/lib/config";

export function emailActif() {
  return (
    process.env.EMAIL_MODE === "smtp" &&
    Boolean(process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS)
  );
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });
}

export async function envoyerEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: Buffer; contentType: string }[];
}) {
  const from =
    process.env.EMAIL_FROM ||
    `Entre mes mains <${SITE.email}>`;

  if (!emailActif()) {
    console.log("[email:log]", {
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
    return { mode: "log" as const };
  }

  await transporter().sendMail({
    from,
    to: opts.to,
    bcc: SITE.email,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    attachments: opts.attachments,
  });
  return { mode: "smtp" as const };
}
