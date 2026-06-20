import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodCheckIn } from "@/components/garden/mood-check-in";
import type { MoodEntry } from "@/lib/schemas";
import { vi } from "vitest";

it("renders all five mood options", () => {
  const onSave = vi.fn();
  render(<MoodCheckIn date="2026-06-21" onSave={onSave} />);
  const labels = ["开心", "平静", "焦虑", "低落", "温暖"];
  for (const label of labels) {
    expect(screen.getByRole("button", { name: label })).toBeVisible();
  }
  expect(screen.getByRole("heading", { name: "此刻的你，感觉如何？" })).toBeVisible();
});

it("calls onSave with the selected mood entry", async () => {
  const user = userEvent.setup();
  const onSave = vi.fn().mockResolvedValue(undefined);
  render(<MoodCheckIn date="2026-06-21" onSave={onSave} />);

  await user.click(screen.getByRole("button", { name: "平静" }));
  expect(onSave).toHaveBeenCalledWith({
    date: "2026-06-21",
    mood: "calm",
    note: "",
  });
});

