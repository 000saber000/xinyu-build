import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { ListeningRoom } from "@/features/chat/listening-room";

beforeEach(() => {
  sessionStorage.clear();
  sessionStorage.setItem("xinyu.api-config", JSON.stringify({ apiKey: "sk-test" }));
});

it("uses V4 Flash by default and switches to V4 Pro", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode(
          'data: {"choices":[{"delta":{"content":"在呢"}}]}\n\ndata: [DONE]\n\n',
        ),
      );
      controller.close();
    },
  });
  const fetchMock = vi.fn().mockResolvedValue(new Response(stream, { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);

  render(<ListeningRoom />);

  // Default model should be Flash
  expect(screen.getByRole("combobox", { name: "对话模型" })).toHaveValue("deepseek-v4-flash");

  // Switch to Pro
  fireEvent.change(screen.getByRole("combobox", { name: "对话模型" }), {
    target: { value: "deepseek-v4-pro" },
  });

  fireEvent.change(screen.getByLabelText("输入消息"), { target: { value: "你好" } });
  fireEvent.click(screen.getByRole("button", { name: "发送" }));

  await waitFor(() => expect(fetchMock).toHaveBeenCalled());

  const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  const body = JSON.parse(init.body as string);
  expect(body).toMatchObject({
    apiKey: "sk-test",
    model: "deepseek-v4-pro",
  });
  expect(body.baseUrl).toBeUndefined();
});

it("shows an error when no API key is configured", async () => {
  sessionStorage.clear();
  render(<ListeningRoom />);
  fireEvent.change(screen.getByLabelText("输入消息"), { target: { value: "你好" } });
  fireEvent.click(screen.getByRole("button", { name: "发送" }));
  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent(/API 密钥/);
  });
});
