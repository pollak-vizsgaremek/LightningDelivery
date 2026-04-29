import nodemailer from "nodemailer";

const mailUser = String(process.env.EMAIL_USER ?? "").trim();
const mailPass = String(process.env.GOOGLE_APP_PASSWORD ?? "")
  .replace(/\s+/g, "")
  .trim();

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: mailUser,
    pass: mailPass,
  },
  secure: true,
});

const canSendEmail = Boolean(mailUser && mailPass);

if (!canSendEmail) {
  console.warn(
    "Email küldés letiltva: EMAIL_USER vagy GOOGLE_APP_PASSWORD nincs beállítva.",
  );
}

function sendRecoveryEmail(email, link) {
  if (!canSendEmail) {
    return;
  }

  transporter.sendMail(
    {
      from: mailUser,
      to: email,
      subject: "Elfelejtett jelszó",
      text: `A jelszó helyreállítási link: ${link}`,
    },
    (err, info) => {
      if (err) {
        console.error(err);
        return;
      }

      return info;
    },
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderOrderHtml({ userName, orderId, items, address, paymentMethod }) {
  const rows = (items ?? [])
    .map((item) => {
      const quantity = Number(item?.quantity ?? 1);
      const price = Number(item?.price ?? 0);
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #1f2937;color:#f3f4f6;">${escapeHtml(item?.type ?? "Tétel")}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1f2937;color:#f3f4f6;">${escapeHtml(item?.name ?? "-")}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1f2937;color:#f3f4f6;text-align:right;">${quantity} db</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1f2937;color:#fbbf24;text-align:right;">${price > 0 ? `${price} Ft` : "-"}</td>
        </tr>
      `;
    })
    .join("");

  return `
  <div style="margin:0;padding:24px;background:#020617;font-family:Segoe UI,Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">
      <div style="padding:20px 24px;background:linear-gradient(135deg,#111827,#1f2937);border-bottom:1px solid #334155;">
        <h1 style="margin:0;color:#f8fafc;font-size:24px;line-height:1.2;">Lightning Delivery</h1>
        <p style="margin:8px 0 0;color:#fbbf24;font-size:14px;font-weight:700;">Sikeres rendelés visszaigazolás</p>
      </div>

      <div style="padding:20px 24px;">
        <p style="margin:0 0 10px;color:#e5e7eb;font-size:15px;">Kedves ${escapeHtml(userName || "Felhasználó")}!</p>
        <p style="margin:0 0 16px;color:#cbd5e1;font-size:14px;">A rendelésedet sikeresen rögzítettük.</p>

        <div style="margin:0 0 16px;padding:12px;border:1px solid #334155;border-radius:10px;background:#111827;">
          <p style="margin:0;color:#f8fafc;font-size:14px;">Rendelés azonosító: <strong style="color:#fbbf24;">#${escapeHtml(orderId)}</strong></p>
          <p style="margin:6px 0 0;color:#cbd5e1;font-size:13px;">Szállítási cím: ${escapeHtml(address || "Nincs megadva")}</p>
          <p style="margin:6px 0 0;color:#cbd5e1;font-size:13px;">Fizetési mód: ${escapeHtml(paymentMethod || "Nincs megadva")}</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #1f2937;border-radius:10px;overflow:hidden;">
          <thead>
            <tr style="background:#111827;">
              <th style="padding:10px 12px;color:#fbbf24;text-align:left;font-size:12px;font-weight:700;border-bottom:1px solid #1f2937;">Típus</th>
              <th style="padding:10px 12px;color:#fbbf24;text-align:left;font-size:12px;font-weight:700;border-bottom:1px solid #1f2937;">Megnevezés</th>
              <th style="padding:10px 12px;color:#fbbf24;text-align:right;font-size:12px;font-weight:700;border-bottom:1px solid #1f2937;">Mennyiség</th>
              <th style="padding:10px 12px;color:#fbbf24;text-align:right;font-size:12px;font-weight:700;border-bottom:1px solid #1f2937;">Ár</th>
            </tr>
          </thead>
          <tbody>
            ${rows || ""}
          </tbody>
        </table>

        <p style="margin:18px 0 0;color:#94a3b8;font-size:12px;">Köszönjük, hogy minket választottál.</p>
      </div>
    </div>
  </div>
  `;
}

export async function sendOrderSuccessEmail({
  email,
  userName,
  orderId,
  quantity,
  items,
  address,
  paymentMethod,
}) {
  if (!email) {
    return;
  }

  if (!canSendEmail) {
    return;
  }

  const normalizedItems = Array.isArray(items) ? items : [];
  const html = renderOrderHtml({
    userName,
    orderId,
    items: normalizedItems,
    address,
    paymentMethod,
  });

  console.log(`[MAIL_TEMPLATE] ORDER_HTML_V2 sent for order #${orderId}`);

  await transporter.sendMail({
    from: mailUser,
    to: email,
    subject: `Sikeres rendelés #${orderId} - Lightning Delivery`,
    html,
  });
}

export default sendRecoveryEmail;
