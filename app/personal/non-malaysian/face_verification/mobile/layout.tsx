import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Personal Account Non-Malaysian Mobile Face Capture - DTCOB',
  description: 'Personal Account Non-Malaysian Mobile Face Capture page for DTCOB banking services.',
};

export default function PersonalNonMalaysianMobileFaceCaptureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}