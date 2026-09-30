/** Health check สำหรับ Docker HEALTHCHECK และ Coolify — ตอบทุกครั้งที่ server รับคำขอได้ */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
