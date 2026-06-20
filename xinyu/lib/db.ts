import Dexie, { type EntityTable } from "dexie";
import type { DiaryEntry, MoodEntry } from "./schemas";

export type ChatRow = {
  id: string;
  createdAt: string;
  companionId: string;
  messages: unknown[];
};

export type GameRow = {
  id: string;
  updatedAt: string;
  value: unknown;
};

export type AssetRow = {
  id: string;
  blob: Blob;
};

class XinyuDatabase extends Dexie {
  moods!: EntityTable<MoodEntry, "date">;
  diary!: EntityTable<DiaryEntry, "id">;
  chats!: EntityTable<ChatRow, "id">;
  games!: EntityTable<GameRow, "id">;
  assets!: EntityTable<AssetRow, "id">;

  constructor() {
    super("xinyu");
    this.version(1).stores({
      moods: "date",
      diary: "id,createdAt",
      chats: "id,createdAt",
      games: "id,updatedAt",
      assets: "id",
    });
  }
}

export const db = new XinyuDatabase();

export async function resetDatabase() {
  db.close();
  await Dexie.delete("xinyu");
  db.open();
}
