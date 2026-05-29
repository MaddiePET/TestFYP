import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Reset Password - DTCOB',
  description: 'Reset Password page for DTCOB banking services.',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}