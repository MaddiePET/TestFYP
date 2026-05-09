type EmailOtpRecord = {
  otp: string;
  expiresAt: number;
};

const emailOtpStore = new Map<string, EmailOtpRecord>();

export function saveEmailOtp(email: string, otp: string) {
  emailOtpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
}

export function verifyEmailOtp(email: string, otp: string) {
  const record = emailOtpStore.get(email);

  if (!record) {
    return {
      success: false,
      message: "OTP not found. Please request a new code.",
    };
  }

  if (Date.now() > record.expiresAt) {
    emailOtpStore.delete(email);

    return {
      success: false,
      message: "OTP expired. Please request a new code.",
    };
  }

  if (record.otp !== otp) {
    return {
      success: false,
      message: "Invalid OTP code.",
    };
  }

  emailOtpStore.delete(email);

  return {
    success: true,
    message: "Email verified successfully.",
  };
}