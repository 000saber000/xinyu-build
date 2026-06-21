import { z } from "zod";
import { allowedApiHosts, validateApiDestination } from "@/lib/proxy-policy";

const requestSchema = z.object({
  baseUrl: z.string().url(),
  apiKey: z.string().min(1),
  model: z.string().min(1).max(120),
  messages: z.array(z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string().max(20_000),
  })).min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const input = requestSchema.parse(await request.json());
    const base = await validateApiDestination(input.baseUrl, allowedApiHosts());
    const root = base.href.endsWith("/") ? base.href : `${base.href}/`;
    const target = new URL("chat/completions", root);
    const upstream = await fetch(target, {
      method: "POST",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${input.apiKey}`,
      },
      body: JSON.stringify({
        model: input.model,
        messages: input.messages,
        stream: true,
      }),
    });

    if (upstream.status >= 300 && upstream.status < 400) {
      return Response.json({ message: "模型服务返回了不安全的重定向" }, { status: 502 });
    }
    if (!upstream.ok || !upstream.body) {
      return Response.json({ message: "模型服务暂时无法完成请求" }, { status: 502 });
    }
    return new Response(upstream.body, {
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "text/event-stream",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error && /不允许|未在/.test(error.message)
      ? error.message
      : "API 配置无效或网络暂时不可用";
    return Response.json({ message }, { status: 400 });
  }
}

