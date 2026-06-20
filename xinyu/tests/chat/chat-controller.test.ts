import { createChatController, type ChatState } from "@/features/chat/chat-controller";
import type { ChatMessage } from "@/features/chat/chat-types";

const emptyState: ChatState = {
  messages: [],
  streamingText: "",
  error: null,
};

function makeMsg(id: string, content: string, status: ChatMessage["status"] = "complete"): ChatMessage {
  return { id, role: "user", content, status };
}

it("adds a pending user message on send", () => {
  const ctrl = createChatController(emptyState);
  const next = ctrl.sendMessage("你好");
  expect(next.messages).toHaveLength(1);
  expect(next.messages[0]!.content).toBe("你好");
  expect(next.messages[0]!.status).toBe("complete");
});

it("appends a delta to streaming text", () => {
  const ctrl = createChatController(emptyState);
  const next = ctrl.appendDelta("你好世界");
  expect(next.streamingText).toBe("你好世界");
  expect(next.messages).toHaveLength(0);
});

it("commits streaming text as an assistant message", () => {
  const streaming = createChatController(emptyState).appendDelta("好的");
  const committed = createChatController(streaming).commitStream();
  expect(committed.messages).toHaveLength(1);
  expect(committed.messages[0]!.role).toBe("assistant");
  expect(committed.messages[0]!.content).toBe("好的");
  expect(committed.messages[0]!.status).toBe("complete");
  expect(committed.streamingText).toBe("");
});

it("aborts streaming and preserves partial text", () => {
  const streaming = createChatController(emptyState).appendDelta("被中断的消息");
  const aborted = createChatController(streaming).abortStream();
  expect(aborted.messages).toHaveLength(1);
  expect(aborted.messages[0]!.status).toBe("interrupted");
  expect(aborted.messages[0]!.content).toBe("被中断的消息");
  expect(aborted.streamingText).toBe("");
});

it("resets to an empty conversation", () => {
  const withMsgs = {
    ...emptyState,
    messages: [makeMsg("a", "hi"), makeMsg("b", "hello", "complete")],
  };
  const reset = createChatController(withMsgs).newConversation();
  expect(reset.messages).toHaveLength(0);
  expect(reset.streamingText).toBe("");
});

it("sets and clears errors", () => {
  const err = createChatController(emptyState).setError("网络错误");
  expect(err.error).toBe("网络错误");
  const cleared = createChatController(err).setError(null);
  expect(cleared.error).toBeNull();
});
