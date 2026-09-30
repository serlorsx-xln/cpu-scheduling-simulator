# Deploy — Coolify

> เป้าหมาย: **https://cpuscheduling-simulator.synverge.dev**
> สถานะ ณ 2026-09-30: เตรียม image และตรวจแล้ว · รอเชื่อม Coolify (token ของ MCP ใช้ไม่ได้) และสิทธิ์อ่าน repo private

## 1. สิ่งที่เตรียมไว้แล้ว

| ไฟล์ | หน้าที่ |
|---|---|
| `Dockerfile` | multi-stage บน `node:24-alpine`: `npm ci` → **รัน unit test** → `next build` → runtime เฉพาะ standalone server (ไม่ใช่ root, `PORT=3000`, `HOSTNAME=0.0.0.0`, มี `HEALTHCHECK`) |
| `.dockerignore` | ไม่ส่ง `node_modules`, `.next`, `.git`, `.env*`, docs ฯลฯ เข้า build context |
| `next.config.ts` | `output: "standalone"`, ปิด `X-Powered-By`, security headers (nosniff, referrer-policy, frame-options, permissions-policy) |
| `app/api/health/route.ts` | `GET /api/health` → `{"status":"ok"}` (no-store) สำหรับ health check |
| `app/fonts/GeistMono-*.woff2` | Geist Mono self-host (SIL OFL, จากแพ็กเกจ `geist`) — **เลิกใช้ `next/font/google`** เพราะ Turbopack build บน linux/amd64 ล้ม (`Can't resolve '@vercel/turbopack-next/internal/font/google/font'`) ทั้งที่บน Mac arm64 ผ่าน; ผลพลอยได้คือ build ไม่ต้องพึ่งเน็ต |
| `package-lock.json` | สร้างใหม่ให้ครบทุกแพลตฟอร์ม — ของเดิมขาด `@emnapi/*` ทำให้ `npm ci` บน Linux ล้ม (runtime deps ไม่เปลี่ยนเวอร์ชัน; เปลี่ยนแค่ patch ของเครื่องมือ dev) |

ตรวจด้วย Docker ทั้ง arm64 และ **linux/amd64 (แพลตฟอร์มเดียวกับเซิร์ฟเวอร์, `--no-cache`)** แล้ว: build ผ่าน (test 60/60 ภายใน build), image ~320 MB, `/api/health` ตอบ ok, Docker health = healthy, หน้าเว็บ + ฟอนต์ + headers ถูกต้อง, E2E ทุกฟีเจอร์ผ่านบน production build (ค่า SET-A ตรงคำนวณมือ)

```bash
docker build -t cpu-scheduling-simulator .
docker run --rm -p 3000:3000 cpu-scheduling-simulator
curl http://localhost:3000/api/health   # {"status":"ok"}
```

## 2. ตั้งค่าใน Coolify

| ช่อง | ค่า |
|---|---|
| Source | `https://github.com/akkanop-x/CPU-Scheduling-Simulator` branch `main` |
| Build pack | **Dockerfile** (ไฟล์ที่ root) |
| Port (exposes) | `3000` |
| Health check | path `/api/health`, port `3000` |
| Domain (FQDN) | `https://cpuscheduling-simulator.synverge.dev` |
| Environment variables | ไม่ต้องมี (แอปทำงานฝั่ง client ทั้งหมด) |

**repo เป็น private** — ต้องให้ Coolify อ่านได้ทางใดทางหนึ่ง:
1. **GitHub App ของ Coolify** (แนะนำ) — Sources → GitHub App → ให้สิทธิ์ repo นี้; push แล้ว deploy อัตโนมัติได้
2. **Deploy Key** — Security → Private Keys สร้าง key → ใส่ public key ใน GitHub repo → Settings → Deploy keys (อ่านอย่างเดียว)
3. เปลี่ยน repo เป็น public (โค้ดเปิดให้ทุกคนเห็น)

หมายเหตุ: คำสั่ง `create_project_from_git` ของ Coolify MCP ดึงได้เฉพาะ repo public — ถ้าใช้ทาง 1 หรือ 2 ให้สร้างแอปใน UI ของ Coolify แล้วใช้ MCP สำหรับ deploy / ผูกโดเมน / ดู log ต่อ

## 3. DNS (ยืดหยุ่น)

ตรวจแล้ว (2026-09-30): โซน `synverge.dev` อยู่บน **Cloudflare** และ `cpuscheduling-simulator.synverge.dev` **มี record อยู่แล้ว** แบบ proxied (IP ของ Cloudflare) ปลายทางตอบ `404 page not found` ของ Traefik = ชี้มาที่ proxy ของ Coolify แล้ว แค่ยังไม่มีแอปผูกโดเมนนี้

เลือกได้ตามสะดวก:

- **ก. ใช้ record เดิม (ง่ายสุด)** — ไม่ต้องแก้ DNS แค่ใส่ FQDN ในแอปแล้ว deploy; Coolify/Traefik ออกใบรับรอง Let's Encrypt เอง
  - Cloudflare SSL/TLS mode ควรเป็น **Full (strict)** หลังออกใบรับรองแล้ว (ถ้าใบยังไม่ออก ใช้ Full ชั่วคราว)
  - ถ้าออกใบรับรองไม่ผ่านเพราะ proxy: สลับ record เป็น DNS only (เมฆสีเทา) ระหว่างออกใบ แล้วค่อยเปิด proxy กลับ
- **ข. ให้ Coolify จัดการ DNS** — ใช้ `bind_application_domain` (ต้องมี Cloudflare token ใน Coolify) จะสร้าง/อัปเดต A record ไปที่ IP เครื่องปลายทางให้เอง — ใช้ `force_domain_override` ถ้า record เดิมผูกกับ resource อื่น
- **ข้อควรระวัง** — ถ้า record เดิมชี้ไปเครื่อง Coolify **คนละเครื่อง** กับที่จะ deploy ต้องแก้ A record ให้ชี้ IP ของเครื่องที่ deploy (ดูได้จาก `list_servers`)

## 4. ขั้นตอนเมื่อ Coolify MCP ใช้ได้

1. push `main` ขึ้น GitHub (มีทุก commit แล้ว)
2. `get_platform_guide` → `get_infrastructure_overview` → เลือก server
3. สร้างแอป (UI เมื่อ repo private หรือ `create_project_from_git` เมื่อ public) ตามตารางข้อ 2
4. `bind_application_domain` host `cpuscheduling-simulator.synverge.dev` (เลือก `create_dns` ตามทาง ก/ข)
5. `trigger_deploy` → `get_logs` ดูจนเห็น test ผ่าน / `✓ Ready`
6. ตรวจหลัง deploy:
   ```bash
   curl -sI https://cpuscheduling-simulator.synverge.dev/ | head -1          # HTTP/2 200
   curl -s  https://cpuscheduling-simulator.synverge.dev/api/health         # {"status":"ok"}
   ```
   และเปิดหน้าเว็บกด SET-A → AVG WT ต้องได้ 4.33 / 3.67 / 7.00

## 5. Rollback

Coolify → แอป → Deployments → redeploy commit ก่อนหน้า (image แต่ละรอบ build จาก commit นั้น)
