import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

/** LINE Seed Sans TH (SIL OFL 1.1) — self-host woff2 แบบ static จึงประกาศ weight ตรงตัว */
const thai = localFont({
  src: [
    { path: "./fonts/LINESeedSansTH-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/LINESeedSansTH-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-thai",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** ตัวเลขที่ต้องเรียงคอลัมน์ (ตาราง แกนเวลา) — LINE Seed ไม่มี tabular figures */
const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
});

const description =
  "จำลองและเปรียบเทียบอัลกอริทึม CPU Scheduling: FCFS, SJF (Non-preemptive) และ Round Robin ด้วยชุดข้อมูลเดียวกัน";

export const metadata: Metadata = {
  title: "CPU Scheduling Simulator",
  description,
  openGraph: {
    title: "CPU Scheduling Simulator",
    description,
    type: "website",
    locale: "th_TH",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`dark ${thai.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <TooltipProvider delayDuration={120}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
