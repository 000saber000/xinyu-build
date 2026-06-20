import { validateApiDestination } from "@/lib/proxy-policy";

it.each([
  "http://api.example.com/v1",
  "https://127.0.0.1/v1",
  "https://169.254.169.254/latest",
  "https://localhost/v1",
])("blocks unsafe destination %s", async (url) => {
  await expect(validateApiDestination(url, ["api.example.com"])).rejects.toThrow();
});

it("allows an exact configured HTTPS host", async () => {
  await expect(
    validateApiDestination("https://api.example.com/v1", ["api.example.com"]),
  ).resolves.toBeInstanceOf(URL);
});

it("blocks hosts not in the allowed list", async () => {
  await expect(
    validateApiDestination("https://evil.example.com/v1", ["api.example.com"]),
  ).rejects.toThrow(/域名/);
});
