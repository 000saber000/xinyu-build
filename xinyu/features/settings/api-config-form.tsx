"use client";
import { useState } from "react";
import { apiConfigSchema, type ApiConfig } from "@/lib/schemas";

export function ApiConfigForm({
  onTest,
}: {
  onTest: (config: ApiConfig) => Promise<unknown>;
}) {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [sessionOnly, setSessionOnly] = useState(true);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = apiConfigSchema.safeParse({ baseUrl, apiKey, model, persist: !sessionOnly });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "请检查输入");
      return;
    }
    try {
      await onTest(result.data);
    } catch {
      setError("连接测试失败，请检查配置");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        API 地址
        <input type="url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} required />
      </label>
      <label>
        API 密钥
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
      </label>
      <label>
        模型名称
        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
      </label>
      <label>
        <input type="checkbox" checked={sessionOnly} onChange={(e) => setSessionOnly(e.target.checked)} />
        仅本次会话使用
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit">测试连接</button>
    </form>
  );
}
