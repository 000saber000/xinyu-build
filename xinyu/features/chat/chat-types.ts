export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  status: "complete" | "streaming" | "interrupted";
};

export type StreamEvent = { type: "delta"; text: string } | { type: "done" };
