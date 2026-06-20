import { parseOpenAIStream } from "@/features/chat/chat-client";

it("normalizes text deltas and completion", async () => {
  const source = new ReadableStream({
    start(c) {
      c.enqueue(
        new TextEncoder().encode(
          'data: {"choices":[{"delta":{"content":"你好"}}]}\n\ndata: [DONE]\n\n',
        ),
      );
      c.close();
    },
  });

  const events = [];
  for await (const event of parseOpenAIStream(source)) {
    events.push(event);
  }

  expect(events).toEqual([
    { type: "delta", text: "你好" },
    { type: "done" },
  ]);
});

it("handles empty delta gracefully", async () => {
  const source = new ReadableStream({
    start(c) {
      c.enqueue(
        new TextEncoder().encode(
          'data: {"choices":[{"delta":{}}]}\n\ndata: [DONE]\n\n',
        ),
      );
      c.close();
    },
  });

  const events = [];
  for await (const event of parseOpenAIStream(source)) {
    events.push(event);
  }

  expect(events).toEqual([{ type: "done" }]);
});
