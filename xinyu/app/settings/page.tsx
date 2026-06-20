"use client";
import { ApiConfigForm } from "@/features/settings/api-config-form";
import { PrivacyControls } from "@/features/settings/privacy-controls";
import type { ApiConfig } from "@/lib/schemas";

export default function SettingsPage() {
  return (
    <main>
      <h1>设置</h1>
      <section aria-labelledby="api-heading">
        <h2 id="api-heading">API 配置</h2>
        <ApiConfigForm
          onTest={async (_config: ApiConfig) => {
            console.log("Testing API config...");
          }}
        />
      </section>
      <section>
        <PrivacyControls />
      </section>
    </main>
  );
}
