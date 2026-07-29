/** Ambient types for Cloudflare Pages Functions (Email Service structured API). */
interface EmailMessageBuilder {
  to: string | { email: string; name?: string } | (string | { email: string; name?: string })[];
  from: string | { email: string; name?: string };
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | { email: string; name?: string };
}

interface EmailSendResult {
  messageId: string;
}
