import { NextResponse } from "next/server";
import { verifyEmailOtp } from "@/lib/emailOtpStore";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const result = verifyEmailOtp(email, otp);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
      emailVerified: true,
    });
  } catch (error) {
    console.error("Verify email OTP error:", error);

    return NextResponse.json(
      { error: "Failed to verify email OTP." },
      { status: 500 }
    );
  }
}