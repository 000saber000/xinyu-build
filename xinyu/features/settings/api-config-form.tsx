"use client";
import { useState } from "react";
import { apiConfigSchema } from "@/lib/schemas";

export function ApiConfigForm({
  onTest,
}: {
  onTest: (apiKey: string) => Promise<unknown>;
}) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = apiConfigSchema.safeParse({ apiKey });
    if (!result.success) {
      setError("请输入有效的 API 密钥");
      return;
    }
    try {
      await onTest(result.data.apiKey);
    } catch {
      setError("连接测试失败，请检查密钥");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        DeepSeek API 密钥
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit">测试连接</button>
    </form>
  );
}
