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

export const apiConfigSchema = z.object({ apiKey: z.string().trim().min(1) }).strict();
export type ApiConfig = z.infer<typeof apiConfigSchema>;

export const deepSeekModels = ["deepseek-v4-flash", "deepseek-v4-pro"] as const;
export const deepSeekModelSchema = z.enum(deepSeekModels);
export type DeepSeekModel = z.infer<typeof deepSeekModelSchema>;

export type MoodEntry = z.infer<typeof moodEntrySchema>;
export type DiaryEntry = z.infer<typeof diaryEntrySchema>;
