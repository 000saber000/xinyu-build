import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/app-shell";

it("provides the primary navigation and main content", () => {
  render(
    <AppShell>
      <div>内容</div>
    </AppShell>,
  );

  const roamLink = screen.getByRole("link", { name: "漫游" });
  const diaryLink = screen.getByRole("link", { name: "心情日记" });
  const gamesLink = screen.getByRole("link", { name: "小游戏" });
  const settingsLink = screen.getByRole("link", { name: "设置" });

  expect(roamLink).toBeVisible();
  expect(roamLink).toHaveAttribute("href", "/");
  expect(diaryLink).toBeVisible();
  expect(diaryLink).toHaveAttribute("href", "/diary");
  expect(gamesLink).toBeVisible();
  expect(gamesLink).toHaveAttribute("href", "/games");
  expect(settingsLink).toBeVisible();
  expect(settingsLink).toHaveAttribute("href", "/settings");
  expect(screen.getByRole("main")).toHaveTextContent("内容");
});
