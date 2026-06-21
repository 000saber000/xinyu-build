import { render, screen } from "@testing-library/react";
import { Courtyard } from "@/components/garden/courtyard";

it("presents the courtyard and every destination", () => {
  render(<Courtyard />);

  expect(screen.getByRole("region", { name: "心屿庭院" })).toBeVisible();
  expect(
    screen.getByRole("heading", {
      name: "今天，想去哪里走走？",
      exact: true,
    }),
  ).toBeVisible();

  const places = [
    { title: "倾听小屋", detail: "与 AI 对话，倾听心声", href: "/chat" },
    { title: "心绪溪流", detail: "释放情绪，放松心绪", href: "/games/stream" },
    { title: "静心花房", detail: "呼吸练习与植物养成", href: "/games" },
  ] as const;

  for (const place of places) {
    const link = screen.getByRole("link", { name: new RegExp(place.title) });
    expect(link).toHaveAttribute(
      "href",
      place.href,
    );
    expect(link.querySelector("[data-place-icon]")).toBeInTheDocument();
    expect(screen.getByText(place.detail, { exact: true })).toBeVisible();
  }
});

it("shows the companion artwork panel without requiring a mood check-in first", () => {
  render(<Courtyard />);
  expect(screen.getByRole("group", { name: "我的陪伴者" })).toBeVisible();
  expect(screen.getAllByTestId("companion-art")).toHaveLength(5);
});
