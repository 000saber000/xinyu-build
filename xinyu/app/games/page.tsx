import Link from "next/link";
import { SCENE_IMAGES, sceneStyle } from "@/lib/visual-assets";

const games = [
  ["呼吸花开", "跟随花朵，完成三轮舒缓呼吸", "/games/breathe", SCENE_IMAGES.breathe],
  ["心绪溪流", "写下烦恼，选择放下或珍藏", "/games/stream", SCENE_IMAGES.stream],
  ["花房养成", "用晨露慢慢培育一株植物", "/games/garden", SCENE_IMAGES.garden],
] as const;

export default function GamesPage() {
  return (
    <section
      aria-label="静心花房"
      className="experience-page experience-page--games"
      data-scene={SCENE_IMAGES.garden}
      style={sceneStyle(SCENE_IMAGES.garden)}
    >
      <div className="experience-panel games-hub-panel">
        <p className="experience-eyebrow">⏳ 每次只需几分钟，不追赶，也不比较 (=^･ω･^=) 🕊️</p>
        <h1>静心花房</h1>
        <div className="games-grid">
          {games.map(([title, detail, href, image]) => (
            <Link className="game-card" key={title} href={href} style={sceneStyle(image)}>
              <h2>{title}</h2>
              <p>{detail}</p>
              <span>进入体验 →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
