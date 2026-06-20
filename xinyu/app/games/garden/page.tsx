"use client";
import { useState } from "react";
import { rewardActivity, type GardenState } from "@/features/games/garden-engine";

const growthLabels = ["种子", "嫩芽", "花苞", "初绽", "盛放"];

export default function GardenPage() {
  const [state, setState] = useState<GardenState>({ dew: 0, growth: 0, rewarded: [] });
  const activityId = `2026-06-21:garden`;

  function handleWater() {
    setState((s) => rewardActivity(s, activityId));
  }

  return (
    <section aria-label="花房养成">
      <h1>花房养成</h1>
      <p>晨露: {state.dew}</p>
      <p>生长阶段: {growthLabels[Math.min(state.growth, growthLabels.length - 1)]!}</p>
      <button onClick={handleWater} disabled={state.rewarded.includes(activityId)}>
        {state.rewarded.includes(activityId) ? "今日已浇灌" : "浇灌"}
      </button>
      {state.growth >= 4 && <p>你的植物盛放了！</p>}
    </section>
  );
}
