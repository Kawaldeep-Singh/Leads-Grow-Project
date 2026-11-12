import nodemailer from 'nodemailer';

export interface LeadEmailData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  source?: string;
  createdAt?: string | Date;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (user && pass && host) {
    try {
      return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    } catch (err) {
      console.warn('⚠️ Failed to initialize SMTP transporter:', err);
      return null;
    }
  }
  return null;
}

export async function sendLeadNotifications(lead: LeadEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || 'leads@leadsgrow.com';
  const smtpUser = process.env.SMTP_USER || 'no-reply@leadsgrow.com';
  const createdAtStr = lead.createdAt ? new Date(lead.createdAt).toLocaleString() : new Date().toLocaleString();

  const adminSubject = `🔥 New Lead Alert: ${lead.name} (${lead.service})`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #16A34A; border-radius: 8px;">
      <h2 style="color: #16A34A; margin-top: 0;">New Lead Received on LeadsGrow™</h2>
      <p style="font-size: 16px; color: #333;">A new consultation request has been submitted:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Service:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.service}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Source:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.source || 'modal'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Date:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${createdAtStr}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${lead.message || 'No additional message provided.'}</td></tr>
      </table>
      <div style="background-color: #F6FAF7; padding: 12px; border-radius: 6px; text-align: center; color: #15803D; font-weight: bold;">
        LeadsGrow™ — You Believe. We Achieve.
      </div>
    </div>
  `;

  const userSubject = `Thank you for contacting LeadsGrow™ — You Believe. We Achieve.`;
  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0B0F0D; color: #FFFFFF; border-radius: 12px;">
      <h1 style="color: #FFFFFF; margin-top: 0; font-size: 24px;">
        Leads<span style="color: #22C55E;">Grow</span><span style="font-size: 14px; vertical-align: super; color: #B6F23D;">™</span>
      </h1>
      <h2 style="color: #22C55E; margin-top: 10px; font-size: 20px;">We've received your request, ${lead.name}!</h2>
      <p style="color: #9FB0A7; line-height: 1.6; font-size: 15px;">
        Thank you for reaching out to <strong>LeadsGrow</strong> regarding <strong>${lead.service}</strong>.
        Our growth strategist will review your requirements and reach out within <strong>24 hours</strong> with an actionable plan tailored for your brand.
      </p>
      <div style="background-color: #111815; border: 1px solid #1A2420; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #B6F23D;">Your Submission Details:</h4>
        <p style="margin: 4px 0; color: #9FB0A7; font-size: 14px;"><strong>Service:</strong> ${lead.service}</p>
        <p style="margin: 4px 0; color: #9FB0A7; font-size: 14px;"><strong>Phone:</strong> ${lead.phone}</p>
        <p style="margin: 4px 0; color: #9FB0A7; font-size: 14px;"><strong>Email:</strong> ${lead.email}</p>
      </div>
      <p style="color: #9FB0A7; line-height: 1.6; font-size: 14px;">
        In a hurry? Feel free to contact our senior strategist directly via WhatsApp or call us at <strong>+91 98915 05081</strong>.
      </p>
      <hr style="border: 0; border-top: 1px solid #1A2420; margin: 24px 0;" />
      <p style="color: #5B6B63; font-size: 12px; margin: 0; text-align: center;">
        © ${new Date().getFullYear()} LeadsGrow™. All rights reserved. • <em>You Believe. We Achieve.</em>
      </p>
    </div>
  `;

  const transporter = getTransporter();

  if (!transporter) {
    console.log('\n--- [MOCK EMAIL DISPATCH] ---');
    console.log(`[TO ADMIN: ${adminEmail}] ${adminSubject}`);
    console.log(`[TO USER: ${lead.email}] ${userSubject}`);
    console.log('-----------------------------\n');
    return;
  }

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"LeadsGrow System" <${smtpUser}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      }),
      transporter.sendMail({
        from: `"LeadsGrow Team" <${smtpUser}>`,
        to: lead.email,
        subject: userSubject,
        html: userHtml,
      }),
    ]);
    console.log(`✅ Confirmation and notification emails sent for lead: ${lead.email}`);
  } catch (err) {
    console.error('❌ Failed to dispatch email via Nodemailer:', err);
  }
}
