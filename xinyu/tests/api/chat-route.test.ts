import { vi } from "vitest";
import { POST } from "@/app/api/chat/route";

it("forwards a validated OpenAI-compatible streaming request without redirects", async () => {
  const upstream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n")); controller.close(); } });
  const fetchMock = vi.fn().mockResolvedValue(new Response(upstream, { status: 200, headers: { "content-type": "text/event-stream" } }));
  vi.stubGlobal("fetch", fetchMock);
  const request = new Request("http://localhost/api/chat", {
    method: "POST",
    body: JSON.stringify({
      baseUrl: "https://api.openai.com/v1",
      apiKey: "sk-test",
      model: "gpt-test",
      messages: [{ role: "user", content: "你好" }],
    }),
  });
  const response = await POST(request);
  expect(response.status).toBe(200);
  expect(fetchMock).toHaveBeenCalledWith(
    new URL("https://api.openai.com/v1/chat/completions"),
    expect.objectContaining({ redirect: "manual", cache: "no-store" }),
  );
  const init = fetchMock.mock.calls[0][1];
  expect(init.headers.authorization).toBe("Bearer sk-test");
  expect(JSON.parse(init.body)).toMatchObject({ model: "gpt-test", stream: true });
});
