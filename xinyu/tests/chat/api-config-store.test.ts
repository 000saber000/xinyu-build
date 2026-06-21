import { clearApiConfig, loadApiConfig, saveApiConfig } from "@/lib/api-config-store";

const config = {
  baseUrl: "https://api.openai.com/v1",
  apiKey: "sk-test",
  model: "gpt-test",
  persist: false,
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

it("keeps session-only configuration out of local storage", () => {
  saveApiConfig(config);
  expect(sessionStorage.getItem("xinyu.api-config")).toContain("sk-test");
  expect(localStorage.getItem("xinyu.api-config")).toBeNull();
  expect(loadApiConfig()).toEqual(config);
});

it("persists configuration only after explicit opt-in", () => {
  saveApiConfig({ ...config, persist: true });
  expect(localStorage.getItem("xinyu.api-config")).toContain("sk-test");
  expect(loadApiConfig()).toEqual({ ...config, persist: true });
  clearApiConfig();
  expect(loadApiConfig()).toBeNull();
});

