import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "心屿" },
  { href: "/", label: "漫游" },
  { href: "/diary", label: "心情日记" },
  { href: "/games", label: "小游戏" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span aria-hidden="true">❧</span>心屿
        </Link>
        <nav aria-label="主导航">
          {navigation.map(({ href, label }) => (
            <Link href={href} key={label}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="settings-link" href="/settings" aria-label="设置">
          <span aria-hidden="true">❧</span>
        </Link>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}
