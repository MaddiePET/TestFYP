import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Personal Account Malaysian Face QR Code Scan - DTCOB',
  description: 'Personal Account Malaysian Face QR Code Scan page for DTCOB banking services.',
};

export default function PersonalMalaysianFaceQRCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}