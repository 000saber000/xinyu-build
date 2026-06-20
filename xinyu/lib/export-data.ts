import { z } from "zod";
import { diaryEntrySchema, moodEntrySchema } from "./schemas";

export const exportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string().datetime(),
  moods: z.array(moodEntrySchema),
  diary: z.array(diaryEntrySchema),
  games: z.array(
    z.object({
      id: z.string(),
      updatedAt: z.string(),
      value: z.unknown(),
    }),
  ),
});

export type XinyuExport = z.infer<typeof exportSchema>;

export function serializeExport(
  data: Omit<XinyuExport, "version" | "exportedAt">,
) {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      ...data,
    } satisfies Omit<XinyuExport, never>,
    null,
    2,
  );
}

export function parseImport(raw: string) {
  return exportSchema.parse(JSON.parse(raw));
}
