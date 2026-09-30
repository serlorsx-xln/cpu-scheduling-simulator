import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

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

/**
 * Geist Mono (SIL OFL 1.1, จากแพ็กเกจ geist ของ Vercel) — ตัวเลขที่ต้องเรียงคอลัมน์ (ตาราง แกนเวลา)
 * self-host แทน next/font/google: Turbopack build บน linux/amd64 resolve ฟอนต์ Google ไม่ได้
 * และไม่ต้องพึ่งเน็ตตอน build
 */
const mono = localFont({
  src: [
    { path: "./fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeistMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeistMono-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
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
