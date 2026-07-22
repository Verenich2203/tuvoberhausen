const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SITE_URL = process.env.SITE_URL || "https://tuvoberhausen.vercel.app";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function buildEmailHtml(b, cancelUrl) {
  const dateFormatted = b.date
    ? new Date(b.date + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : b.date;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Terminbestätigung – KFZ-Prüfstützpunkt Oberhausen</title>
</head>
<body style="margin:0;padding:0;background-color:#111418;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111418;padding:44px 16px;">
  <tr>
    <td align="center">

      <!--[if mso]><table width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">

        <!-- HEADER -->
        <tr>
          <td style="padding-bottom:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="background-color:#1B1E24;border-radius:14px 14px 0 0;overflow:hidden;border:1px solid rgba(255,255,255,0.07);border-bottom:none;">
              <tr>
                <td style="padding:36px 44px 30px;">
                  <!-- Brand row -->
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;padding-right:12px;">
                        <div style="width:38px;height:38px;background-color:#5B91F4;border-radius:9px;text-align:center;line-height:38px;">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            style="display:inline-block;vertical-align:middle;margin-top:10px;">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                          </svg>
                        </div>
                      </td>
                      <td style="vertical-align:middle;">
                        <span style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#F0F2F5;letter-spacing:-0.01em;">KFZ-Prüfstützpunkt Oberhausen</span><br/>
                        <span style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;color:#8B949E;letter-spacing:0.04em;">Ing.-Büro Qureischi · TÜV NORD Kooperationspartner</span>
                      </td>
                    </tr>
                  </table>
                  <!-- Headline -->
                  <p style="margin:28px 0 6px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:26px;font-weight:800;color:#F0F2F5;letter-spacing:-0.025em;line-height:1.2;">
                    Termin bestätigt.
                  </p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;color:#8B949E;line-height:1.65;">
                    Guten Tag, ${b.name} — Sie wurden erfolgreich für einen Prüftermin eingetragen.
                  </p>
                </td>
              </tr>
              <!-- Accent bar -->
              <tr>
                <td style="height:2px;background:linear-gradient(90deg,#5B91F4 0%,#7AABF8 60%,#1B1E24 100%);"></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background-color:#23272F;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:0 44px;">

            <!-- Date highlight -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:32px 0 26px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 5px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#8B949E;letter-spacing:0.12em;text-transform:uppercase;">Ihr Termin</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:22px;font-weight:800;color:#F0F2F5;letter-spacing:-0.02em;line-height:1.25;">
                    ${dateFormatted}
                  </p>
                  <p style="margin:6px 0 0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#5B91F4;letter-spacing:-0.01em;">
                    ${b.time_slot ? b.time_slot.slice(0, 5) : ''} Uhr
                  </p>
                </td>
              </tr>
            </table>

            <!-- Details grid -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

              <tr>
                <td width="50%" style="padding:20px 16px 20px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;">
                  <p style="margin:0 0 4px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#8B949E;letter-spacing:0.12em;text-transform:uppercase;">Leistung</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#F0F2F5;">${b.service || '—'}</p>
                </td>
                <td width="50%" style="padding:20px 0 20px 16px;border-bottom:1px solid rgba(255,255,255,0.05);border-left:1px solid rgba(255,255,255,0.05);vertical-align:top;">
                  <p style="margin:0 0 4px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#8B949E;letter-spacing:0.12em;text-transform:uppercase;">Kennzeichen</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#F0F2F5;">${b.plate || '—'}</p>
                </td>
              </tr>

              <tr>
                <td colspan="2" style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;">
                  <p style="margin:0 0 4px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#8B949E;letter-spacing:0.12em;text-transform:uppercase;">Standort</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#F0F2F5;">Mülheimer Str. 155 · 46045 Oberhausen</p>
                </td>
              </tr>

            </table>

            ${b.notes ? `
            <!-- Notes -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                  <p style="margin:0 0 4px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#8B949E;letter-spacing:0.12em;text-transform:uppercase;">Anmerkungen</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:13px;color:#8B949E;line-height:1.65;">${b.notes}</p>
                </td>
              </tr>
            </table>` : ''}

            <!-- What to bring -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:26px 0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                    style="background-color:#1B1E24;border-left:3px solid #5B91F4;border-radius:0 8px 8px 0;">
                    <tr>
                      <td style="padding:16px 20px;">
                        <p style="margin:0 0 5px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#5B91F4;letter-spacing:0.1em;text-transform:uppercase;">Bitte mitbringen</p>
                        <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:13px;color:#8B949E;line-height:1.7;">
                          Fahrzeugschein (Zulassungsbescheinigung Teil I).<br/>
                          Bei Eintragungen bitte alle ABE-Dokumente bereithalten.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- CANCEL SECTION -->
        <tr>
          <td style="background-color:#1B1E24;border:1px solid rgba(255,255,255,0.07);border-top:none;border-bottom:none;padding:22px 44px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="margin:0 0 2px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#F0F2F5;">Termin absagen?</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;color:#8B949E;">Jederzeit kostenfrei stornierbar.</p>
                </td>
                <td align="right" style="vertical-align:middle;padding-left:20px;">
                  <a href="${cancelUrl}"
                    style="display:inline-block;padding:10px 20px;background-color:transparent;color:#8B949E;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;text-decoration:none;border-radius:7px;border:1px solid rgba(255,255,255,0.12);letter-spacing:0.02em;white-space:nowrap;">
                    Stornieren
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#14161A;padding:22px 44px;border-radius:0 0 14px 14px;border:1px solid rgba(255,255,255,0.07);border-top:1px solid rgba(255,255,255,0.05);">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 3px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;color:#C2C9D6;">Ing.-Büro Qureischi · KFZ-Prüfstützpunkt</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;color:#414A59;line-height:1.7;">
                    Mülheimer Str. 155 · 46045 Oberhausen<br/>
                    Tel: +49 1575 5476991 · TÜV NORD Kooperationspartner · §29 StVZO
                  </p>
                </td>
                <td align="right" style="vertical-align:top;">
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;color:#414A59;">© ${year}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!--[if mso]></td></tr></table><![endif]-->

    </td>
  </tr>
</table>
</body>
</html>`;
}

function buildAdminEmailHtml(b) {
  const dateFormatted = b.date
    ? new Date(b.date + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const adminUrl = `${SITE_URL}/#admin`;
  const year = new Date().getFullYear();

  const row = (label, value) => value ? `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:11px;font-weight:700;color:#8B949E;text-transform:uppercase;letter-spacing:.1em;width:38%;vertical-align:top;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;">${label}</td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid rgba(255,255,255,.06);font-size:14px;font-weight:600;color:#F0F2F5;vertical-align:top;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;">${value}</td>
    </tr>` : '';

  return `<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Neue Buchung – Admin</title>
</head>
<body style="margin:0;padding:0;background-color:#0D0F15;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0F15;padding:36px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;margin:0 auto;">

      <!-- HEADER -->
      <tr>
        <td style="background-color:#1B1E24;border-radius:12px 12px 0 0;border:1px solid rgba(255,255,255,.07);border-bottom:none;padding:28px 36px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;padding-right:12px;">
                <div style="width:34px;height:34px;background-color:#F59E0B;border-radius:8px;text-align:center;line-height:34px;">
                  <span style="font-size:17px;line-height:34px;display:inline-block;">📋</span>
                </div>
              </td>
              <td style="vertical-align:middle;">
                <span style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;color:#F59E0B;text-transform:uppercase;letter-spacing:.12em;">Neue Buchung</span><br/>
                <span style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#8B949E;">KFZ-Prüfstützpunkt Oberhausen</span>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 4px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:22px;font-weight:800;color:#F0F2F5;letter-spacing:-.02em;line-height:1.2;">
            ${dateFormatted}
          </p>
          <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;color:#5B91F4;letter-spacing:-.01em;">
            ${b.time_slot ? b.time_slot.slice(0, 5) : '—'} Uhr
          </p>
        </td>
      </tr>
      <!-- ACCENT LINE -->
      <tr><td style="height:2px;background:linear-gradient(90deg,#F59E0B 0%,#FCD34D 60%,#1B1E24 100%);"></td></tr>

      <!-- BODY -->
      <tr>
        <td style="background-color:#23272F;border:1px solid rgba(255,255,255,.07);border-top:none;border-bottom:none;padding:4px 36px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row('Kunde', b.name)}
            ${row('Telefon', b.phone ? `<a href="tel:${b.phone}" style="color:#5B91F4;text-decoration:none;">${b.phone}</a>` : null)}
            ${row('E-Mail', b.email ? `<a href="mailto:${b.email}" style="color:#5B91F4;text-decoration:none;">${b.email}</a>` : null)}
            ${row('Kennzeichen', b.plate ? `<span style="background:rgba(91,145,244,.15);color:#7AABF8;padding:2px 10px;border-radius:4px;font-family:monospace;font-size:15px;letter-spacing:.06em;">${b.plate}</span>` : null)}
            ${row('Leistung', b.service)}
            ${b.pickup_service ? row('Abholservice', [b.pickup_address, b.pickup_date && new Date(b.pickup_date+'T00:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}), b.pickup_time ? b.pickup_time.slice(0,5)+' Uhr' : ''].filter(Boolean).join(' · ') || '—') : ''}
            ${b.notes ? row('Anmerkungen', `<em style="color:#8B949E;">${b.notes}</em>`) : ''}
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="background-color:#1B1E24;border:1px solid rgba(255,255,255,.07);border-top:none;border-bottom:none;padding:20px 36px;">
          <a href="${adminUrl}"
            style="display:inline-block;padding:11px 24px;background:linear-gradient(135deg,#5B91F4,#3A72E0);color:#fff;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:.02em;">
            Admin-Panel öffnen →
          </a>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color:#14161A;padding:16px 36px;border-radius:0 0 12px 12px;border:1px solid rgba(255,255,255,.07);border-top:1px solid rgba(255,255,255,.05);">
          <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;color:#414A59;line-height:1.7;">
            Automatische Benachrichtigung · KFZ-Prüfstützpunkt Oberhausen · © ${year}
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: "bookingId required" });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
      console.error("КРИТИЧЕСКАЯ ОШИБКА: Отсутствуют переменные окружения в Vercel!");
      return res.status(500).json({ error: "Missing environment variables" });
    }

    const sbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}&select=*`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    const rows = await sbRes.json();

    if (!Array.isArray(rows)) {
      console.error("Ошибка при запросе в Supabase:", rows);
      return res.status(500).json({ error: "Supabase fetch failed", details: rows });
    }

    if (rows.length === 0) return res.status(404).json({ error: "Booking not found" });

    const b = rows[0];
    const cancelUrl = `${SITE_URL}/api/cancel-booking?token=${b.cancel_token}`;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KFZ-Prüfstützpunkt Oberhausen <noreply@hu-oberhausen.de>",
        to: [b.email],
        subject: `Terminbestätigung – KFZ-Prüfstützpunkt Oberhausen – ${b.date} um ${b.time_slot} Uhr`,
        html: buildEmailHtml(b, cancelUrl),
      }),
    });

    const emailData = await emailRes.json();

    if (!emailRes.ok) {
      console.error("Ошибка от Resend API:", emailData);
      return res.status(500).json({ error: "Email sending failed", details: emailData });
    }

    console.log("Письмо клиенту отправлено для ID:", bookingId);

    // Admin notification
    if (ADMIN_EMAIL) {
      const adminRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "KFZ-Prüfstützpunkt Oberhausen <noreply@hu-oberhausen.de>",
          to: [ADMIN_EMAIL],
          subject: `📋 Neue Buchung: ${b.name} – ${b.date} um ${b.time_slot ? b.time_slot.slice(0,5) : ''} Uhr`,
          html: buildAdminEmailHtml(b),
        }),
      });
      if (!adminRes.ok) {
        const adminErr = await adminRes.json();
        console.error("Fehler beim Admin-Mail:", adminErr);
      } else {
        console.log("Admin-Benachrichtigung gesendet an:", ADMIN_EMAIL);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Фатальная ошибка сервера:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
