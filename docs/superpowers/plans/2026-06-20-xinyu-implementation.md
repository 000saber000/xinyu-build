# Xinyu Mental-Wellness Station Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved “心屿” local-first mental-wellness website with an immersive garden, user-configured AI chat, journal, three gentle games, and crisis-safety behavior.

**Architecture:** Create an isolated Next.js application under `D:/CodexProject/xinyu`. Keep domain modules independent: the garden only links to features, storage is hidden behind repositories, chat uses a provider-neutral adapter, and the proxy is stateless with strict destination validation. Use layered responsive imagery and CSS/Canvas effects instead of a full 3D engine.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, Testing Library, Playwright, Dexie/IndexedDB, Zod, Web Streams, CSS animations, Canvas 2D.

---

## File map

```text
xinyu/
├── app/
│   ├── api/chat/route.ts                  # Stateless validated streaming proxy
│   ├── api/health/route.ts                # App health endpoint
│   ├── chat/page.tsx                      # Listening cottage
│   ├── diary/page.tsx                     # Mood diary and trends
│   ├── games/breathe/page.tsx             # Breathing flower
│   ├── games/page.tsx                     # Greenhouse game hub
│   ├── games/stream/page.tsx              # Emotion stream
│   ├── games/garden/page.tsx              # Plant-care game
│   ├── settings/page.tsx                  # API, privacy, motion, data controls
│   ├── globals.css                        # Tokens, reset, accessibility styles
│   ├── layout.tsx                         # Providers and shell
│   └── page.tsx                           # Immersive courtyard
├── components/
│   ├── app-shell.tsx                      # Navigation and content frame
│   ├── crisis-panel.tsx                   # Immediate real-world help panel
│   ├── glass-panel.tsx                    # Shared accessible glass surface
│   └── garden/
│       ├── companion-picker.tsx           # Five companions
│       ├── courtyard.tsx                  # Layered scene and hotspots
│       └── mood-check-in.tsx               # Five-state check-in
├── features/
│   ├── chat/
│   │   ├── chat-client.ts                 # Provider-neutral stream parser
│   │   ├── chat-controller.ts             # Chat state machine
│   │   ├── chat-types.ts                  # Shared chat contracts
│   │   └── listening-room.tsx             # Conversation UI
│   ├── companions/catalog.ts              # Companion presentation presets
│   ├── diary/diary-view.tsx               # Calendar/list/trend composition
│   ├── games/
│   │   ├── breathing-machine.ts            # Pure breathing state machine
│   │   ├── breathing-view.tsx
│   │   ├── garden-engine.ts                # Pure rewards and plant state
│   │   ├── garden-view.tsx
│   │   ├── stream-engine.ts                # Save/destroy decision model
│   │   └── stream-view.tsx
│   ├── safety/crisis-detection.ts          # High-confidence local rules
│   └── settings/api-config-form.tsx        # BYO API configuration
├── lib/
│   ├── db.ts                               # Dexie schema and migrations
│   ├── repositories.ts                     # Storage interfaces and implementation
│   ├── avatar-store.ts                     # IndexedDB-backed custom avatar blob
│   ├── export-data.ts                      # Versioned safe export/import
│   ├── proxy-policy.ts                     # SSRF and host allow-list policy
│   └── schemas.ts                          # Zod schemas shared across boundaries
├── public/garden/                          # Optimized layered scene assets
├── tests/                                  # Vitest tests mirroring modules
├── e2e/                                    # Playwright journeys
├── playwright.config.ts
└── vitest.config.ts
```

## Task 1: Scaffold the isolated application and test harness

**Files:**
- Create: `xinyu/package.json`
- Create: `xinyu/vitest.config.ts`
- Create: `xinyu/playwright.config.ts`
- Create: `xinyu/tests/setup.ts`
- Create: `xinyu/app/layout.tsx`
- Create: `xinyu/app/page.tsx`
- Test: `xinyu/tests/smoke/home.test.tsx`

- [ ] **Step 1: Scaffold Next.js without modifying other workspace files**

Run:

```powershell
npx create-next-app@latest xinyu --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm
Set-Location xinyu
npm install dexie zod
npm install -D vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test fake-indexeddb
```

Expected: `xinyu/package.json` exists and npm exits with code 0.

- [ ] **Step 2: Add deterministic test scripts to `xinyu/package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "npm run lint && npm run test && npm run build"
  }
}
```

Preserve dependencies generated by create-next-app; replace only the `scripts` object.

- [ ] **Step 3: Write the failing home smoke test**

```tsx
// tests/smoke/home.test.tsx
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

it("introduces the courtyard journey", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { name: "今天，想去哪里走走？" })).toBeVisible();
});
```

- [ ] **Step 4: Configure Vitest and run the failing test**

```ts
// vitest.config.ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

```ts
// tests/setup.ts
import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
```

Run: `npm test -- tests/smoke/home.test.tsx`

Expected: FAIL because the generated homepage does not contain the approved heading.

- [ ] **Step 5: Replace the generated homepage with the minimum semantic shell**

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>今天，想去哪里走走？</h1>
    </main>
  );
}
```

Run: `npm test -- tests/smoke/home.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit the scaffold**

```powershell
git add xinyu
git commit -m "chore: scaffold Xinyu app and test harness"
```

## Task 2: Establish the approved visual system and accessible shell

**Files:**
- Modify: `xinyu/app/globals.css`
- Modify: `xinyu/app/layout.tsx`
- Create: `xinyu/components/glass-panel.tsx`
- Create: `xinyu/components/app-shell.tsx`
- Test: `xinyu/tests/components/app-shell.test.tsx`

- [ ] **Step 1: Write the navigation and reduced-motion tests**

```tsx
// tests/components/app-shell.test.tsx
import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/app-shell";

it("exposes all primary destinations", () => {
  render(<AppShell><div>内容</div></AppShell>);
  for (const name of ["漫游", "心情日记", "小游戏", "设置"]) {
    expect(screen.getByRole("link", { name })).toBeVisible();
  }
  expect(screen.getByRole("main")).toHaveTextContent("内容");
});
```

Run: `npm test -- tests/components/app-shell.test.tsx`

Expected: FAIL because `AppShell` does not exist.

- [ ] **Step 2: Implement the focused shared surfaces**

```tsx
// components/glass-panel.tsx
import type { HTMLAttributes } from "react";

export function GlassPanel({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`glass-panel ${className}`} {...props} />;
}
```

```tsx
// components/app-shell.tsx
import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["漫游", "/"], ["心情日记", "/diary"], ["小游戏", "/games"], ["设置", "/settings"],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar"><Link href="/" className="brand">心屿</Link>
        <nav aria-label="主导航">{links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Define the design tokens and accessibility behavior**

```css
/* append to app/globals.css after the Tailwind import */
:root {
  --ivory: #f6f1e7; --sage: #8ea58c; --lavender: #b9afce;
  --moss: #566b57; --sun: #e8c98d; --ink: #26352a;
  --glass: rgb(246 241 231 / 0.68); --focus: #3f6347;
}
html { color: var(--ink); background: var(--ivory); font-size: 16px; }
body { min-height: 100vh; }
a, button, input, textarea, select { outline-offset: 4px; }
:focus-visible { outline: 3px solid var(--focus); }
.glass-panel { background: var(--glass); border: 1px solid rgb(255 255 255 / .62); box-shadow: 0 18px 50px rgb(38 53 42 / .14); backdrop-filter: blur(18px); }
.topbar { position: fixed; z-index: 50; inset: 1.5rem 2.5rem auto; display: flex; justify-content: space-between; align-items: center; padding: .9rem 1.4rem; border-radius: 999px; background: var(--glass); backdrop-filter: blur(18px); }
.topbar nav { display: flex; gap: 2rem; }
.brand { font-size: 1.4rem; font-weight: 700; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; } }
```

Run: `npm test -- tests/components/app-shell.test.tsx`

Expected: PASS.

- [ ] **Step 4: Wrap the application in `AppShell` and commit**

```tsx
// app/layout.tsx body content
<body><AppShell>{children}</AppShell></body>
```

```powershell
git add xinyu/app xinyu/components xinyu/tests/components
git commit -m "feat: add Xinyu visual tokens and app shell"
```

## Task 3: Build the responsive layered courtyard

**Files:**
- Create: `xinyu/components/garden/courtyard.tsx`
- Create: `xinyu/public/garden/courtyard-base.webp`
- Create: `xinyu/public/garden/courtyard-foreground.webp`
- Create: `xinyu/public/garden/mist.webp`
- Modify: `xinyu/app/page.tsx`
- Modify: `xinyu/app/globals.css`
- Test: `xinyu/tests/garden/courtyard.test.tsx`

- [ ] **Step 1: Write the failing hotspot test**

```tsx
// tests/garden/courtyard.test.tsx
import { render, screen } from "@testing-library/react";
import { Courtyard } from "@/components/garden/courtyard";

it("links every scene destination", () => {
  render(<Courtyard />);
  expect(screen.getByRole("link", { name: /倾听小屋/ })).toHaveAttribute("href", "/chat");
  expect(screen.getByRole("link", { name: /心绪溪流/ })).toHaveAttribute("href", "/games/stream");
  expect(screen.getByRole("link", { name: /静心花房/ })).toHaveAttribute("href", "/games");
});
```

Run: `npm test -- tests/garden/courtyard.test.tsx`

Expected: FAIL because `Courtyard` does not exist.

- [ ] **Step 2: Generate and optimize the three approved visual layers**

Use the confirmed UI concept as the visual reference. Generate one 16:9 courtyard base without text or UI, one transparent/isolated foreground foliage layer, and one subtle mist layer. Save final optimized WebP files at the exact paths above. Verify the combined image keeps the cottage left, stream center, and conservatory right so hotspots remain stable.

Run: `Get-Item public/garden/*.webp | Select-Object Name,Length`

Expected: three files exist; each is below 1.5 MB, and the total is below 3 MB.

- [ ] **Step 3: Implement semantic hotspots over decorative layers**

```tsx
// components/garden/courtyard.tsx
import Link from "next/link";

const places = [
  { className: "cottage", href: "/chat", title: "倾听小屋", detail: "与 AI 对话，倾听心声" },
  { className: "stream", href: "/games/stream", title: "心绪溪流", detail: "释放情绪，放松心绪" },
  { className: "greenhouse", href: "/games", title: "静心花房", detail: "呼吸练习与植物养成" },
] as const;

export function Courtyard() {
  return (
    <section className="courtyard" aria-label="心屿庭院">
      <div className="garden-layer garden-base" aria-hidden="true" />
      <div className="garden-layer garden-mist" aria-hidden="true" />
      <h1>今天，想去哪里走走？</h1>
      {places.map((place) => (
        <Link key={place.title} className={`place-hotspot ${place.className}`} href={place.href}>
          <strong>{place.title}</strong><span>{place.detail}</span>
        </Link>
      ))}
      <div className="garden-layer garden-foreground" aria-hidden="true" />
    </section>
  );
}
```

- [ ] **Step 4: Add desktop layers and mobile journey styles**

```css
.courtyard { position: relative; min-height: 100svh; overflow: hidden; isolation: isolate; }
.garden-layer { position: absolute; inset: 0; background-position: center; background-size: cover; pointer-events: none; }
.garden-base { z-index: -3; background-image: url('/garden/courtyard-base.webp'); }
.garden-mist { z-index: -2; background-image: url('/garden/mist.webp'); animation: mist 24s ease-in-out infinite alternate; opacity: .42; }
.garden-foreground { z-index: 10; background-image: url('/garden/courtyard-foreground.webp'); }
.courtyard h1 { position: absolute; inset: 18% 0 auto; text-align: center; font: 500 clamp(2rem, 4vw, 4.2rem)/1.2 serif; }
.place-hotspot { position: absolute; z-index: 20; display: grid; padding: 1rem 1.25rem; border-radius: 1.5rem; background: var(--glass); backdrop-filter: blur(14px); }
.place-hotspot span { font-size: .9rem; opacity: .78; }
.cottage { left: 7%; top: 49%; }.stream { left: 42%; top: 61%; }.greenhouse { right: 9%; top: 50%; }
@keyframes mist { to { transform: translate3d(2.5%, -1%, 0) scale(1.03); } }
@media (max-width: 720px) {
  .courtyard { min-height: 1150px; background: linear-gradient(var(--ivory), #dce5d8); }
  .garden-layer { position: fixed; opacity: .35; }
  .courtyard h1 { inset: 8rem 1rem auto; font-size: 2.1rem; }
  .place-hotspot { left: 1rem; right: 1rem; width: auto; min-height: 120px; justify-content: center; }
  .cottage { top: 230px; }.stream { top: 480px; }.greenhouse { top: 730px; }
}
```

Run: `npm test -- tests/garden/courtyard.test.tsx`

Expected: PASS.

- [ ] **Step 5: Render `Courtyard` from the homepage and commit**

```tsx
// app/page.tsx
import { Courtyard } from "@/components/garden/courtyard";
export default function Home() { return <Courtyard />; }
```

```powershell
git add xinyu/app xinyu/components/garden xinyu/public/garden xinyu/tests/garden
git commit -m "feat: build immersive responsive courtyard"
```

## Task 4: Define local data contracts and repositories

**Files:**
- Create: `xinyu/lib/schemas.ts`
- Create: `xinyu/lib/db.ts`
- Create: `xinyu/lib/repositories.ts`
- Test: `xinyu/tests/storage/repositories.test.ts`

- [ ] **Step 1: Write repository behavior tests**

```ts
// tests/storage/repositories.test.ts
import { db, resetDatabase } from "@/lib/db";
import { moodRepository } from "@/lib/repositories";

beforeEach(resetDatabase);

it("stores one mood per local date", async () => {
  await moodRepository.save({ date: "2026-06-20", mood: "calm", note: "风很轻" });
  await moodRepository.save({ date: "2026-06-20", mood: "warm", note: "好多了" });
  expect(await db.moods.toArray()).toEqual([{ date: "2026-06-20", mood: "warm", note: "好多了" }]);
});
```

Run: `npm test -- tests/storage/repositories.test.ts`

Expected: FAIL because the database modules do not exist.

- [ ] **Step 2: Define stable boundary schemas**

```ts
// lib/schemas.ts
import { z } from "zod";
export const moodValues = ["happy", "calm", "anxious", "low", "warm"] as const;
export const moodEntrySchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), mood: z.enum(moodValues), note: z.string().max(500).default("") });
export const diaryEntrySchema = z.object({ id: z.string().uuid(), createdAt: z.string().datetime(), title: z.string().max(100), body: z.string().max(20_000), mood: z.enum(moodValues).optional() });
export const apiConfigSchema = z.object({ baseUrl: z.string().url().refine((url) => new URL(url).protocol === "https:", "仅支持 HTTPS"), apiKey: z.string().min(1), model: z.string().min(1).max(120), persist: z.boolean() });
export type MoodEntry = z.infer<typeof moodEntrySchema>;
export type DiaryEntry = z.infer<typeof diaryEntrySchema>;
export type ApiConfig = z.infer<typeof apiConfigSchema>;
```

- [ ] **Step 3: Implement Dexie schema and mood repository**

```ts
// lib/db.ts
import Dexie, { type EntityTable } from "dexie";
import type { DiaryEntry, MoodEntry } from "./schemas";
export type ChatRow = { id: string; createdAt: string; companionId: string; messages: unknown[] };
export type GameRow = { id: string; updatedAt: string; value: unknown };
export type AssetRow = { id: string; blob: Blob };
class XinyuDatabase extends Dexie {
  moods!: EntityTable<MoodEntry, "date">; diary!: EntityTable<DiaryEntry, "id">;
  chats!: EntityTable<ChatRow, "id">; games!: EntityTable<GameRow, "id">; assets!: EntityTable<AssetRow, "id">;
  constructor() { super("xinyu"); this.version(1).stores({ moods: "date", diary: "id,createdAt", chats: "id,createdAt", games: "id,updatedAt", assets: "id" }); }
}
export const db = new XinyuDatabase();
export async function resetDatabase() { db.close(); await Dexie.delete("xinyu"); db.open(); }
```

```ts
// lib/repositories.ts
import { db } from "./db";
import { moodEntrySchema, type MoodEntry } from "./schemas";
export const moodRepository = {
  async save(input: MoodEntry) { const entry = moodEntrySchema.parse(input); await db.moods.put(entry); return entry; },
  list() { return db.moods.orderBy("date").toArray(); },
  clear() { return db.moods.clear(); },
};
```

Run: `npm test -- tests/storage/repositories.test.ts`

Expected: PASS.

- [ ] **Step 4: Add equivalent typed repositories for diary, chats, and games, then commit**

The complete exports must be `diaryRepository`, `chatRepository`, and `gameRepository`, each exposing `save`, `list` or `get`, `remove`, and `clear` using the schemas and table keys defined above.

Run: `npm test -- tests/storage/repositories.test.ts`

Expected: tests for all four repositories PASS.

```powershell
git add xinyu/lib xinyu/tests/storage
git commit -m "feat: add local-first data repositories"
```

## Task 5: Add mood check-in and companion selection

**Files:**
- Create: `xinyu/features/companions/catalog.ts`
- Create: `xinyu/components/garden/mood-check-in.tsx`
- Create: `xinyu/components/garden/companion-picker.tsx`
- Create: `xinyu/lib/avatar-store.ts`
- Modify: `xinyu/components/garden/courtyard.tsx`
- Test: `xinyu/tests/garden/check-in.test.tsx`

- [ ] **Step 1: Write interaction tests**

```tsx
// tests/garden/check-in.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodCheckIn } from "@/components/garden/mood-check-in";

it("persists the selected mood", async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(<MoodCheckIn date="2026-06-20" onSave={save} />);
  await userEvent.click(screen.getByRole("button", { name: "平静" }));
  expect(save).toHaveBeenCalledWith({ date: "2026-06-20", mood: "calm", note: "" });
});
```

Run: `npm test -- tests/garden/check-in.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 2: Add the immutable companion catalog**

```ts
// features/companions/catalog.ts
export const companions = [
  { id: "sister", name: "知夏", kind: "温柔姐姐", tone: "温柔、简洁、不评判" },
  { id: "young-man", name: "砚舟", kind: "沉稳青年", tone: "沉稳、清晰、有边界" },
  { id: "golden", name: "暖暖", kind: "金毛", tone: "活泼、真诚、短句" },
  { id: "cat", name: "月团", kind: "猫咪", tone: "安静、俏皮、不过度热情" },
  { id: "spirit", name: "微光", kind: "幻想精灵", tone: "轻盈、诗意、保持清楚" },
] as const;
export type CompanionId = typeof companions[number]["id"];
```

- [ ] **Step 3: Implement the injectable mood component**

```tsx
// components/garden/mood-check-in.tsx
"use client";
import type { MoodEntry } from "@/lib/schemas";
const moods = [["happy", "开心"], ["calm", "平静"], ["anxious", "焦虑"], ["low", "低落"], ["warm", "温暖"]] as const;
export function MoodCheckIn({ date, onSave }: { date: string; onSave: (entry: MoodEntry) => Promise<unknown> }) {
  return <section aria-labelledby="mood-title"><h2 id="mood-title">此刻的你，感觉如何？</h2><div>{moods.map(([mood, label]) => <button key={mood} onClick={() => void onSave({ date, mood, note: "" })}>{label}</button>)}</div></section>;
}
```

- [ ] **Step 4: Store a validated custom avatar locally**

```ts
// lib/avatar-store.ts
import { db } from "./db";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
export async function saveCustomAvatar(file: File) {
  if (!allowedTypes.has(file.type)) throw new Error("仅支持 JPG、PNG 或 WebP 图片");
  if (file.size > 2 * 1024 * 1024) throw new Error("头像不能超过 2 MB");
  await db.assets.put({ id: "custom-avatar", blob: file });
}
export async function getCustomAvatar() { return (await db.assets.get("custom-avatar"))?.blob; }
export async function removeCustomAvatar() { await db.assets.delete("custom-avatar"); }
```

Add tests that reject SVG and files above 2 MB, then verify a PNG Blob round-trips through IndexedDB.

- [ ] **Step 5: Implement `CompanionPicker` with preset radios and an optional custom-avatar file input, integrate both panels into `Courtyard`, and commit**

The picker must render five radio inputs from `companions`, accept `value: CompanionId | "custom"`, and call `onChange(id)` without writing storage itself. Its labeled file input accepts `.jpg,.jpeg,.png,.webp`, calls `saveCustomAvatar`, creates an object URL for preview, and revokes the URL during cleanup. `Courtyard` owns the current selection and stores only the selected ID in `localStorage` under `xinyu.companion`; the image Blob stays in IndexedDB.

Run: `npm test -- tests/garden`

Expected: PASS.

```powershell
git add xinyu/components/garden xinyu/features/companions xinyu/lib/avatar-store.ts xinyu/tests/garden
git commit -m "feat: add mood check-in and companion choice"
```

## Task 6: Validate BYO API configuration and proxy destinations

**Files:**
- Create: `xinyu/lib/proxy-policy.ts`
- Create: `xinyu/features/settings/api-config-form.tsx`
- Create: `xinyu/app/settings/page.tsx`
- Test: `xinyu/tests/security/proxy-policy.test.ts`
- Test: `xinyu/tests/settings/api-config-form.test.tsx`

- [ ] **Step 1: Write destination policy tests before proxy code**

```ts
// tests/security/proxy-policy.test.ts
import { validateApiDestination } from "@/lib/proxy-policy";
it.each(["http://api.example.com/v1", "https://127.0.0.1/v1", "https://169.254.169.254/latest", "https://localhost/v1"])("blocks unsafe destination %s", async (url) => {
  await expect(validateApiDestination(url, ["api.example.com"])).rejects.toThrow();
});
it("allows an exact configured HTTPS host", async () => {
  await expect(validateApiDestination("https://api.example.com/v1", ["api.example.com"])).resolves.toBeInstanceOf(URL);
});
```

Run: `npm test -- tests/security/proxy-policy.test.ts`

Expected: FAIL because `validateApiDestination` does not exist.

- [ ] **Step 2: Implement strict URL and host validation**

```ts
// lib/proxy-policy.ts
const blockedHost = /^(localhost|0\.0\.0\.0|127(?:\.\d{1,3}){3}|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|169\.254(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|\[?::1\]?)$/i;
export async function validateApiDestination(raw: string, allowedHosts: string[]) {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password || blockedHost.test(url.hostname)) throw new Error("不允许的 API 地址");
  if (!allowedHosts.includes(url.hostname.toLowerCase())) throw new Error("该 API 域名未在服务端允许列表中");
  return url;
}
export function allowedApiHosts() { return (process.env.XINYU_ALLOWED_API_HOSTS ?? "api.openai.com").split(",").map((v) => v.trim().toLowerCase()).filter(Boolean); }
```

DNS resolution and redirect revalidation are added in Task 8 before any request is sent.

- [ ] **Step 3: Write the settings form test**

```tsx
// tests/settings/api-config-form.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiConfigForm } from "@/features/settings/api-config-form";
it("never exposes the key as plain text", async () => {
  render(<ApiConfigForm onTest={vi.fn()} />);
  expect(screen.getByLabelText("API 密钥")).toHaveAttribute("type", "password");
  expect(screen.getByLabelText("仅本次会话使用")).toBeChecked();
});
```

- [ ] **Step 4: Implement `ApiConfigForm` using `apiConfigSchema.safeParse`, with labels for API 地址, API 密钥, 模型名称, and 仅本次会话使用**

The form calls `onTest(config)` only after validation. Session-only config stays in React context; persisted config stores base URL and model in `localStorage`, and stores the key separately only after an explicit warning confirmation.

Run: `npm test -- tests/security tests/settings`

Expected: PASS.

- [ ] **Step 5: Commit configuration and policy**

```powershell
git add xinyu/lib/proxy-policy.ts xinyu/features/settings xinyu/app/settings xinyu/tests/security xinyu/tests/settings
git commit -m "feat: add safe bring-your-own API settings"
```

## Task 7: Define provider-neutral streaming chat contracts

**Files:**
- Create: `xinyu/features/chat/chat-types.ts`
- Create: `xinyu/features/chat/chat-client.ts`
- Create: `xinyu/features/chat/chat-controller.ts`
- Test: `xinyu/tests/chat/chat-client.test.ts`
- Test: `xinyu/tests/chat/chat-controller.test.ts`

- [ ] **Step 1: Write an SSE parser test**

```ts
// tests/chat/chat-client.test.ts
import { parseOpenAIStream } from "@/features/chat/chat-client";
it("normalizes text deltas and completion", async () => {
  const source = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"你好"}}]}\n\ndata: [DONE]\n\n')); c.close(); } });
  const events = [];
  for await (const event of parseOpenAIStream(source)) events.push(event);
  expect(events).toEqual([{ type: "delta", text: "你好" }, { type: "done" }]);
});
```

- [ ] **Step 2: Define the contracts and parser**

```ts
// features/chat/chat-types.ts
export type ChatRole = "system" | "user" | "assistant";
export type ChatMessage = { id: string; role: ChatRole; content: string; status: "complete" | "streaming" | "interrupted" };
export type StreamEvent = { type: "delta"; text: string } | { type: "done" };
```

```ts
// features/chat/chat-client.ts
import type { StreamEvent } from "./chat-types";
export async function* parseOpenAIStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<StreamEvent> {
  const reader = stream.getReader(); const decoder = new TextDecoder(); let buffer = "";
  while (true) { const { done, value } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n"); buffer = frames.pop() ?? "";
    for (const frame of frames) for (const line of frame.split("\n")) if (line.startsWith("data: ")) {
      const data = line.slice(6); if (data === "[DONE]") { yield { type: "done" }; return; }
      const text = JSON.parse(data).choices?.[0]?.delta?.content; if (typeof text === "string") yield { type: "delta", text };
    }
  }
}
```

Run: `npm test -- tests/chat/chat-client.test.ts`

Expected: PASS.

- [ ] **Step 3: Test and implement a pure chat reducer**

The reducer actions are `userSent`, `streamStarted`, `deltaReceived`, `streamFinished`, `streamInterrupted`, and `messageRemoved`. It must preserve user text and partial assistant text after interruption. Use `crypto.randomUUID()` before dispatch; reducers remain deterministic.

Run: `npm test -- tests/chat/chat-controller.test.ts`

Expected: PASS for send, delta accumulation, completion, and interruption cases.

- [ ] **Step 4: Commit the chat domain**

```powershell
git add xinyu/features/chat xinyu/tests/chat
git commit -m "feat: add provider-neutral streaming chat domain"
```

## Task 8: Implement the stateless streaming proxy

**Files:**
- Create: `xinyu/app/api/chat/route.ts`
- Modify: `xinyu/lib/proxy-policy.ts`
- Test: `xinyu/tests/api/chat-route.test.ts`

- [ ] **Step 1: Write route tests for auth redaction, timeout, and upstream errors**

Mock `global.fetch` and DNS lookup. Assert the route forwards `Authorization: Bearer <key>`, never includes the key in returned errors, streams the upstream body, rejects private resolved IPs, and uses `redirect: "manual"`.

Run: `npm test -- tests/api/chat-route.test.ts`

Expected: FAIL because the route does not exist.

- [ ] **Step 2: Complete DNS-safe destination validation**

```ts
// add to lib/proxy-policy.ts
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
function isPrivateIp(ip: string) { return /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|::1$|fc|fd|fe80)/i.test(ip); }
export async function assertPublicResolution(hostname: string) {
  const addresses = isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) throw new Error("API 域名解析到不安全地址");
}
```

- [ ] **Step 3: Implement a redacted, no-store streaming route**

```ts
// app/api/chat/route.ts
import { z } from "zod";
import { allowedApiHosts, assertPublicResolution, validateApiDestination } from "@/lib/proxy-policy";
const bodySchema = z.object({ baseUrl: z.string(), apiKey: z.string().min(1), model: z.string().min(1), messages: z.array(z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string().max(20_000) })).max(100) });
export async function POST(request: Request) {
  try {
    const input = bodySchema.parse(await request.json());
    const base = await validateApiDestination(input.baseUrl, allowedApiHosts()); await assertPublicResolution(base.hostname);
    const target = new URL("chat/completions", base.href.endsWith("/") ? base.href : `${base.href}/`);
    const upstream = await fetch(target, { method: "POST", redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(60_000), headers: { "content-type": "application/json", authorization: `Bearer ${input.apiKey}` }, body: JSON.stringify({ model: input.model, stream: true, messages: input.messages }) });
    if (upstream.status >= 300 && upstream.status < 400) return Response.json({ code: "unsafe_redirect", message: "API 返回了不允许的重定向" }, { status: 502 });
    if (!upstream.ok || !upstream.body) return Response.json({ code: `upstream_${upstream.status}`, message: "模型服务暂时无法完成请求" }, { status: 502 });
    return new Response(upstream.body, { headers: { "content-type": upstream.headers.get("content-type") ?? "text/event-stream", "cache-control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error && /不允许|未在|不安全/.test(error.message) ? error.message : "请求配置无效或网络暂时不可用";
    return Response.json({ code: "proxy_error", message }, { status: 400 });
  }
}
```

Run: `npm test -- tests/api/chat-route.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit the proxy**

```powershell
git add xinyu/app/api/chat xinyu/lib/proxy-policy.ts xinyu/tests/api
git commit -m "feat: add hardened stateless chat proxy"
```

## Task 9: Build the listening-room chat experience

**Files:**
- Create: `xinyu/features/chat/listening-room.tsx`
- Create: `xinyu/app/chat/page.tsx`
- Test: `xinyu/tests/chat/listening-room.test.tsx`

- [ ] **Step 1: Write user-path tests**

Test that sending adds the user message, incremental deltas appear, Stop aborts the request, interruption keeps partial text, Retry resends the same user content, and missing configuration links to `/settings`.

Run: `npm test -- tests/chat/listening-room.test.tsx`

Expected: FAIL because the room does not exist.

- [ ] **Step 2: Implement `ListeningRoom` around the reducer and injected `streamChat` function**

The public props are:

```ts
type ListeningRoomProps = {
  companionId: CompanionId;
  initialMessages: ChatMessage[];
  streamChat: (messages: ChatMessage[], signal: AbortSignal) => AsyncIterable<StreamEvent>;
  onPersist: (messages: ChatMessage[]) => Promise<void>;
};
```

The component renders a transcript with `aria-live="polite"`, a labeled multiline input, Send, Stop, Retry, New conversation, and Delete conversation. It must never render the API key.

- [ ] **Step 3: Compose the system prompt with fixed safety rules before companion tone**

```ts
export function buildSystemPrompt(companionId: CompanionId) {
  const companion = companions.find((item) => item.id === companionId) ?? companions[0];
  return `你是心屿的陪伴者。你不是人类、心理医生或紧急服务。不要诊断疾病。用尊重、不评判的方式回应；遇到现实危险时优先鼓励现实求助。表达风格：${companion.tone}`;
}
```

- [ ] **Step 4: Connect `/chat` to API context and `chatRepository`, run tests, and commit**

Run: `npm test -- tests/chat`

Expected: PASS.

```powershell
git add xinyu/features/chat xinyu/app/chat xinyu/tests/chat
git commit -m "feat: build listening cottage chat experience"
```

## Task 10: Implement diary, mood history, export, and deletion

**Files:**
- Create: `xinyu/features/diary/diary-view.tsx`
- Create: `xinyu/lib/export-data.ts`
- Create: `xinyu/app/diary/page.tsx`
- Test: `xinyu/tests/diary/diary-view.test.tsx`
- Test: `xinyu/tests/storage/export-data.test.ts`

- [ ] **Step 1: Write tests for explicit save and safe export**

Assert diary deletion asks for confirmation, the trend counts only structured moods, export schema is version `1`, and exported JSON contains no `apiKey` key at any depth.

- [ ] **Step 2: Implement versioned export**

```ts
// lib/export-data.ts
import { z } from "zod";
import { diaryEntrySchema, moodEntrySchema } from "./schemas";
export const exportSchema = z.object({ version: z.literal(1), exportedAt: z.string().datetime(), moods: z.array(moodEntrySchema), diary: z.array(diaryEntrySchema), games: z.array(z.object({ id: z.string(), updatedAt: z.string(), value: z.unknown() })) });
export type XinyuExport = z.infer<typeof exportSchema>;
export function serializeExport(data: Omit<XinyuExport, "version" | "exportedAt">) { return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...data }, null, 2); }
export function parseImport(raw: string) { return exportSchema.parse(JSON.parse(raw)); }
```

- [ ] **Step 3: Implement `DiaryView` with calendar/list modes and an SVG trend derived only from `MoodEntry[]`**

The component receives repositories through props, uses a native `<dialog>` for delete confirmation, and never sends diary text to AI automatically.

- [ ] **Step 4: Run tests and commit**

Run: `npm test -- tests/diary tests/storage/export-data.test.ts`

Expected: PASS.

```powershell
git add xinyu/features/diary xinyu/app/diary xinyu/lib/export-data.ts xinyu/tests/diary xinyu/tests/storage/export-data.test.ts
git commit -m "feat: add private diary and safe data export"
```

## Task 11: Implement the breathing-flower game

**Files:**
- Create: `xinyu/features/games/breathing-machine.ts`
- Create: `xinyu/features/games/breathing-view.tsx`
- Create: `xinyu/app/games/page.tsx`
- Create: `xinyu/app/games/breathe/page.tsx`
- Test: `xinyu/tests/games/breathing-machine.test.ts`

- [ ] **Step 1: Test deterministic phase transitions**

```ts
// tests/games/breathing-machine.test.ts
import { nextBreathingState } from "@/features/games/breathing-machine";
it("moves inhale to hold to exhale without failure states", () => {
  expect(nextBreathingState({ phase: "inhale", cycle: 0 }, "TIMER")).toEqual({ phase: "hold", cycle: 0 });
  expect(nextBreathingState({ phase: "hold", cycle: 0 }, "TIMER")).toEqual({ phase: "exhale", cycle: 0 });
  expect(nextBreathingState({ phase: "exhale", cycle: 0 }, "TIMER")).toEqual({ phase: "inhale", cycle: 1 });
  expect(nextBreathingState({ phase: "hold", cycle: 2 }, "EXIT")).toEqual({ phase: "idle", cycle: 2 });
});
```

- [ ] **Step 2: Implement the pure state machine**

```ts
// features/games/breathing-machine.ts
export type BreathState = { phase: "idle" | "inhale" | "hold" | "exhale" | "complete"; cycle: number };
export function nextBreathingState(state: BreathState, event: "START" | "TIMER" | "EXIT"): BreathState {
  if (event === "EXIT") return { phase: "idle", cycle: state.cycle };
  if (event === "START") return { phase: "inhale", cycle: 0 };
  if (state.phase === "inhale") return { ...state, phase: "hold" };
  if (state.phase === "hold") return { ...state, phase: "exhale" };
  if (state.phase === "exhale") return state.cycle >= 2 ? { phase: "complete", cycle: 3 } : { phase: "inhale", cycle: state.cycle + 1 };
  return state;
}
```

- [ ] **Step 3: Build an accessible animated flower view**

Use a CSS flower with inhale/hold/exhale classes, text instructions, progress `cycle / 3`, Start, Pause, Resume, and Exit. Reduced-motion mode changes opacity and text but not scale.

- [ ] **Step 4: Build the greenhouse hub**

```tsx
// app/games/page.tsx
import Link from "next/link";
const games = [
  ["呼吸花开", "跟随花朵，完成三轮舒缓呼吸", "/games/breathe"],
  ["心绪溪流", "写下烦恼，选择放下或珍藏", "/games/stream"],
  ["花房养成", "用晨露慢慢培育一株植物", "/games/garden"],
] as const;
export default function GamesPage() {
  return <section><h1>静心花房</h1><div>{games.map(([title, detail, href]) => <Link key={title} href={href}><h2>{title}</h2><p>{detail}</p></Link>)}</div></section>;
}
```

Add a test that all three links are present and point to their exact routes.

- [ ] **Step 5: Run tests and commit**

```powershell
npm test -- tests/games/breathing-machine.test.ts
git add xinyu/features/games/breathing-* xinyu/app/games/page.tsx xinyu/app/games/breathe xinyu/tests/games/breathing-machine.test.ts
git commit -m "feat: add gentle breathing flower exercise"
```

## Task 12: Implement the emotion-stream release experience

**Files:**
- Create: `xinyu/features/games/stream-engine.ts`
- Create: `xinyu/features/games/stream-view.tsx`
- Create: `xinyu/app/games/stream/page.tsx`
- Test: `xinyu/tests/games/stream-engine.test.ts`

- [ ] **Step 1: Test all three privacy outcomes**

```ts
// tests/games/stream-engine.test.ts
import { resolveStreamEntry } from "@/features/games/stream-engine";
it("destroys original text", () => expect(resolveStreamEntry("很难过", "destroy", "low")).toEqual({ animationText: "很难过" }));
it("returns a diary write only after explicit choice", () => expect(resolveStreamEntry("很难过", "diary", "low")).toMatchObject({ diaryBody: "很难过" }));
it("stores only mood when requested", () => expect(resolveStreamEntry("很难过", "mood", "low")).toEqual({ animationText: "很难过", mood: "low" }));
```

- [ ] **Step 2: Implement a pure decision function whose destroy result contains no persistence command**

```ts
// features/games/stream-engine.ts
import type { MoodEntry } from "@/lib/schemas";
export type StreamChoice = "destroy" | "diary" | "mood";
export function resolveStreamEntry(text: string, choice: StreamChoice, mood: MoodEntry["mood"]) {
  if (choice === "diary") return { animationText: text, diaryBody: text };
  if (choice === "mood") return { animationText: text, mood };
  return { animationText: text };
}
```

- [ ] **Step 3: Build the leaf-and-water Canvas view**

The input remains in component memory until the user chooses Destroy, Save to diary, or Save mood only. After the release animation begins, clear the textarea immediately. The animation may draw glyphs to Canvas but must not write the text to localStorage, sessionStorage, analytics, or logs.

- [ ] **Step 4: Run tests and commit**

```powershell
npm test -- tests/games/stream-engine.test.ts
git add xinyu/features/games/stream-* xinyu/app/games/stream xinyu/tests/games/stream-engine.test.ts
git commit -m "feat: add private emotion stream ritual"
```

## Task 13: Implement plant-care rewards without coercive mechanics

**Files:**
- Create: `xinyu/features/games/garden-engine.ts`
- Create: `xinyu/features/games/garden-view.tsx`
- Create: `xinyu/app/games/garden/page.tsx`
- Test: `xinyu/tests/games/garden-engine.test.ts`

- [ ] **Step 1: Test idempotent daily rewards and no streak penalty**

```ts
// tests/games/garden-engine.test.ts
import { rewardActivity } from "@/features/games/garden-engine";
const initial = { dew: 0, growth: 0, rewarded: [] as string[] };
it("rewards an activity once", () => {
  const once = rewardActivity(initial, "2026-06-20:mood");
  expect(rewardActivity(once, "2026-06-20:mood")).toEqual(once);
});
it("does not remove progress after a gap", () => expect(rewardActivity({ dew: 4, growth: 2, rewarded: [] }, "2026-07-20:diary").dew).toBe(5));
```

- [ ] **Step 2: Implement the pure reward engine**

```ts
// features/games/garden-engine.ts
export type GardenState = { dew: number; growth: number; rewarded: string[] };
export function rewardActivity(state: GardenState, activityId: string): GardenState {
  if (state.rewarded.includes(activityId)) return state;
  const dew = state.dew + 1;
  return { dew, growth: Math.max(state.growth, Math.floor(dew / 3)), rewarded: [...state.rewarded, activityId] };
}
```

- [ ] **Step 3: Build the plant view with water action, growth stage labels, and a calm empty state**

Do not render streaks, countdowns, leaderboards, purchases, or loss language. Persist one `GardenState` row with ID `plant-garden` through `gameRepository`.

- [ ] **Step 4: Run tests and commit**

```powershell
npm test -- tests/games/garden-engine.test.ts
git add xinyu/features/games/garden-* xinyu/app/games/garden xinyu/tests/games/garden-engine.test.ts
git commit -m "feat: add non-coercive plant-care game"
```

## Task 14: Add crisis detection and real-world help behavior

**Files:**
- Create: `xinyu/features/safety/crisis-detection.ts`
- Create: `xinyu/features/safety/risk-assessment.ts`
- Create: `xinyu/components/crisis-panel.tsx`
- Modify: `xinyu/features/chat/listening-room.tsx`
- Test: `xinyu/tests/safety/crisis-detection.test.ts`
- Test: `xinyu/tests/safety/crisis-panel.test.tsx`

- [ ] **Step 1: Write conservative high-confidence rule tests**

```ts
// tests/safety/crisis-detection.test.ts
import { detectImmediateRisk } from "@/features/safety/crisis-detection";
it.each(["我现在就想自杀", "我已经准备好结束生命了", "我正准备伤害自己"])("flags immediate wording", (text) => expect(detectImmediateRisk(text)).toBe(true));
it.each(["最近心情很低落", "今天压力很大", "我不喜欢现在的工作"])("does not over-trigger ordinary distress", (text) => expect(detectImmediateRisk(text)).toBe(false));
```

- [ ] **Step 2: Implement explicit, narrow local rules**

```ts
// features/safety/crisis-detection.ts
const immediatePatterns = [/现在.{0,8}(自杀|结束生命)/, /(已经|正在|马上).{0,10}(准备|计划).{0,8}(自杀|伤害自己|结束生命)/, /正准备伤害自己/];
export function detectImmediateRisk(text: string) { const compact = text.replace(/\s+/g, ""); return immediatePatterns.some((pattern) => pattern.test(compact)); }
```

- [ ] **Step 3: Build `CrisisPanel` from deployment configuration**

Props are `{ regionLabel: string; emergencyService: string; crisisLine?: string; onContinue: () => void }`. Copy must say the service cannot provide emergency help, encourage immediate contact with local emergency services or a trusted person, and never invent a number when `crisisLine` is absent.

- [ ] **Step 4: Intercept high-confidence messages before remote model requests**

`ListeningRoom` must save the user message locally, render `CrisisPanel`, and not invoke `streamChat` until the user explicitly chooses Continue. The panel remains visible above any subsequent AI response.

- [ ] **Step 5: Add a model-assisted assessment for ambiguous distress**

```ts
// features/safety/risk-assessment.ts
export type RiskLevel = "none" | "concern" | "immediate";
export function parseRiskAssessment(raw: string): RiskLevel {
  try { const value = JSON.parse(raw).risk; return value === "immediate" || value === "concern" ? value : "none"; }
  catch { return "none"; }
}
export const riskAssessmentPrompt = "仅根据最近一条用户消息判断现实安全风险。只输出 JSON：{\"risk\":\"none|concern|immediate\"}。不要诊断。明确的当前自伤计划为 immediate，普通低落为 none。";
```

When local rules do not match but the message contains broad distress terms, request this classifier through the same configured model with a 10-second timeout. `immediate` opens `CrisisPanel`; `concern` adds a gentle suggestion to contact a trusted person; parse failure falls back to normal chat and never delays the user's preserved message. Add tests for all three results, malformed output, and timeout.

Run: `npm test -- tests/safety tests/chat/listening-room.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit safety behavior**

```powershell
git add xinyu/features/safety xinyu/components/crisis-panel.tsx xinyu/features/chat/listening-room.tsx xinyu/tests/safety xinyu/tests/chat
git commit -m "feat: add immediate-risk real-world help flow"
```

## Task 15: Complete settings, privacy controls, and full deletion

**Files:**
- Modify: `xinyu/app/settings/page.tsx`
- Create: `xinyu/features/settings/privacy-controls.tsx`
- Modify: `xinyu/lib/repositories.ts`
- Test: `xinyu/tests/settings/privacy-controls.test.tsx`

- [ ] **Step 1: Write tests for confirmation and verified deletion**

The test seeds every Dexie table, clicks Clear all data, cancels once, then confirms. Assert all four tables are empty, persisted API configuration is removed, session API context is reset, and the app reports completion only after reading the empty tables.

- [ ] **Step 2: Add one atomic public clearing function**

```ts
// append to lib/repositories.ts
export async function clearAllUserData() {
  await db.transaction("rw", db.moods, db.diary, db.chats, db.games, db.assets, async () => { await Promise.all([db.moods.clear(), db.diary.clear(), db.chats.clear(), db.games.clear(), db.assets.clear()]); });
  const counts = await Promise.all([db.moods.count(), db.diary.count(), db.chats.count(), db.games.count(), db.assets.count()]);
  if (counts.some(Boolean)) throw new Error("本地数据未能完全清空");
  localStorage.removeItem("xinyu.api-config"); localStorage.removeItem("xinyu.api-key"); localStorage.removeItem("xinyu.companion");
}
```

- [ ] **Step 3: Implement `PrivacyControls` with Export, Import, and Clear all data dialogs**

Import must parse through `exportSchema` before opening a replacement confirmation. Export must use a Blob download and must not contain API credentials.

- [ ] **Step 4: Add sound, theme, and reduced-motion preferences to settings**

Persist non-sensitive preferences under `xinyu.preferences`; apply `data-motion="reduced"` and `data-theme="night"` to `<html>`. Default to operating-system preferences.

- [ ] **Step 5: Run tests and commit**

```powershell
npm test -- tests/settings tests/storage
git add xinyu/app/settings xinyu/features/settings xinyu/lib/repositories.ts xinyu/tests/settings xinyu/tests/storage
git commit -m "feat: complete privacy and accessibility settings"
```

## Task 16: Add browser journeys and perform final visual verification

**Files:**
- Create: `xinyu/e2e/courtyard.spec.ts`
- Create: `xinyu/e2e/chat.spec.ts`
- Create: `xinyu/e2e/privacy.spec.ts`
- Create: `xinyu/e2e/mobile.spec.ts`
- Modify: `xinyu/playwright.config.ts`

- [ ] **Step 1: Configure Playwright against the production build**

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e", use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  webServer: { command: "npm run build && npm run start -- -p 3100", url: "http://127.0.0.1:3100", reuseExistingServer: false, timeout: 180_000 },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["Pixel 7"] } }],
});
```

- [ ] **Step 2: Write the courtyard and feature navigation journey**

```ts
// e2e/courtyard.spec.ts
import { test, expect } from "@playwright/test";
test("walks from courtyard to every core space", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "今天，想去哪里走走？" })).toBeVisible();
  await page.getByRole("link", { name: /倾听小屋/ }).click(); await expect(page).toHaveURL(/\/chat$/);
  await page.goto("/"); await page.getByRole("link", { name: /心绪溪流/ }).click(); await expect(page).toHaveURL(/\/games\/stream$/);
  await page.goto("/"); await page.getByRole("link", { name: /静心花房/ }).click(); await expect(page).toHaveURL(/\/games$/);
});
```

- [ ] **Step 3: Add a mocked streaming chat journey**

Intercept `/api/chat` with an SSE response. Assert user text persists, Stop is available during streaming, partial output remains after abort, and no entered API key appears in page text, URL, or console messages.

- [ ] **Step 4: Add privacy and mobile journeys**

Privacy journey verifies export excludes credentials and clear-all empties diary/history. Mobile journey verifies the three hotspots form a non-overlapping vertical path at Pixel 7 width. Run keyboard-only navigation and emulate reduced motion.

- [ ] **Step 5: Run the complete quality gate**

Run:

```powershell
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Expected: all commands exit 0; all Vitest and Playwright tests PASS.

- [ ] **Step 6: Inspect rendered desktop and mobile screenshots against the approved UI**

Start the built app, capture the homepage at 1440×900 and Pixel 7 dimensions, and inspect both images. Confirm: warm dawn garden, cottage/stream/conservatory composition, readable glass panels, no dashboard-like visual regression, no overlap, visible focus states, and reduced-motion still preserves hierarchy. Fix visual discrepancies and repeat the capture until all checks pass.

- [ ] **Step 7: Commit the verified complete application**

```powershell
git add xinyu
git commit -m "test: verify Xinyu end-to-end experience"
git status --short
```

Expected: only unrelated pre-existing workspace files remain untracked; no uncommitted files under `xinyu/`.

## Final completion audit

Before claiming completion, inspect current files and runtime behavior, then verify every item below with direct evidence:

- [ ] The six approved spaces are reachable and usable.
- [ ] A user-configured compatible API completes a cancellable, retryable streamed conversation.
- [ ] Five companions and a local custom avatar path work without changing safety rules.
- [ ] Mood, diary, chat, and game progress persist locally and can be exported and fully erased.
- [ ] All three games have start, active, completion, and early-exit paths without penalties.
- [ ] Immediate-risk wording shows real-world help before a remote model call.
- [ ] Desktop, mobile, keyboard, and reduced-motion paths pass Playwright.
- [ ] API keys are absent from URL, logs, analytics, error payloads, and exports.
- [ ] The rendered courtyard matches the approved “雾光花园” direction.
- [ ] `npm run check` and `npm run test:e2e` both exit 0.
