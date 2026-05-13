// app/api/contact/route.js
// Receives /contact form submissions and the PM "Notify me when it ships"
// flow. Sends the message via Resend to info@reportdecoded.com.au with
// reply_to set to the visitor's email so Morgan can reply from his inbox
// directly.
//
// No auth, no DB — purely a relay. Simple rate-protection via a length cap
// on the message and basic email validation.

import { sendContactFormEmail } from '@/lib/email';

const VALID_TOPICS = new Set(['general', 'buyer', 'agent', 'pm', 'bug']);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const topic = (body.topic || 'general').toString();
  const message = (body.message || '').toString().trim();
  const agencyName = (body.agencyName || '').toString().trim();
  const propertyCount = (body.propertyCount || '').toString().trim();

  // ── Validation
  if (!name || name.length < 2 || name.length > 120) {
    return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!email || !/.+@.+\..+/.test(email) || email.length > 254) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!VALID_TOPICS.has(topic)) {
    return Response.json({ error: 'Invalid topic' }, { status: 400 });
  }
  // PM topic doesn't require a message (it's a notify-me signup); others do
  if (topic !== 'pm') {
    if (!message || message.length < 10) {
      return Response.json({ error: 'Please write a short message (at least a sentence).' }, { status: 400 });
    }
  }
  if (message.length > 4000) {
    return Response.json({ error: 'Message is too long (4,000 char max).' }, { status: 400 });
  }

  try {
    await sendContactFormEmail({ name, email, topic, message, agencyName, propertyCount });
  } catch (err) {
    console.error('[contact] resend failed:', err?.message || err);
    return Response.json(
      { error: "Couldn't send your message — please try again, or email info@reportdecoded.com.au directly." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
