import type { CSSProperties } from "react";

export const SCENE_IMAGES = {
  chat: "/scenes/listening-cottage.webp",
  breathe: "/scenes/breathing-flower.webp",
  stream: "/scenes/emotion-stream.webp",
  garden: "/scenes/plant-greenhouse.webp",
  diary: "/scenes/diary-nook.webp",
} as const;

export const COMPANION_SPRITE = "/companions/companion-sprite.webp";

export function sceneStyle(image: string): CSSProperties {
  return { "--scene-image": `url("${image}")` } as CSSProperties;
}
