"use client";
import { useState } from "react";
import { nextBreathingState, type BreathState } from "@/features/games/breathing-machine";

const phaseLabels: Record<BreathState["phase"], string> = {
  idle: "准备开始",
  inhale: "吸气...",
  hold: "屏息...",
  exhale: "呼气...",
  complete: "完成！",
};

export default function BreathePage() {
  const [state, setState] = useState<BreathState>({ phase: "idle", cycle: 0 });

  return (
    <section aria-label="呼吸花开">
      <h1>呼吸花开</h1>
      <p>{phaseLabels[state.phase]}</p>
      <progress value={state.cycle} max={3}>第 {state.cycle}/3 轮</progress>
      {state.phase === "idle" && <button onClick={() => setState((s) => nextBreathingState(s, "START"))}>开始</button>}
      {state.phase !== "idle" && state.phase !== "complete" && (
        <button onClick={() => setState((s) => nextBreathingState(s, "TIMER"))}>下一步</button>
      )}
      {state.phase === "complete" && <p>三组呼吸完成，放松身心</p>}
      {state.phase !== "idle" && <button onClick={() => setState((s) => nextBreathingState(s, "EXIT"))}>退出</button>}
    </section>
  );
}
