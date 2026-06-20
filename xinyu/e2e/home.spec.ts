import { expect, test } from "@playwright/test";

test("introduces the courtyard journey", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "今天，想去哪里走走？", exact: true }),
  ).toBeVisible();
});
