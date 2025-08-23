import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const phone = String(form.get("phone") || "");
    const category = String(form.get("category") || "");
    const message = String(form.get("message") || "");

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    // Gmail の SMTP 設定（環境変数利用）
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 送信内容
    await transporter.sendMail({
      from: `${process.env.SITE_NAME} <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `[${process.env.SITE_NAME}] New Inquiry from ${name}`,
      text: `
New Inquiry Received
--------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Category: ${category}

Message:
${message}
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("MAIL ERROR", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}