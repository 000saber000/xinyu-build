import { renderToStaticMarkup } from "react-dom/server";
import { metadata } from "@/app/layout";
import RootLayout from "@/app/layout";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist-sans" }),
  Geist_Mono: () => ({ variable: "font-geist-mono" }),
}));

it("describes the Xinyu application", () => {
  expect(metadata).toMatchObject({
    title: "心屿",
    description: "一座可以倾诉、记录与休息的线上心灵驿站",
  });
});

it("declares Simplified Chinese as the document language", () => {
  const markup = renderToStaticMarkup(
    <RootLayout>
      <main />
    </RootLayout>,
  );

  expect(markup).toContain('<html lang="zh-CN"');
});

it("preloads the courtyard base image", () => {
  const markup = renderToStaticMarkup(
    <RootLayout>
      <div />
    </RootLayout>,
  );

  expect(markup).toContain(
    '<link rel="preload" href="/garden/courtyard-base.webp" as="image" type="image/webp"',
  );
});
