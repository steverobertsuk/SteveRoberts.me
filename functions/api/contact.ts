import { AwsClient } from 'aws4fetch';

interface Env {
  TURNSTILE_SECRET_KEY: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  SES_FROM_EMAIL: string;
  SES_TO_EMAIL: string;
}

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

const SUBJECT_OPTIONS = new Set([
  'Software engineering',
  'Infrastructure and automation',
  'Roll20 development',
  'Podcasting and livestreaming',
  'Online communities',
  'General enquiry',
]);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonError(400, 'Invalid request body.');
  }

  const { name, email, subject, message, turnstileToken } = payload;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !subject?.trim() ||
    !message?.trim() ||
    !turnstileToken
  ) {
    return jsonError(400, 'All fields are required.');
  }

  if (!SUBJECT_OPTIONS.has(subject)) {
    return jsonError(400, 'Invalid subject.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return jsonError(400, 'Please enter a valid email address.');
  }

  if (message.trim().length > 5000) {
    return jsonError(400, 'Message must be 5,000 characters or fewer.');
  }

  // Verify Turnstile token
  const tsResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: turnstileToken }),
  });
  const tsData = (await tsResp.json()) as { success: boolean };
  if (!tsData.success) {
    return jsonError(403, 'Security check failed. Please try again.');
  }

  // Send via SES query API
  const aws = new AwsClient({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    service: 'ses',
  });

  const body = new URLSearchParams({
    Action: 'SendEmail',
    Version: '2010-12-01',
    Source: `"SteveRoberts.me Contact Form" <${env.SES_FROM_EMAIL}>`,
    'Destination.ToAddresses.member.1': env.SES_TO_EMAIL,
    'ReplyToAddresses.member.1': email.trim(),
    'Message.Subject.Data': `SR.me Contact: ${subject} from ${name.trim()}`,
    'Message.Subject.Charset': 'UTF-8',
    'Message.Body.Text.Data': [
      `Name:    ${name.trim()}`,
      `Email:   ${email.trim()}`,
      `Subject: ${subject}`,
      '',
      message.trim(),
    ].join('\n'),
    'Message.Body.Text.Charset': 'UTF-8',
  });

  const sesResp = await aws.fetch(
    `https://email.${env.AWS_REGION}.amazonaws.com/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    },
  );

  if (!sesResp.ok) {
    console.error('SES error', sesResp.status, await sesResp.text());
    return jsonError(500, 'Failed to send your message. Please try again later.');
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ success: false, error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
