import { db, resetDatabase } from "@/lib/db";
import {
  moodRepository,
  diaryRepository,
  chatRepository,
  gameRepository,
} from "@/lib/repositories";


beforeEach(resetDatabase);

describe("moodRepository", () => {
  it("stores one mood per local date", async () => {
    const first = await moodRepository.save({
      date: "2026-06-20",
      mood: "calm",
      note: "风很轻",
    });
    const second = await moodRepository.save({
      date: "2026-06-20",
      mood: "warm",
      note: "好多人",
    });

    expect(await db.moods.toArray()).toEqual([
      { date: "2026-06-20", mood: "warm", note: "好多人" },
    ]);
    expect(first).toEqual({ date: "2026-06-20", mood: "calm", note: "风很轻" });
    expect(second).toEqual({ date: "2026-06-20", mood: "warm", note: "好多人" });
  });

  it("lists moods ordered by date", async () => {
    await moodRepository.save({ date: "2026-06-19", mood: "anxious", note: "" });
    await moodRepository.save({ date: "2026-06-20", mood: "happy", note: "不错" });
    await moodRepository.save({ date: "2026-06-18", mood: "low", note: "" });

    const list = await moodRepository.list();
    expect(list).toHaveLength(3);
    expect(list[0]!.date).toBe("2026-06-18");
    expect(list[2]!.date).toBe("2026-06-20");
  });

  it("clears all moods and returns empty list", async () => {
    await moodRepository.save({ date: "2026-06-20", mood: "calm", note: "" });
    await moodRepository.clear();
    const list = await moodRepository.list();
    expect(list).toHaveLength(0);
  });
});

describe("diaryRepository", () => {
  it("saves and lists diary entries", async () => {
    await diaryRepository.save({
      id: "a",
      createdAt: "2026-06-20T08:00:00.000Z",
      title: "早晨",
      body: "今天风很轻",
    });
    await diaryRepository.save({
      id: "b",
      createdAt: "2026-06-20T12:00:00.000Z",
      title: "午后",
      body: "喝了一杯茶",
      mood: "calm",
    });
    const list = await diaryRepository.list();
    expect(list).toHaveLength(2);
    expect(list[0]!.title).toBe("早晨");
    expect(list[1]!.title).toBe("午后");
  });

  it("removes a diary entry by id", async () => {
    await diaryRepository.save({
      id: "z",
      createdAt: "2026-06-20T08:00:00.000Z",
      title: "临时",
      body: "",
    });
    await diaryRepository.remove("z");
    expect(await diaryRepository.list()).toHaveLength(0);
  });

  it("clears all diary entries", async () => {
    await diaryRepository.save({ id: "x", createdAt: new Date().toISOString(), title: "测试", body: "" });
    await diaryRepository.clear();
    expect(await diaryRepository.list()).toHaveLength(0);
  });
});

describe("chatRepository", () => {
  it("saves and lists chat sessions", async () => {
    await chatRepository.save({
      id: "chat-1",
      createdAt: "2026-06-20T08:00:00.000Z",
      companionId: "fox",
      messages: [],
    });
    await chatRepository.save({
      id: "chat-2",
      createdAt: "2026-06-20T09:00:00.000Z",
      companionId: "owl",
      messages: [{ role: "user", content: "你好" }],
    });
    const list = await chatRepository.list();
    expect(list).toHaveLength(2);
    expect(list[0]!.id).toBe("chat-1");
    expect(list[1]!.messages).toHaveLength(1);
  });

  it("removes and clears chat sessions", async () => {
    await chatRepository.save({ id: "chat-1", createdAt: new Date().toISOString(), companionId: "fox", messages: [] });
    await chatRepository.remove("chat-1");
    expect(await chatRepository.list()).toHaveLength(0);

    await chatRepository.save({ id: "chat-2", createdAt: new Date().toISOString(), companionId: "owl", messages: [] });
    await chatRepository.clear();
    expect(await chatRepository.list()).toHaveLength(0);
  });
});

describe("gameRepository", () => {
  it("saves and gets a game state", async () => {
    await gameRepository.save({ id: "plant-garden", updatedAt: new Date().toISOString(), value: { dew: 3, growth: 1 } });
    const state = await gameRepository.get("plant-garden");
    expect(state).not.toBeNull();
    expect(state!.value).toEqual({ dew: 3, growth: 1 });
  });

  it("returns null for unknown game id", async () => {
    expect(await gameRepository.get("nonexistent")).toBeNull();
  });

  it("clears all game states", async () => {
    await gameRepository.save({ id: "g1", updatedAt: new Date().toISOString(), value: {} });
    await gameRepository.save({ id: "g2", updatedAt: new Date().toISOString(), value: {} });
    await gameRepository.clear();
    expect(await gameRepository.get("g1")).toBeNull();
    expect(await gameRepository.get("g2")).toBeNull();
  });
});


