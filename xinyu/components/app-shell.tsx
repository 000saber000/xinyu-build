import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "漫游" },
  { href: "/diary", label: "心情日记" },
  { href: "/games", label: "小游戏" },
  { href: "/settings", label: "设置" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          心屿
        </Link>
        <nav aria-label="主导航">
          {navigation.map(({ href, label }) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}
