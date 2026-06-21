import { apiConfigSchema, type ApiConfig } from "./schemas";

const key = "xinyu.api-config";

export function saveApiConfig(config: ApiConfig) {
  const value = JSON.stringify(apiConfigSchema.parse(config));
  if (config.persist) {
    localStorage.setItem(key, value);
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, value);
    localStorage.removeItem(key);
  }
}

export function loadApiConfig(): ApiConfig | null {
  const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key);
  if (!raw) return null;
  try {
    return apiConfigSchema.parse(JSON.parse(raw));
  } catch {
    clearApiConfig();
    return null;
  }
}

export function clearApiConfig() {
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
}

