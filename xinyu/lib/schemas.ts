import { z } from "zod";

export const moodValues = ["happy", "calm", "anxious", "low", "warm"] as const;

export const moodEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mood: z.enum(moodValues),
  note: z.string().max(500).default(""),
});

export const diaryEntrySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  title: z.string().max(100),
  body: z.string().max(20_000),
  mood: z.enum(moodValues).optional(),
});

export const apiConfigSchema = z.object({
  baseUrl: z.string().url().refine(
    (url) => new URL(url).protocol === "https:",
    "仅支持 HTTPS"
  ),
  apiKey: z.string().min(1),
  model: z.string().min(1).max(120),
  persist: z.boolean(),
});

export type MoodEntry = z.infer<typeof moodEntrySchema>;
export type DiaryEntry = z.infer<typeof diaryEntrySchema>;
export type ApiConfig = z.infer<typeof apiConfigSchema>;
