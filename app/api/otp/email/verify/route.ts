import { NextResponse } from "next/server";
import { verifyEmailOtp } from "@/lib/emailOtpStore";

export async function POST(req: Request) {
  try {
    //reads the email and otp entered by the user from request body
    const { email, otp } = await req.json();
    
    //ensure both email and otp are provided before continuing
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    //checks whether the OTP matches the one generated and stored
    const result = verifyEmailOtp(email, otp);

    //returns error if otp is missing,expired or incorrect
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // Return success only after the OTP has been verified
    return NextResponse.json({
      message: result.message,
      emailVerified: true,
    });
  } catch (error) {
    // Log the technical error in the terminal for debugging
    console.error("Verify email OTP error:", error);

    // Return a general error message to the frontend.
    return NextResponse.json(
      { error: "Failed to verify email OTP." },
      { status: 500 }
    );
  }
}