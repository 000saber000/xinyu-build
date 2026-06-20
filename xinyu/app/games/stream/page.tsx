"use client";
import { useState } from "react";
import { resolveStreamEntry, type StreamChoice } from "@/features/games/stream-engine";
import type { MoodEntry } from "@/lib/schemas";

const moods: { key: MoodEntry["mood"]; label: string }[] = [
  { key: "happy", label: "开心" }, { key: "calm", label: "平静" },
  { key: "anxious", label: "焦虑" }, { key: "low", label: "低落" }, { key: "warm", label: "温暖" },
];

export default function StreamPage() {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodEntry["mood"]>("calm");
  const [result, setResult] = useState<{ animationText: string; diaryBody?: string; mood?: MoodEntry["mood"] } | null>(null);

  function handleChoice(choice: StreamChoice) {
    setResult(resolveStreamEntry(text, choice, selectedMood));
    setText("");
  }

  return (
    <section aria-label="心绪溪流">
      <h1>心绪溪流</h1>
      {!result ? (
        <>
          <label>今天想放下什么？<textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} /></label>
          <label>此刻心情
            <select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value as MoodEntry["mood"])}>
              {moods.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </label>
          <button onClick={() => handleChoice("destroy")}>放下</button>
          <button onClick={() => handleChoice("diary")}>保存到日记</button>
          <button onClick={() => handleChoice("mood")}>仅记录心情</button>
        </>
      ) : (
        <div>
          <p>你的心绪随溪流远去了</p>
          {result.diaryBody && <p>已保存到日记</p>}
          {result.mood && <p>心情已记录: {result.mood}</p>}
          <button onClick={() => setResult(null)}>再来一次</button>
        </div>
      )}
    </section>
  );
}
