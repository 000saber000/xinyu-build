export type BreathState = {
  phase: "idle" | "inhale" | "hold" | "exhale" | "complete";
  cycle: number;
};

export function nextBreathingState(
  state: BreathState,
  event: "START" | "TIMER" | "EXIT",
): BreathState {
  if (event === "EXIT") return { phase: "idle", cycle: state.cycle };
  if (event === "START") return { phase: "inhale", cycle: 0 };
  if (state.phase === "idle") return state;
  if (state.phase === "complete") return state;
  if (state.phase === "inhale") return { ...state, phase: "hold" };
  if (state.phase === "hold") return { ...state, phase: "exhale" };
  if (state.phase === "exhale")
    return state.cycle >= 2
      ? { phase: "complete", cycle: 3 }
      : { phase: "inhale", cycle: state.cycle + 1 };
  return state;
}
