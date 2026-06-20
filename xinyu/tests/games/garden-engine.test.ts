import { rewardActivity } from "@/features/games/garden-engine";

const initial = { dew: 0, growth: 0, rewarded: [] as string[] };

it("rewards an activity once", () => {
  const once = rewardActivity(initial, "2026-06-20:mood");
  expect(rewardActivity(once, "2026-06-20:mood")).toEqual(once);
});

it("does not remove progress after a gap", () =>
  expect(rewardActivity({ dew: 4, growth: 2, rewarded: [] }, "2026-07-20:diary").dew).toBe(5));

it("increases growth every 3 dew", () => {
  let s = initial;
  s = rewardActivity(s, "1:mood"); s = rewardActivity(s, "2:diary"); s = rewardActivity(s, "3:breathe");
  expect(s.growth).toBe(1);
});
