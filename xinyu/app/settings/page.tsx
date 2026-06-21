"use client";
import { ApiConfigForm } from "@/features/settings/api-config-form";
import { PrivacyControls } from "@/features/settings/privacy-controls";
import type { ApiConfig } from "@/lib/schemas";
import { saveApiConfig } from "@/lib/api-config-store";

export default function SettingsPage() {
  return (
    <section className="settings-page" aria-label="设置">
      <div className="settings-header">
      <h1>设置</h1>
      <p>你的密钥与私人内容默认只留在当前设备。</p>
      </div>
      <div className="settings-grid">
      <section aria-labelledby="api-heading">
        <h2 id="api-heading">API 配置</h2>
        <ApiConfigForm
          onTest={async (config: ApiConfig) => {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                baseUrl: config.baseUrl,
                apiKey: config.apiKey,
                model: config.model,
                messages: [{ role: "user", content: "请只回复 OK" }],
              }),
            });
            if (!response.ok) throw new Error("连接测试失败");
            await response.body?.cancel();
            saveApiConfig(config);
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
