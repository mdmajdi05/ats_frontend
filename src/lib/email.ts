interface LeadData {
  type: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  partNumber?: string;
  quantity?: string;
  source?: string;
}

function formatEmailHtml(lead: LeadData): string {
  const typeLabels: Record<string, string> = {
    'quick-quote': 'Quick Quote Request',
    'rfq': 'RFQ Submission',
    'contact': 'Contact Form Message',
    'catalog-download': 'Catalog Download',
  };

  const rows = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Company', lead.company],
    ['Part Number', lead.partNumber],
    ['Quantity', lead.quantity],
    ['Source', lead.source],
  ].filter(([, v]) => v).map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:12px;width:120px;vertical-align:top">${k}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#333;font-size:14px;font-weight:500">${v}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#4F46E5;padding:24px;text-align:center">
      <h1 style="color:white;margin:0;font-size:20px">${typeLabels[lead.type] || 'New Lead'}</h1>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      ${lead.message ? `<div style="margin-top:16px;padding:16px;background:#f9f9f9;border-radius:8px">
        <div style="font-size:12px;color:#666;margin-bottom:4px">Message:</div>
        <div style="font-size:14px;color:#333;white-space:pre-wrap">${lead.message}</div>
      </div>` : ''}
      <div style="margin-top:16px;padding:12px;background:#EEF2FF;border-radius:8px;text-align:center">
        <p style="margin:0;font-size:12px;color:#4F46E5">Received ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
      </div>
    </div>
  </div>
</body></html>`;
}

const FORMSUBMIT_EMAIL = process.env.FORMSUBMIT_EMAIL || process.env.NEXT_PUBLIC_EMAIL_SALES || 'sales@aeroturbinespare.com';
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;

export async function sendLeadNotification(lead: LeadData): Promise<boolean> {
  try {
    const typeLabels: Record<string, string> = {
      'quick-quote': 'Quick Quote Request',
      'rfq': 'RFQ Submission',
      'contact': 'Contact Form Message',
      'catalog-download': 'Catalog Download',
    };

    const subject = `${typeLabels[lead.type] || 'New Lead'} from ${lead.name || lead.email}`;
    const message = [
      `Name: ${lead.name || 'N/A'}`,
      `Email: ${lead.email}`,
      lead.phone ? `Phone: ${lead.phone}` : '',
      lead.company ? `Company: ${lead.company}` : '',
      lead.partNumber ? `Part Number: ${lead.partNumber}` : '',
      lead.quantity ? `Quantity: ${lead.quantity}` : '',
      lead.source ? `Source: ${lead.source}` : '',
      lead.message ? `\nMessage:\n${lead.message}` : '',
    ].filter(Boolean).join('\n');

    const res = await fetch(FORMSUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lead.name || 'Website Lead',
        email: lead.email,
        phone: lead.phone || '',
        message: `[${subject}]\n\n${message}`,
        _subject: subject,
        _template: 'table',
      }),
    });

    if (res.ok) {
      console.log('[Lead] Email sent via FormSubmit');
      return true;
    }

    console.warn('[Lead] FormSubmit returned', res.status);
    return false;
  } catch (err) {
    console.error('[Lead] FormSubmit send failed:', err);
    return false;
  }
}
