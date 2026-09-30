import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

/** LINE Seed Sans TH (SIL OFL 1.1) — self-host เป็น woff2 ไฟล์ static (ไม่มี variable axes) จึงประกาศ weight ตรงตัว */
const thai = localFont({
  src: [
    { path: "./fonts/LINESeedSansTH-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/LINESeedSansTH-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-thai",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  preload: true,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "CPU Scheduling Simulator",
  description:
    "จำลองและเปรียบเทียบอัลกอริทึม CPU Scheduling: FCFS, SJF (Non-preemptive), Round Robin",
  openGraph: {
    title: "CPU Scheduling Simulator",
    description:
      "จำลองและเปรียบเทียบอัลกอริทึม CPU Scheduling: FCFS, SJF (Non-preemptive), Round Robin",
    type: "website",
    locale: "th_TH",
  },
};

export const viewport = {
  themeColor: "#1a1a1e",
  colorScheme: "dark" as const,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`dark ${thai.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
