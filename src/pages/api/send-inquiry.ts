import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, company, email, material, volume, port, message, lang = 'en' } = body;

    if (!name || !company || !email || !material || !volume || !port) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY || 're_B4wcnNpf_HVFxVHbt3X9fMtUYh2kMN7bS');

    const subjectLines: Record<string, string> = {
      en: 'New RFQ from Geoprocure Website',
      de: 'Neue Anfrage von Geoprocure Website',
      it: 'Nuova Richiesta dal Sito Geoprocure',
      es: 'Nueva Solicitud del Sitio Geoprocure',
      fr: 'Nouvelle Demande du Site Geoprocure',
    };

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; }
    .content { padding: 20px; background: #f9fafb; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
    .value { color: #111; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 New RFQ - Geoprocure</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${company}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${email}</div>
      </div>
      <div class="field">
        <div class="label">Material:</div>
        <div class="value">${material}</div>
      </div>
      <div class="field">
        <div class="label">Volume:</div>
        <div class="value">${volume} MT</div>
      </div>
      <div class="field">
        <div class="label">Target Port:</div>
        <div class="value">${port}</div>
      </div>
      ${message ? `
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${message}</div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
    `.trim();

    await resend.emails.send({
      from: 'Geoprocure <noreply@geoprocure.com>',
      to: ['office@geoprocure.com'],
      subject: subjectLines[lang] || subjectLines.en,
      html: emailHtml,
      reply_to: email,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Email error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
    });
  }
};