import type { ChatMessage, ChatRole } from "./chat-types";

export type ChatState = {
  messages: ChatMessage[];
  streamingText: string;
  error: string | null;
};

export function createChatController(state: ChatState) {
  function evolve(partial: Partial<ChatState>): ChatState {
    return { ...state, ...partial };
  }

  return {
    sendMessage(content: string): ChatState {
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        status: "complete",
      };
      return evolve({ messages: [...state.messages, msg], error: null });
    },

    appendDelta(text: string): ChatState {
      return evolve({ streamingText: state.streamingText + text });
    },

    commitStream(): ChatState {
      if (!state.streamingText) return state;
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: state.streamingText,
        status: "complete",
      };
      return evolve({ messages: [...state.messages, msg], streamingText: "" });
    },

    abortStream(): ChatState {
      if (!state.streamingText) return state;
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: state.streamingText,
        status: "interrupted",
      };
      return evolve({ messages: [...state.messages, msg], streamingText: "" });
    },

    newConversation(): ChatState {
      return { messages: [], streamingText: "", error: null };
    },

    setError(error: string | null): ChatState {
      return evolve({ error });
    },
  };
}
