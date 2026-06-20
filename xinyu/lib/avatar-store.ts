import { db } from "./db";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function saveCustomAvatar(file: File) {
  if (!allowedTypes.has(file.type))
    throw new Error("仅支持 JPG、PNG 或 WebP 图片");
  if (file.size > 2 * 1024 * 1024)
    throw new Error("头像不能超过 2 MB");
  await db.assets.put({ id: "custom-avatar", blob: file });
}

export async function getCustomAvatar() {
  return (await db.assets.get("custom-avatar"))?.blob;
}

export async function removeCustomAvatar() {
  await db.assets.delete("custom-avatar");
}
