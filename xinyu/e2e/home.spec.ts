import { expect, test, type Page } from "@playwright/test";

const destinations = [
  { name: /倾听小屋/, href: "/chat" },
  { name: /心绪溪流/, href: "/games/stream" },
  { name: /静心花房/, href: "/games" },
] as const;

async function expectCourtyardUsable(page: Page) {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "今天，想去哪里走走？", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("main")).toHaveCount(1);

  for (const destination of destinations) {
    const link = page.getByRole("link", { name: destination.name });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", destination.href);
    await link.scrollIntoViewIfNeeded();
    const isTopmostAtCenter = await link.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      )?.closest("a") === element;
    });
    expect(isTopmostAtCenter).toBe(true);
  }

  const viewport = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.innerWidth);
}

test("keeps every courtyard destination usable on desktop", async ({ page }) => {
  await expectCourtyardUsable(page);
});

test.describe("at a 320px viewport", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("forms a non-overlapping vertical courtyard journey", async ({ page }) => {
    await expectCourtyardUsable(page);

    const headingLineCount = await page
      .getByRole("heading", { name: "今天，想去哪里走走？" })
      .evaluate((heading) =>
        Math.round(
          heading.getBoundingClientRect().height /
            Number.parseFloat(getComputedStyle(heading).lineHeight),
        ),
      );
    expect(headingLineCount).toBe(1);

    const boxes = await Promise.all(
      destinations.map(({ name }) => page.getByRole("link", { name }).boundingBox()),
    );
    expect(boxes.every(Boolean)).toBe(true);
    expect(boxes[1]!.y).toBeGreaterThanOrEqual(boxes[0]!.y + boxes[0]!.height);
    expect(boxes[2]!.y).toBeGreaterThanOrEqual(boxes[1]!.y + boxes[1]!.height);
  });
});
