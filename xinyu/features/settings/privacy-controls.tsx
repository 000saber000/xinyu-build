"use client";
import { useState } from "react";
import { clearAllUserData, moodRepository, diaryRepository } from "@/lib/repositories";
import { serializeExport } from "@/lib/export-data";

export function PrivacyControls() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  async function handleClearAll() {
    if (!showClearConfirm) { setShowClearConfirm(true); return; }
    await clearAllUserData();
    setShowClearConfirm(false);
    alert("所有本地数据已清除");
  }

  async function handleExport() {
    const [moods, diary] = await Promise.all([moodRepository.list(), diaryRepository.list()]);
    const json = serializeExport({ moods, diary, games: [] });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xinyu-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h2>数据管理</h2>
      <button onClick={handleExport}>导出所有数据</button>
      <button onClick={handleClearAll}>
        {showClearConfirm ? "确认清除所有数据？" : "清除所有数据"}
      </button>
      {showClearConfirm && <button onClick={() => setShowClearConfirm(false)}>取消</button>}
    </div>
  );
}
