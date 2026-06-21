"use client";
import { useCallback, useState } from "react";
import { companions, type CompanionId } from "@/features/companions/catalog";
import { createChatController, type ChatState } from "@/features/chat/chat-controller";
import { SCENE_IMAGES, sceneStyle } from "@/lib/visual-assets";
import { deepSeekModelSchema, type DeepSeekModel } from "@/lib/schemas";
import { loadApiConfig } from "@/lib/api-config-store";

const emptyState: ChatState = { messages: [], streamingText: "", error: null };

export function buildSystemPrompt(companionId: CompanionId) {
  const companion = companions.find((item) => item.id === companionId) ?? companions[0];
  return `你是心屿的陪伴者。你不是人类、心理医生或紧急服务。不要诊断疾病。用尊重、不评判的方式回应；遇到现实危险时优先鼓励现实求助。表达风格：${companion.tone}`;
}

export function ListeningRoom() {
  const [state, setState] = useState<ChatState>(emptyState);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [model, setModel] = useState<DeepSeekModel>("deepseek-v4-flash");

  const companionId = (typeof window !== "undefined"
    ? localStorage.getItem("xinyu.companion") ?? "fox"
    : "fox") as CompanionId;

  const ctrl = useCallback(
    (s?: ChatState) => createChatController(s ?? state),
    [state],
  );

  async function handleSend() {
    if (!input.trim() || isStreaming) return;
    const text = input.trim();
    setInput("");

    const key = loadApiConfig()?.apiKey ?? "";
    if (!key) {
      setState(ctrl().setError("请先在设置页面配置 DeepSeek API 密钥"));
      setIsStreaming(false);
      return;
    }

    let next = ctrl().sendMessage(text);
    setState(next);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: key,
          model,
          messages: [
            { role: "system", content: buildSystemPrompt(companionId) },
            ...next.messages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!response.ok) throw new Error("请求失败");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("无响应流");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            const content = parsed?.choices?.[0]?.delta?.content;
            if (content) {
              next = createChatController(next).appendDelta(content);
              setState(next);
            }
          } catch { /* skip */ }
        }
      }

      const final = createChatController(next).commitStream();
      setState(final);
    } catch (err) {
      const withErr = createChatController(next).setError(
        err instanceof Error ? err.message : "连接失败",
      );
      setState(withErr);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleAbort() {
    if (state.streamingText) {
      setState(ctrl().abortStream());
    }
    setIsStreaming(false);
  }

  function handleNewConversation() {
    setState(ctrl().newConversation());
  }

  return (
    <section
      aria-label="倾听小屋"
      className="experience-page experience-page--chat"
      data-scene={SCENE_IMAGES.chat}
      role="region"
      style={sceneStyle(SCENE_IMAGES.chat)}
    >
      <div className="experience-panel listening-room-panel">
      <p className="experience-eyebrow">🛋️💡 🛋️💡 一盏灯，一把椅子，一段只属于你的时间 (っ˘ω˘ς) ✨ ✨</p>
      <h1>倾听小屋</h1>`r`n      <label htmlFor="chat-model">对话模型</label>`r`n      <select id="chat-model" value={model} onChange={(e) => setModel(deepSeekModelSchema.parse(e.target.value))}>`r`n        <option value="deepseek-v4-flash">V4 Flash（快速）</option>`r`n        <option value="deepseek-v4-pro">V4 Pro（强大）</option>`r`n      </select>
      <div className="listening-room-messages">
        {state.messages.map((msg) => (
          <div key={msg.id} className={`message message--${msg.role}`}>
            <p>{msg.content}</p>
            {msg.status === "interrupted" && <em>（已中断）</em>}
          </div>
        ))}
        {state.streamingText && (
          <div className="message message--assistant">
            <p>{state.streamingText}</p>
          </div>
        )}
      </div>
      {state.error && <p role="alert" className="chat-error">{state.error}</p>}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="listening-room-form"
      >
        <label htmlFor="chat-input">输入消息</label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
        />
        {!isStreaming && <button type="submit">发送</button>}
        {isStreaming && <button type="button" onClick={handleAbort}>停止</button>}
        <button type="button" onClick={handleNewConversation}>新对话</button>
      </form>
      </div>
    </section>
  );
}


