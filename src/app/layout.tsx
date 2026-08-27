import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Friday — Task Management for Marketing Teams",
  description:
    "Friday is the task management SaaS built for marketing teams: plan campaigns, run content and social calendars, and ship marketing work without the chaos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
