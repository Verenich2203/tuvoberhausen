const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_URL = process.env.SITE_URL || "https://tuvoberhausen.vercel.app";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.redirect(`${SITE_URL}?cancel=invalid`);
  }

  // 1. Найти бронь по токену
  const findRes = await fetch(
    `${SUPABASE_URL}/rest/v1/bookings?cancel_token=eq.${token}&select=*`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  const rows = await findRes.json();

  if (!rows || rows.length === 0) {
    return res.redirect(`${SITE_URL}?cancel=notfound`);
  }

  const booking = rows[0];

  // 2. Проверить что бронь ещё активна
  if (booking.status === "cancelled") {
    return res.redirect(`${SITE_URL}?cancel=already`);
  }

  // 3. Проверить что до термина ещё больше 24 часов
  const bookingDateTime = new Date(`${booking.date}T${booking.time_slot}:00`);
  const now = new Date();
  const hoursUntil = (bookingDateTime - now) / (1000 * 60 * 60);

  if (hoursUntil < 24) {
    return res.redirect(`${SITE_URL}?cancel=toolate`);
  }

  // 4. Отменить бронь
  const updateRes = await fetch(
    `${SUPABASE_URL}/rest/v1/bookings?id=eq.${booking.id}`,
    {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ status: "cancelled" }),
    }
  );

  if (!updateRes.ok) {
    return res.redirect(`${SITE_URL}?cancel=error`);
  }

  // 5. Редирект на страницу успеха
  return res.redirect(`${SITE_URL}?cancel=success&date=${booking.date}&time=${booking.time_slot}`);
}
