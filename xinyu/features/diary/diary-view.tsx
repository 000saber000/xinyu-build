"use client";
import { useState } from "react";
import type { MoodEntry, DiaryEntry } from "@/lib/schemas";
import { moodRepository, diaryRepository } from "@/lib/repositories";
import { serializeExport, parseImport } from "@/lib/export-data";
import { SCENE_IMAGES, sceneStyle } from "@/lib/visual-assets";

interface DiaryProps {
  moods: MoodEntry[];
  diary: DiaryEntry[];
}

export function DiaryView({ moods: initialMoods, diary: initialDiary }: DiaryProps) {
  const [moods, setMoods] = useState(initialMoods);
  const [diary, setDiary] = useState(initialDiary);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodEntry["mood"] | "">("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "trend">("list");

  async function handleSave() {
    if (!title.trim() || !body.trim()) return;
    const entry = await diaryRepository.save({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: title.trim(),
      body: body.trim(),
      mood: selectedMood || undefined,
    });
    setDiary((prev) => [entry, ...prev]);
    setTitle("");
    setBody("");
    setSelectedMood("");
  }

  async function handleDelete(id: string) {
    if (confirmDeleteId === id) {
      await diaryRepository.remove(id);
      setDiary((prev) => prev.filter((e) => e.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  }

  function handleExport() {
    const json = serializeExport({ moods, diary, games: [] });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xinyu-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = parseImport(reader.result as string);
        if (!confirm("确认导入？当前数据将被替换。")) return;
        setMoods(data.moods);
        setDiary(data.diary);
        data.moods.forEach((m) => { moodRepository.save(m).catch(() => {}); });
        data.diary.forEach((d) => { diaryRepository.save(d).catch(() => {}); });
      } catch {
        alert("无效的导入文件");
      }
    };
    reader.readAsText(file);
  }

  const moodCounts = moods.reduce<Record<string, number>>((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <section
      aria-label="心情日记"
      className="experience-page experience-page--diary"
      data-scene={SCENE_IMAGES.diary}
      style={sceneStyle(SCENE_IMAGES.diary)}
    >
      <div className="experience-panel diary-panel">
      <p className="experience-eyebrow">📖 📖 (｡•́︿•̀｡) 写给此刻的自己，只有你能看见 🔒 🔒</p>
      <h1>心情日记</h1>
      <form className="form-stack" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <label>标题<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <label>内容<textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={4} /></label>
        <label>心情
          <select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value as MoodEntry["mood"] | "")}>
            <option value="">不记录</option><option value="happy">开心</option><option value="calm">平静</option>
            <option value="anxious">焦虑</option><option value="low">低落</option><option value="warm">温暖</option>
          </select>
        </label>
        <button type="submit">保存</button>
      </form>
      <div className="button-row diary-toolbar">
        <button onClick={() => setViewMode("list")} disabled={viewMode === "list"}>列表</button>
        <button onClick={() => setViewMode("trend")} disabled={viewMode === "trend"}>趋势</button>
        <button onClick={handleExport}>导出</button>
        <label>导入<input type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} /></label>
      </div>
      {viewMode === "trend" && (
        <div aria-label="心情趋势">
          {Object.entries(moodCounts).length === 0 ? <p>暂无心情数据</p> : (
            <ul>{Object.entries(moodCounts).map(([mood, count]) => <li key={mood}>{mood}: {count} 次</li>)}</ul>
          )}
        </div>
      )}
      {viewMode === "list" && (
        <div>
          {diary.length === 0 && <p>暂无日记</p>}
          {diary.map((entry) => (
            <article key={entry.id}>
              <h3>{entry.title}</h3>
              <time>{entry.createdAt.slice(0, 10)}</time>
              {entry.mood && <span> · {entry.mood}</span>}<p>{entry.body}</p>
              <button onClick={() => handleDelete(entry.id)} aria-label={`删除 ${entry.title}`}>
                {confirmDeleteId === entry.id ? "确认删除？" : "删除"}
              </button>
            </article>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}

