"use client";
import { useState } from "react";
import { rewardActivity, type GardenState } from "@/features/games/garden-engine";
import { SCENE_IMAGES, sceneStyle } from "@/lib/visual-assets";

const growthLabels = ["种子", "嫩芽", "花苞", "初绽", "盛放"];

export default function GardenPage() {
  const [state, setState] = useState<GardenState>({ dew: 0, growth: 0, rewarded: [] });
  const activityId = `${new Date().toISOString().slice(0, 10)}:garden`;
  const watered = state.rewarded.includes(activityId);
  return (
    <section
      aria-label="花房养成"
      className="experience-page experience-page--garden"
      data-scene={SCENE_IMAGES.garden}
      style={sceneStyle(SCENE_IMAGES.garden)}
    >
      <div className="experience-panel game-control-panel">
        <p className="experience-eyebrow">🌱 (｡･ω･｡)ﾉ♡ 照顾一株植物，也照顾今天的自己 🪴</p>
        <h1>花房养成</h1>
        <div className="garden-stats"><span>晨露 <strong>{state.dew}</strong></span><span>生长阶段 <strong>{growthLabels[Math.min(state.growth, growthLabels.length - 1)]}</strong></span></div>
        <button onClick={() => setState((s) => rewardActivity(s, activityId))} disabled={watered}>{watered ? "今日已浇灌" : "用晨露浇灌"}</button>
        <p className="experience-note">不连续签到也不会失去进度，植物会安静地等你回来。</p>
        {state.growth >= 4 && <p>你的植物盛放了！</p>}
      </div>
    </section>
  );
}
