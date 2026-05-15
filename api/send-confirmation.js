const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SITE_URL = process.env.SITE_URL || "https://tuvoberhausen.vercel.app";

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
        html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          
          <tr>
            <td style="background:#1A56DB;padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:8px;display:inline-block;line-height:36px;text-align:center;font-size:18px;">🔧</div>
              </div>
              <h1 style="margin:12px 0 4px;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.02em;">AutoService Oberhausen</h1>
              <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Amtlich anerkannte Kfz-Prüfstelle</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <div style="display:inline-block;width:64px;height:64px;background:#EFF6FF;border-radius:50%;line-height:64px;font-size:28px;margin-bottom:16px;">✅</div>
              <h2 style="margin:0 0 8px;color:#0F1923;font-size:24px;font-weight:800;letter-spacing:-0.02em;">Ihr Termin ist bestätigt!</h2>
              <p style="margin:0;color:#64748B;font-size:14px;line-height:1.6;">Vielen Dank, ${b.name}. Wir freuen uns auf Ihren Besuch.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #E2E8F0;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.12em;">Datum & Uhrzeit</p>
                    <p style="margin:0;font-size:18px;font-weight:800;color:#1A56DB;">${b.date} · ${b.time_slot} Uhr</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #E2E8F0;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.12em;">Leistung</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#0F1923;">${b.service}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #E2E8F0;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.12em;">Fahrzeug</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#0F1923;">${b.vehicle_type} · ${b.plate}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.12em;">Adresse</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#0F1923;">Musterstraße 123, 46045 Oberhausen</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 28px;">
              <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.08em;">📋 Bitte mitbringen</p>
                <p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;">Fahrzeugschein (Zulassungsbescheinigung Teil I). Bei Eintragungen bitte alle ABE-Dokumente mitbringen.</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px 24px;">
                <p style="margin:0 0 6px;font-size:13px;color:#64748B;line-height:1.6;">Sie möchten den Termin absagen?<br/>Bis 24 Stunden vorher kostenlos stornierbar.</p>
                <a href="${cancelUrl}" 
                   style="display:inline-block;margin-top:14px;padding:12px 28px;background:#ffffff;color:#EF4444;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;border:1.5px solid #FCA5A5;letter-spacing:0.04em;text-transform:uppercase;">
                  ❌ Termin stornieren
                </a>
                <p style="margin:10px 0 0;font-size:11px;color:#94A3B8;">Oder anrufen: +49 1575 5476991</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:#0A2540;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
                AutoService Oberhausen · Musterstraße 123 · 46045 Oberhausen<br/>
                © ${new Date().getFullYear()} AutoService Oberhausen · Amtlich anerkannte Prüfstelle §29 StVZO
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
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