import type { MoodEntry } from "@/lib/schemas";

export type StreamChoice = "destroy" | "diary" | "mood";

export function resolveStreamEntry(
  text: string,
  choice: StreamChoice,
  mood: MoodEntry["mood"],
): { animationText: string; diaryBody?: string; mood?: MoodEntry["mood"] } {
  if (choice === "diary") return { animationText: text, diaryBody: text };
  if (choice === "mood") return { animationText: text, mood };
  return { animationText: text };
}
