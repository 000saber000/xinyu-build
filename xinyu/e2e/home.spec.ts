import { expect, test } from "@playwright/test";

test("introduces the courtyard journey", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "今天，想去哪里走走？", exact: true }),
  ).toBeVisible();
});

test.describe("at a 320px viewport", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("keeps the header navigation usable without horizontal overflow", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "主导航" }),
    ).toBeVisible();

    const brandBox = await page.getByRole("link", { name: "心屿" }).boundingBox();
    const navBox = await page
      .getByRole("navigation", { name: "主导航" })
      .boundingBox();
    expect(brandBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(navBox!.y).toBeGreaterThanOrEqual(brandBox!.y + brandBox!.height);

    for (const name of ["漫游", "心情日记", "小游戏", "设置"]) {
      const link = page.getByRole("link", { name, exact: true });
      await expect(link).toBeVisible();
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    }

    const viewport = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.innerWidth);
  });
});
