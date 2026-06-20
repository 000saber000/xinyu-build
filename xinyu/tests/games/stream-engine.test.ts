import { resolveStreamEntry } from "@/features/games/stream-engine";

it("destroys original text", () =>
  expect(resolveStreamEntry("很难过", "destroy", "low")).toEqual({ animationText: "很难过" }));

it("returns a diary body after explicit choice", () =>
  expect(resolveStreamEntry("很难过", "diary", "low")).toMatchObject({ diaryBody: "很难过" }));

it("stores only mood when requested", () =>
  expect(resolveStreamEntry("很难过", "mood", "low")).toEqual({ animationText: "很难过", mood: "low" }));
