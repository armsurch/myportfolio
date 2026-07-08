export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel + Express-style JSON body
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Resend email
    // Required env vars in Vercel:
    // - RESEND_API_KEY
    // - RESEND_FROM_EMAIL
    // - RESEND_TO_EMAIL
    const { Resend } = await import('resend');

    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <h2>New Portfolio Contact</h2>
      <p><b>Name:</b> ${escapeHtml(name)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Subject:</b> ${escapeHtml(subject)}</p>
      <hr/>
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.RESEND_TO_EMAIL,
      subject: `[Portfolio] ${subject}`,
      html
    });

    return res.status(200).json({ ok: true, id: result?.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
.replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}







