const blockedHost =
  /^(localhost|0\.0\.0\.0|127(?:\.\d{1,3}){3}|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|169\.254(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|\[?::1\]?)$/i;

export async function validateApiDestination(raw: string, allowedHosts: string[]) {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password || blockedHost.test(url.hostname))
    throw new Error("不允许的 API 地址");
  if (!allowedHosts.includes(url.hostname.toLowerCase()))
    throw new Error("该 API 域名未在服务端允许列表中");
  return url;
}

export function allowedApiHosts() {
  return (process.env.XINYU_ALLOWED_API_HOSTS ?? "api.openai.com")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}
