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

    const geometry = await link.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        visibleHeight:
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
        topmost:
          document
            .elementFromPoint(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
            )
            ?.closest("a") === element,
      };
    });

    expect(geometry.height).toBeGreaterThan(0);
    expect(geometry.visibleHeight).toBeGreaterThan(0);
    expect(geometry.top).toBeGreaterThanOrEqual(-1);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.innerHeight + 1);
    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(geometry.innerWidth);
    expect(geometry.topmost).toBe(true);
  }

  const viewport = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.innerWidth);
}

async function tabToLink(page: Page, name: RegExp) {
  const target = page.getByRole("link", { name });

  for (let press = 0; press < 10; press += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((element) => element === document.activeElement)) {
      return target;
    }
  }

  throw new Error(`Tab did not reach ${name}`);
}

test("keeps every courtyard destination usable on desktop", async ({ page }) => {
  await expectCourtyardUsable(page);
});

test("supports keyboard focus for every courtyard destination", async ({ page }) => {
  await page.goto("/");

  for (const destination of destinations) {
    const link = await tabToLink(page, destination.name);
    const focusStyle = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
      };
    });
    expect(focusStyle.outlineStyle).not.toBe("none");
    expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(3);
  }
});

test("opens each courtyard destination", async ({ page }) => {
  for (const destination of destinations) {
    await page.goto("/");
    await page.getByRole("link", { name: destination.name }).click();
    await expect(page).toHaveURL(new RegExp(`${destination.href.replaceAll("/", "\\/")}$`));
  }
});

test("disables drifting mist when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator(".courtyard-mist")).toHaveCSS("animation-name", "none");
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

  test("shows a distinct landmark slice for each destination", async ({ page }) => {
    await page.goto("/");

    const landmarkStyles = await Promise.all(
      destinations.map(({ name }) =>
        page.getByRole("link", { name }).evaluate((element) => {
          const style = getComputedStyle(element, "::before");
          return {
            backgroundImage: style.backgroundImage,
            backgroundPosition: style.backgroundPosition,
          };
        }),
      ),
    );

    for (const style of landmarkStyles) {
      expect(style.backgroundImage).toContain("courtyard-base.webp");
    }
    expect(new Set(landmarkStyles.map(({ backgroundPosition }) => backgroundPosition)).size).toBe(3);
  });
});
