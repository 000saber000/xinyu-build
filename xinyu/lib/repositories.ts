import { db } from "./db";
import { moodEntrySchema, type MoodEntry } from "./schemas";

export const moodRepository = {
  async save(input: MoodEntry) {
    const entry = moodEntrySchema.parse(input);
    await db.moods.put(entry);
    return entry;
  },
  list() {
    return db.moods.orderBy("date").toArray();
  },
  clear() {
    return db.moods.clear();
  },
};

export const diaryRepository = {
  async save(input: { id: string; createdAt: string; title: string; body: string; mood?: "happy" | "calm" | "anxious" | "low" | "warm" }) {
    const entry = { ...input, body: input.body || "", id: input.id || crypto.randomUUID(), createdAt: input.createdAt || new Date().toISOString() };
    await db.diary.put(entry);
    return entry;
  },
  list() {
    return db.diary.orderBy("createdAt").toArray();
  },
  async remove(id: string) {
    await db.diary.delete(id);
  },
  clear() {
    return db.diary.clear();
  },
};

export const chatRepository = {
  async save(input: { id: string; createdAt: string; companionId: string; messages: unknown[] }) {
    await db.chats.put(input);
    return input;
  },
  list() {
    return db.chats.orderBy("createdAt").toArray();
  },
  async remove(id: string) {
    await db.chats.delete(id);
  },
  clear() {
    return db.chats.clear();
  },
};

export const gameRepository = {
  async save(input: { id: string; updatedAt: string; value: unknown }) {
    await db.games.put(input);
    return input;
  },
  async get(id: string) {
    const result = await db.games.get(id);
    return result ?? null;
  },
  async remove(id: string) {
    await db.games.delete(id);
  },
  clear() {
    return db.games.clear();
  },
};



export async function clearAllUserData() {
  await db.transaction("rw", db.moods, db.diary, db.chats, db.games, db.assets, async () => {
    await Promise.all([db.moods.clear(), db.diary.clear(), db.chats.clear(), db.games.clear(), db.assets.clear()]);
  });
  const counts = await Promise.all([db.moods.count(), db.diary.count(), db.chats.count(), db.games.count(), db.assets.count()]);
  if (counts.some(Boolean)) throw new Error("本地数据未能完全清空");
  localStorage.removeItem("xinyu.api-config");
  localStorage.removeItem("xinyu.api-key");
  localStorage.removeItem("xinyu.companion");
}
