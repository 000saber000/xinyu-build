import Link from "next/link";

const games = [
  ["呼吸花开", "跟随花朵，完成三轮舒缓呼吸", "/games/breathe"],
  ["心绪溪流", "写下烦恼，选择放下或珍藏", "/games/stream"],
  ["花房养成", "用晨露慢慢培育一株植物", "/games/garden"],
] as const;

export default function GamesPage() {
  return (
    <section>
      <h1>静心花房</h1>
      <div>
        {games.map(([title, detail, href]) => (
          <Link key={title} href={href}>
            <h2>{title}</h2>
            <p>{detail}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
