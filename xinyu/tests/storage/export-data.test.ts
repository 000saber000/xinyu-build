import { serializeExport, parseImport } from "@/lib/export-data";

const UUID = "550e8400-e29b-41d4-a716-446655440000";

const sampleMoods = [
  { date: "2026-06-18", mood: "calm" as const, note: "" },
  { date: "2026-06-19", mood: "happy" as const, note: "不错" },
];

const sampleDiary = [
  { id: UUID, createdAt: new Date().toISOString(), title: "周一", body: "记录", mood: "calm" as const },
];

const sampleGames = [
  { id: "plant-garden", updatedAt: new Date().toISOString(), value: { dew: 3, growth: 1 } },
];

it("produces valid version-1 export JSON", () => {
  const json = serializeExport({ moods: sampleMoods, diary: sampleDiary, games: sampleGames });
  const parsed = JSON.parse(json);
  expect(parsed.version).toBe(1);
  expect(parsed.moods).toHaveLength(2);
  expect(parsed.diary).toHaveLength(1);
  expect(parsed.games).toHaveLength(1);
});

it("excludes 'apiKey' at any depth", () => {
  const json = serializeExport({ moods: sampleMoods, diary: sampleDiary, games: sampleGames });
  expect(json).not.toContain("apiKey");
  const reimport = parseImport(json);
  expect(JSON.stringify(reimport)).not.toContain("apiKey");
});

it("round-trips through parseImport", () => {
  const json = serializeExport({ moods: sampleMoods, diary: [], games: [] });
  const imported = parseImport(json);
  expect(imported.version).toBe(1);
  expect(imported.moods[0]!.mood).toBe("calm");
});

it("rejects invalid import data", () => {
  expect(() => parseImport('{"version": 2}')).toThrow();
  expect(() => parseImport("not json")).toThrow();
});
