import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/app-shell";

it("provides the primary navigation and main content", () => {
  render(
    <AppShell>
      <div>内容</div>
    </AppShell>,
  );

  expect(screen.getByRole("link", { name: "漫游" })).toBeVisible();
  expect(screen.getByRole("link", { name: "心情日记" })).toBeVisible();
  expect(screen.getByRole("link", { name: "小游戏" })).toBeVisible();
  expect(screen.getByRole("link", { name: "设置" })).toBeVisible();
  expect(screen.getByRole("main")).toHaveTextContent("内容");
});
