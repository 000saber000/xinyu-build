# DeepSeek 专用配置 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让用户只填写 DeepSeek API 密钥，并在聊天页随时切换 V4 Flash 与 V4 Pro。

**Architecture:** 浏览器会话仅保存密钥，聊天页单独维护模型选择。站内路由固定 DeepSeek 官方端点并通过枚举白名单校验模型，不再接受任意 API 地址。

**Tech Stack:** Next.js App Router、React、TypeScript、Zod、Vitest、Testing Library、Playwright

---

## 文件结构

- Modify: `xinyu/lib/schemas.ts` — 定义仅含密钥的配置和 DeepSeek 模型枚举。
- Modify: `xinyu/lib/api-config-store.ts` — 只在 sessionStorage 保存密钥。
- Modify: `xinyu/features/settings/api-config-form.tsx` — 只呈现密钥输入和连接测试。
- Modify: `xinyu/app/settings/page.tsx` — 固定用 Flash 测试连接并展示中文错误。
- Modify: `xinyu/features/chat/listening-room.tsx` — 添加模型切换器并发送所选模型。
- Modify: `xinyu/app/api/chat/route.ts` — 固定 DeepSeek 端点、限制模型并映射错误。
- Modify: `xinyu/tests/chat/api-config-store.test.ts` — 配置存储行为。
- Modify: `xinyu/tests/settings/api-config-form.test.tsx` — 设置表单行为。
- Modify: `xinyu/tests/chat/listening-room-config.test.tsx` — 默认模型和切换行为。
- Modify: `xinyu/tests/api/chat-route.test.ts` — 固定目标、白名单和错误映射。

### Task 1: 收窄配置模型与存储

- [ ] **Step 1: 写失败测试**

将 `tests/chat/api-config-store.test.ts` 改为验证只保存密钥且不写 localStorage：

```ts
const config = { apiKey: "sk-test" };

it("stores only the DeepSeek key for the current session", () => {
  saveApiConfig(config);
  expect(loadApiConfig()).toEqual(config);
  expect(localStorage.getItem("xinyu.api-config")).toBeNull();
});

it("removes obsolete generic configuration", () => {
  sessionStorage.setItem("xinyu.api-config", JSON.stringify({
    baseUrl: "https://api.openai.com/v1", apiKey: "sk-old", model: "gpt-test", persist: false,
  }));
  expect(loadApiConfig()).toBeNull();
});
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/chat/api-config-store.test.ts`
Expected: FAIL，因为 schema 仍要求 `baseUrl/model/persist`。

- [ ] **Step 3: 最小实现**

在 `lib/schemas.ts` 定义：

```ts
export const deepSeekModels = ["deepseek-v4-flash", "deepseek-v4-pro"] as const;
export const deepSeekModelSchema = z.enum(deepSeekModels);
export type DeepSeekModel = z.infer<typeof deepSeekModelSchema>;
export const apiConfigSchema = z.object({ apiKey: z.string().trim().min(1) }).strict();
```

在 `lib/api-config-store.ts` 中始终写 sessionStorage、删除 localStorage，并保持 `clearApiConfig()` 清理两处旧数据。

- [ ] **Step 4: 运行并确认通过**

Run: `npm test -- tests/chat/api-config-store.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add xinyu/lib/schemas.ts xinyu/lib/api-config-store.ts xinyu/tests/chat/api-config-store.test.ts
git commit -m "refactor: store only DeepSeek session key"
```

### Task 2: 简化设置页

- [ ] **Step 1: 写失败测试**

更新 `tests/settings/api-config-form.test.tsx`：

```tsx
it("asks only for a DeepSeek API key", () => {
  render(<ApiConfigForm onTest={vi.fn()} />);
  expect(screen.getByLabelText("DeepSeek API 密钥")).toHaveAttribute("type", "password");
  expect(screen.queryByLabelText("API 地址")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("模型名称")).not.toBeInTheDocument();
});
```

新增设置页测试，提交后断言请求体只包含 `apiKey`、固定 Flash 和消息。

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/settings/api-config-form.test.tsx`
Expected: FAIL，因为通用字段仍显示。

- [ ] **Step 3: 最小实现**

将 `ApiConfigForm` 状态收窄到 `apiKey`，提交 `apiConfigSchema.safeParse({ apiKey })`。在 `app/settings/page.tsx` 的测试请求中发送：

```ts
body: JSON.stringify({
  apiKey: config.apiKey,
  model: "deepseek-v4-flash",
  messages: [{ role: "user", content: "请只回复 OK" }],
})
```

读取非 2xx JSON 的 `message` 并展示对应中文错误。

- [ ] **Step 4: 运行并确认通过**

Run: `npm test -- tests/settings/api-config-form.test.tsx tests/settings/settings-page.test.tsx`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add xinyu/features/settings/api-config-form.tsx xinyu/app/settings/page.tsx xinyu/tests/settings
git commit -m "feat: simplify DeepSeek key setup"
```

### Task 3: 固定 DeepSeek 服务端代理

- [ ] **Step 1: 写失败测试**

在 `tests/api/chat-route.test.ts` 覆盖：

```ts
it.each(["deepseek-v4-flash", "deepseek-v4-pro"])("forwards %s to DeepSeek", async (model) => {
  const response = await POST(makeRequest({ apiKey: "sk-test", model }));
  expect(response.status).toBe(200);
  expect(fetchMock).toHaveBeenCalledWith(
    new URL("https://api.deepseek.com/chat/completions"),
    expect.objectContaining({ redirect: "manual", cache: "no-store" }),
  );
});

it("rejects models outside the DeepSeek whitelist before fetch", async () => {
  const response = await POST(makeRequest({ apiKey: "sk-test", model: "gpt-test" }));
  expect(response.status).toBe(400);
  expect(fetchMock).not.toHaveBeenCalled();
});
```

再分别模拟 401、402、429、503，断言中文消息“密钥无效或没有权限”“账户余额不足”“请求过于频繁”“DeepSeek 服务暂时不可用”。

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/api/chat-route.test.ts`
Expected: FAIL，因为路由仍要求 baseUrl 且接受任意模型。

- [ ] **Step 3: 最小实现**

路由 schema 使用 `deepSeekModelSchema`，删除 `baseUrl`，目标常量设为：

```ts
const deepSeekChatEndpoint = new URL("https://api.deepseek.com/chat/completions");
```

根据上游状态返回安全的中文 JSON 错误；成功响应保持流式透传。

- [ ] **Step 4: 运行并确认通过**

Run: `npm test -- tests/api/chat-route.test.ts tests/security/proxy-policy.test.ts`
Expected: PASS；若 `proxy-policy` 不再被生产代码使用，则保留其测试与文件，不做无关删除。

- [ ] **Step 5: 提交**

```bash
git add xinyu/app/api/chat/route.ts xinyu/tests/api/chat-route.test.ts
git commit -m "feat: restrict chat proxy to DeepSeek V4"
```

### Task 4: 聊天页模型切换

- [ ] **Step 1: 写失败测试**

更新 `tests/chat/listening-room-config.test.tsx`：

```tsx
it("uses V4 Flash by default and switches the next message to V4 Pro", async () => {
  render(<ListeningRoom />);
  expect(screen.getByRole("combobox", { name: "对话模型" })).toHaveValue("deepseek-v4-flash");
  fireEvent.change(screen.getByRole("combobox", { name: "对话模型" }), {
    target: { value: "deepseek-v4-pro" },
  });
  fireEvent.change(screen.getByLabelText("输入消息"), { target: { value: "你好" } });
  fireEvent.click(screen.getByRole("button", { name: "发送" }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
    apiKey: "sk-test",
    model: "deepseek-v4-pro",
  });
});
```

同时断言切换模型后已存在消息仍显示。

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/chat/listening-room-config.test.tsx`
Expected: FAIL，因为没有模型选择器且请求仍发送 baseUrl。

- [ ] **Step 3: 最小实现**

在 `ListeningRoom` 增加：

```tsx
const [model, setModel] = useState<DeepSeekModel>("deepseek-v4-flash");

<label htmlFor="chat-model">对话模型</label>
<select id="chat-model" value={model} onChange={(event) => setModel(deepSeekModelSchema.parse(event.target.value))}>
  <option value="deepseek-v4-flash">V4 Flash</option>
  <option value="deepseek-v4-pro">V4 Pro</option>
</select>
```

请求体只发送 `apiKey`、`model` 和 `messages`。读取非 2xx JSON 的 `message`，让聊天区显示服务端中文错误。

- [ ] **Step 4: 运行并确认通过**

Run: `npm test -- tests/chat/listening-room-config.test.tsx tests/chat/chat-controller.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add xinyu/features/chat/listening-room.tsx xinyu/tests/chat/listening-room-config.test.tsx
git commit -m "feat: switch DeepSeek V4 models in chat"
```

### Task 5: 全量验收

- [ ] **Step 1: 运行静态检查、单元测试与构建**

Run: `npm run check`
Expected: lint、全部 Vitest 测试和 Next.js production build 均成功。

- [ ] **Step 2: 运行浏览器测试**

Run: `npm run test:e2e`
Expected: 全部 Playwright 测试通过，主页和其他页面无回归。

- [ ] **Step 3: 手工浏览器验收**

启动 `npm run dev`，验证设置页只有密钥输入；聊天页默认 Flash，可切换 Pro；切换不清空消息；开发工具栏保持框架默认行为。

- [ ] **Step 4: 最终提交**

```bash
git add xinyu
git commit -m "test: verify DeepSeek-only chat configuration"
```
