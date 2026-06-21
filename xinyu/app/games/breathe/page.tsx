"use client";
import { useState } from "react";
import { nextBreathingState, type BreathState } from "@/features/games/breathing-machine";
import { SCENE_IMAGES, sceneStyle } from "@/lib/visual-assets";

const phaseLabels: Record<BreathState["phase"], string> = {
  idle: "准备开始",
  inhale: "吸气…",
  hold: "轻轻停留…",
  exhale: "缓缓呼气…",
  complete: "完成了",
};

export default function BreathePage() {
  const [state, setState] = useState<BreathState>({ phase: "idle", cycle: 0 });

  return (
    <section
      aria-label="呼吸花开"
      className="experience-page experience-page--breathe"
      data-scene={SCENE_IMAGES.breathe}
      style={sceneStyle(SCENE_IMAGES.breathe)}
    >
      <div className="experience-panel game-control-panel">
        <p className="experience-eyebrow">让呼吸像花瓣一样，缓缓打开</p>
        <h1>呼吸花开</h1>
        <div className={`breathing-orb breathing-orb--${state.phase}`} aria-hidden="true" />
        <p className="breathing-phase">{phaseLabels[state.phase]}</p>
        <progress value={state.cycle} max={3}>第 {state.cycle}/3 轮</progress>
        <div className="button-row">
          {state.phase === "idle" && <button onClick={() => setState((s) => nextBreathingState(s, "START"))}>开始</button>}
          {state.phase !== "idle" && state.phase !== "complete" && (
            <button onClick={() => setState((s) => nextBreathingState(s, "TIMER"))}>下一步</button>
          )}
          {state.phase !== "idle" && <button className="button-secondary" onClick={() => setState((s) => nextBreathingState(s, "EXIT"))}>退出</button>}
        </div>
        {state.phase === "complete" && <p>三组呼吸完成，带着这份松弛慢慢回去吧。</p>}
      </div>
    </section>
  );
}
