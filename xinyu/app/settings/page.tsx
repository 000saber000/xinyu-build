'use client';
import { ApiConfigForm } from "@/features/settings/api-config-form";
import type { ApiConfig } from "@/lib/schemas";

export default function SettingsPage() {
  return (
    <main>
      <h1>设置</h1>
      <section aria-labelledby="api-heading">
        <h2 id="api-heading">API 配置</h2>
        <ApiConfigForm
          onTest={async (config: ApiConfig) => {
            // Placeholder: will validate via proxy in future task
            console.log("Testing API config:", config);
          }}
        />
      </section>
    </main>
  );
}

