"use client";
import type { MoodEntry } from "@/lib/schemas";

const moods = [
  ["happy", "开心"],
  ["calm", "平静"],
  ["anxious", "焦虑"],
  ["low", "低落"],
  ["warm", "温暖"],
] as const;

export function MoodCheckIn({
  date,
  onSave,
}: {
  date: string;
  onSave: (entry: MoodEntry) => Promise<unknown>;
}) {
  return (
    <section aria-labelledby="mood-title">
      <h2 id="mood-title">此刻的你，感觉如何？</h2>
      <div>
        {moods.map(([mood, label]) => (
          <button
            key={mood}
            type="button"
            onClick={() => void onSave({ date, mood: mood as MoodEntry["mood"], note: "" })}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
