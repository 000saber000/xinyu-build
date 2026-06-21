import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { ListeningRoom } from "@/features/chat/listening-room";

beforeEach(() => {
  sessionStorage.setItem("xinyu.api-config", JSON.stringify({
    baseUrl: "https://api.openai.com/v1",
    apiKey: "sk-test",
    model: "gpt-test",
    persist: false,
  }));
});

it("sends the user-configured endpoint, key and model to the local proxy", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"在呢"}}]}\n\ndata: [DONE]\n\n'));
      controller.close();
    },
  });
  const fetchMock = vi.fn().mockResolvedValue(new Response(stream, { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  render(<ListeningRoom />);
  fireEvent.change(screen.getByLabelText("输入消息"), { target: { value: "你好" } });
  fireEvent.click(screen.getByRole("button", { name: "发送" }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  const [, init] = fetchMock.mock.calls[0];
  expect(JSON.parse(init.body)).toMatchObject({
    baseUrl: "https://api.openai.com/v1",
    apiKey: "sk-test",
    model: "gpt-test",
  });
});

