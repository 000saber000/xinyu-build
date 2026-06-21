import { existsSync, statSync } from "node:fs";
import path from "node:path";

const assets = [
  "public/companions/companion-sprite.webp",
  "public/scenes/listening-cottage.webp",
  "public/scenes/breathing-flower.webp",
  "public/scenes/emotion-stream.webp",
  "public/scenes/plant-greenhouse.webp",
  "public/scenes/diary-nook.webp",
] as const;

it.each(assets)("ships the visual asset %s", (asset) => {
  const file = path.join(process.cwd(), asset);
  expect(existsSync(file)).toBe(true);
  expect(statSync(file).size).toBeGreaterThan(20_000);
});

