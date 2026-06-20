import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { AppShell } from "@/components/app-shell";
import { GlassPanel } from "@/components/glass-panel";

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

  expect(screen.getByRole("link", { name: "心屿" })).toHaveAttribute(
    "href",
    "/",
  );
  expect(
    screen.getByRole("navigation", { name: "主导航" }),
  ).toBeVisible();
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

it("renders the home page within the shell's single main landmark", () => {
  render(
    <AppShell>
      <Home />
    </AppShell>,
  );

  expect(screen.getAllByRole("main")).toHaveLength(1);
});

it("renders GlassPanel as a div and forwards HTML attributes", () => {
  const { container } = render(
    <GlassPanel className="custom-panel" data-surface="calm" />,
  );

  expect(container.firstElementChild).toHaveProperty("tagName", "DIV");
  expect(container.firstElementChild).toHaveClass("glass-panel", "custom-panel");
  expect(container.firstElementChild).toHaveAttribute("data-surface", "calm");
});
