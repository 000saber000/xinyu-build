"use client";
import { ApiConfigForm } from "@/features/settings/api-config-form";
import { PrivacyControls } from "@/features/settings/privacy-controls";
import { saveApiConfig, clearApiConfig } from "@/lib/api-config-store";

export default function SettingsPage() {
  return (
    <section className="settings-page" aria-label="设置">
      <div className="settings-header">
        <h1>设置</h1>
        <p>你的密钥与私人内容默认只留在当前设备。</p>
      </div>
      <div className="settings-grid">
        <section aria-labelledby="api-heading">
          <h2 id="api-heading">DeepSeek API 配置</h2>
          <p>密钥仅保存在当前浏览器会话中，关闭标签页后自动清除。</p>
          <ApiConfigForm
            onTest={async (apiKey: string) => {
              const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  apiKey,
                  model: "deepseek-v4-flash",
                  messages: [{ role: "user", content: "请只回复 OK" }],
                }),
              });
              if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error((body as { message?: string }).message ?? "连接失败");
              }
              saveApiConfig({ apiKey });
            }}
          />
        </section>
        <section>
          <PrivacyControls />
        </section>
      </div>
    </section>
  );
}
