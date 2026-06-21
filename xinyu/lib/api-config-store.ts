import { apiConfigSchema, type ApiConfig } from "./schemas";

const STORAGE_KEY = "xinyu.api-config";

export function saveApiConfig(config: ApiConfig) {
  const parsed = apiConfigSchema.parse(config);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("xinyu.api-key");
}

export function loadApiConfig(): ApiConfig | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return apiConfigSchema.parse(JSON.parse(raw));
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearApiConfig() {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("xinyu.api-key");
}
