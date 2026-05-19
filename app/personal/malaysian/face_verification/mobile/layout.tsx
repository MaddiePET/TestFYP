import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Personal Account Malaysian Mobile Face Capture - DTCOB',
  description: 'Personal Account Malaysian Mobile Face Capture page for DTCOB banking services.',
};

export default function PersonalMalaysianMobileFaceCaptureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}