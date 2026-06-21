import { z } from "zod";
import { NextRequest } from "next/server";
import { deepSeekModelSchema } from "@/lib/schemas";
import { apiConfigSchema } from "@/lib/schemas";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "请求格式错误" }, { status: 400 });
  }

  const parsed = z
    .object({
      apiKey: z.string().min(1),
      model: deepSeekModelSchema,
      messages: z.array(z.object({ role: z.string(), content: z.string() })),
    })
    .safeParse(body);

  if (!parsed.success) {
    return Response.json({ message: "请提供有效的 API 密钥和模型" }, { status: 400 });
  }

  const { apiKey, model, messages } = parsed.data;

  try {
    const upstream = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, stream: true }),
      redirect: "manual",
      cache: "no-store",
    });

    if (!upstream.ok) {
      const errBody = await upstream.json().catch(() => ({}));
      const upstreamMsg = (errBody as { error?: { message?: string } }).error?.message;

      let message: string;
      if (upstream.status === 401) message = "密钥无效或没有权限";
      else if (upstream.status === 402) message = "账户余额不足";
      else if (upstream.status === 429) message = "请求过于频繁，请稍后再试";
      else if (upstream.status === 503) message = "DeepSeek 服务暂时不可用";
      else message = upstreamMsg ?? `上游错误 (${upstream.status})`;

      return Response.json({ message }, { status: upstream.status });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json({ message: "无法连接到 DeepSeek 服务" }, { status: 502 });
  }
}



