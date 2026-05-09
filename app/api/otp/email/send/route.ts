import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveEmailOtp } from "@/lib/emailOtpStore";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP code.
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the OTP temporarily so it can be verified later.
    saveEmailOtp(email, otp);

    // Create the email transporter using the project Gmail account.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the OTP email to the user.
    await transporter.sendMail({
      from: `"Bank A" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Bank A Email Verification Code",
      html: `
  <div style="margin:0; padding:0; background-color:#f5f7fb; font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:560px; margin:0 auto; padding:40px 16px;">
      <div style="background-color:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #d9dce8;">
        
        <div style="background-color:#2c2f42; padding:30px 32px; text-align:center;">
          <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:800; letter-spacing:0.4px;">
            DTCOB Banking Services
          </h1>

          <p style="margin:8px 0 0; color:#c7d2fe; font-size:13px; font-weight:600; letter-spacing:0.4px;">
            Email Verification
          </p>
        </div>

        <div style="padding:36px 32px 32px;">
          <p style="margin:0 0 12px; color:#2c2f42; font-size:22px; font-weight:800; text-align:center; letter-spacing:0.2px;">
            Verify your email address
          </p>

          <p style="margin:0 auto 28px; max-width:420px; color:#374151; font-size:14px; line-height:1.7; text-align:center;">
            Please enter the verification code below to continue your account registration.
          </p>

          <div style="text-align:center; margin:32px 0;">
            <div style="display:inline-block; background-color:#eef2ff; border:2px solid #3D405B; color:#2c2f42; font-size:36px; font-weight:800; letter-spacing:10px; padding:18px 28px; border-radius:14px;">
              ${otp}
            </div>
          </div>

          <p style="margin:0 0 8px; color:#2c2f42; font-size:14px; line-height:1.6; text-align:center;">
            This code will expire in <strong>5 minutes</strong>.
          </p>

          <p style="margin:0 auto; max-width:420px; color:#4b5563; font-size:13px; line-height:1.6; text-align:center;">
            If you did not request this verification code, you can safely ignore this email.
          </p>
        </div>

        <div style="padding:18px 32px; background-color:#f1f2f6; border-top:1px solid #d9dce8; text-align:center;">
          <p style="margin:0; color:#6b7280; font-size:12px; line-height:1.5;">
            This is an automated email from DTCOB Banking Services. Please do not reply.
          </p>
        </div>

      </div>
    </div>
  </div>
`,

    });
    return NextResponse.json({
      message: "Email OTP sent successfully.",
    });
  } catch (error) {
    console.error("Send email OTP error:", error);

    return NextResponse.json(
      { error: "Failed to send email OTP." },
      { status: 500 }
    );
  }
}