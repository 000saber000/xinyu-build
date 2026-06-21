"use client";
import { useState } from "react";
import { resolveStreamEntry, type StreamChoice } from "@/features/games/stream-engine";
import type { MoodEntry } from "@/lib/schemas";
import { SCENE_IMAGES, sceneStyle } from "@/lib/visual-assets";

const moods: { key: MoodEntry["mood"]; label: string }[] = [
  { key: "happy", label: "开心" }, { key: "calm", label: "平静" },
  { key: "anxious", label: "焦虑" }, { key: "low", label: "低落" }, { key: "warm", label: "温暖" },
];

export default function StreamPage() {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodEntry["mood"]>("calm");
  const [result, setResult] = useState<{ animationText: string; diaryBody?: string; mood?: MoodEntry["mood"] } | null>(null);
  function handleChoice(choice: StreamChoice) { setResult(resolveStreamEntry(text, choice, selectedMood)); setText(""); }

  return (
    <section
      aria-label="心绪溪流"
      className="experience-page experience-page--stream"
      data-scene={SCENE_IMAGES.stream}
      style={sceneStyle(SCENE_IMAGES.stream)}
    >
      <div className="experience-panel game-control-panel">
        <p className="experience-eyebrow">🍂 不必解释，只需要轻轻放下 (◍•ᴗ•◍) 💧</p>
        <h1>心绪溪流</h1>
        {!result ? (
          <div className="form-stack">
            <label>今天想放下什么？<textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} /></label>
            <label>此刻心情<select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value as MoodEntry["mood"])}>{moods.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}</select></label>
            <div className="button-row"><button onClick={() => handleChoice("destroy")}>让它随水远去</button><button className="button-secondary" onClick={() => handleChoice("diary")}>收进日记</button><button className="button-secondary" onClick={() => handleChoice("mood")}>只记心情</button></div>
          </div>
        ) : (
          <div className="release-result"><span className="release-leaf" aria-hidden="true">叶</span><p>你的心绪正随溪流慢慢远去。</p>{result.diaryBody && <p>已保存到日记。</p>}{result.mood && <p>心情已记录。</p>}<button onClick={() => setResult(null)}>再来一次</button></div>
        )}
      </div>
    </section>
  );
}
