import { saveApiConfig, loadApiConfig, clearApiConfig } from "@/lib/api-config-store";

const config = { apiKey: "sk-test" };

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

it("stores only the DeepSeek key for the current session", () => {
  saveApiConfig(config);
  expect(loadApiConfig()).toEqual(config);
  expect(localStorage.getItem("xinyu.api-config")).toBeNull();
});

it("removes obsolete generic configuration", () => {
  sessionStorage.setItem(
    "xinyu.api-config",
    JSON.stringify({
      baseUrl: "https://api.openai.com/v1",
      apiKey: "sk-old",
      model: "gpt-test",
      persist: false,
    }),
  );
  expect(loadApiConfig()).toBeNull();
});

it("clears the key from both storages", () => {
  saveApiConfig(config);
  clearApiConfig();
  expect(loadApiConfig()).toBeNull();
  expect(sessionStorage.getItem("xinyu.api-config")).toBeNull();
});
