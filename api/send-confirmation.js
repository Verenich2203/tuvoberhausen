const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SITE_URL = process.env.SITE_URL || "https://tuvoberhausen.vercel.app";

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
  <title>Terminbestätigung – AutoService Oberhausen</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F2F5;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F2F5;padding:48px 16px;">
  <tr>
    <td align="center">

      <!--[if mso]><table width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">

        <!-- HEADER -->
        <tr>
          <td style="padding-bottom:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="background-color:#0F172A;border-radius:16px 16px 0 0;overflow:hidden;">
              <tr>
                <td style="padding:36px 48px 32px;">
                  <!-- Logo row -->
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;padding-right:14px;">
                        <!-- Checkmark circle SVG -->
                        <div style="width:44px;height:44px;background-color:#1E293B;border-radius:12px;text-align:center;line-height:44px;">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            style="display:inline-block;vertical-align:middle;margin-top:11px;">
                            <path d="M20 6L9 17L4 12" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      </td>
                      <td style="vertical-align:middle;">
                        <span style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:-0.01em;">AutoService Oberhausen</span>
                      </td>
                    </tr>
                  </table>
                  <!-- Headline -->
                  <p style="margin:28px 0 6px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:28px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.25;">
                    Ihr Termin ist<br/>bestätigt.
                  </p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:15px;color:#94A3B8;line-height:1.6;">
                    Guten Tag, ${b.name} — wir freuen uns auf Ihren Besuch.
                  </p>
                </td>
              </tr>
              <!-- Accent bar -->
              <tr>
                <td style="height:3px;background:linear-gradient(90deg,#6366F1 0%,#818CF8 50%,#0F172A 100%);"></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background-color:#FFFFFF;padding:0 48px;">

            <!-- Date highlight block -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:36px 0 28px;border-bottom:1px solid #F1F5F9;">
                  <p style="margin:0 0 6px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;">Termin</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:24px;font-weight:700;color:#0F172A;letter-spacing:-0.02em;line-height:1.3;">
                    ${dateFormatted}
                  </p>
                  <p style="margin:6px 0 0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:17px;font-weight:600;color:#6366F1;">
                    ${b.time_slot ? b.time_slot.slice(0, 5) : ''} Uhr
                  </p>
                </td>
              </tr>
            </table>

            <!-- Details grid -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">

              <tr>
                <td width="50%" style="padding:22px 20px 22px 0;border-bottom:1px solid #F1F5F9;vertical-align:top;">
                  <p style="margin:0 0 5px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;">Leistung</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#1E293B;">${b.service || '—'}</p>
                </td>
                <td width="50%" style="padding:22px 0 22px 20px;border-bottom:1px solid #F1F5F9;border-left:1px solid #F1F5F9;vertical-align:top;">
                  <p style="margin:0 0 5px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;">Fahrzeugtyp</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#1E293B;">${b.vehicle_type || '—'}</p>
                </td>
              </tr>

              <tr>
                <td width="50%" style="padding:22px 20px 22px 0;border-bottom:1px solid #F1F5F9;vertical-align:top;">
                  <p style="margin:0 0 5px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;">Kennzeichen</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#1E293B;">${b.plate || '—'}</p>
                </td>
                <td width="50%" style="padding:22px 0 22px 20px;border-bottom:1px solid #F1F5F9;border-left:1px solid #F1F5F9;vertical-align:top;">
                  <p style="margin:0 0 5px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;">Standort</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#1E293B;">Musterstraße 123<br/>46045 Oberhausen</p>
                </td>
              </tr>

            </table>

            ${b.notes ? `
            <!-- Notes -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:22px 0;border-bottom:1px solid #F1F5F9;">
                  <p style="margin:0 0 5px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;">Ihre Anmerkungen</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;color:#475569;line-height:1.6;">${b.notes}</p>
                </td>
              </tr>
            </table>` : ''}

            <!-- What to bring -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:28px 0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                    style="background-color:#F8FAFC;border-left:3px solid #6366F1;border-radius:0 8px 8px 0;">
                    <tr>
                      <td style="padding:18px 22px;">
                        <p style="margin:0 0 6px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;color:#6366F1;letter-spacing:0.08em;text-transform:uppercase;">Bitte mitbringen</p>
                        <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;color:#475569;line-height:1.7;">
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
          <td style="background-color:#FAFAFA;border-top:1px solid #E2E8F0;padding:28px 48px;border-radius:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="margin:0 0 2px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#0F172A;">Termin absagen?</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:13px;color:#64748B;">Bis 24 Stunden vorher kostenlos stornierbar.</p>
                </td>
                <td align="right" style="vertical-align:middle;white-space:nowrap;padding-left:24px;">
                  <a href="${cancelUrl}"
                    style="display:inline-block;padding:11px 22px;background-color:#FFFFFF;color:#64748B;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;text-decoration:none;border-radius:8px;border:1px solid #CBD5E1;letter-spacing:0.01em;">
                    Stornieren
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#0F172A;padding:24px 48px;border-radius:0 0 16px 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 4px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#E2E8F0;">AutoService Oberhausen</p>
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;color:#475569;line-height:1.6;">
                    Musterstraße 123 · 46045 Oberhausen<br/>
                    Tel: +49 1575 5476991 · Amtl. anerkannte Prüfstelle §29 StVZO
                  </p>
                </td>
                <td align="right" style="vertical-align:top;">
                  <p style="margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;color:#334155;">© ${year}</p>
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

export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: "bookingId required" });

    // 0. Защита: проверяем, загрузились ли переменные из Vercel
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
      console.error("КРИТИЧЕСКАЯ ОШИБКА: Отсутствуют переменные окружения в Vercel!");
      return res.status(500).json({ error: "Missing environment variables" });
    }

    // 1. Получить данные брони из Supabase
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

    // Защита: проверяем, что Supabase вернул массив данных, а не ошибку авторизации
    if (!Array.isArray(rows)) {
      console.error("Ошибка при запросе в Supabase:", rows);
      return res.status(500).json({ error: "Supabase fetch failed", details: rows });
    }

    if (rows.length === 0) return res.status(404).json({ error: "Booking not found" });

    const b = rows[0];
    const cancelUrl = `${SITE_URL}/api/cancel-booking?token=${b.cancel_token}`;

    // 2. Отправить письмо через Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AutoService Oberhausen <onboarding@resend.dev>",
        to: [b.email],
        subject: `✅ Terminbestätigung – ${b.date} um ${b.time_slot} Uhr`,
        html: buildEmailHtml(b, cancelUrl),
      }),
    });

    // Обработка ответа от Resend
    const emailData = await emailRes.json();

    if (!emailRes.ok) {
      console.error("Ошибка от Resend API:", emailData);
      return res.status(500).json({ error: "Email sending failed", details: emailData });
    }

    console.log("Письмо успешно отправлено для ID:", bookingId);
    return res.status(200).json({ ok: true });

  } catch (error) {
    // Этот блок ловит любые фатальные сбои (чтобы не было FUNCTION_INVOCATION_FAILED)
    console.error("Фатальная ошибка сервера:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}