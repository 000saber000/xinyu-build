import { detectImmediateRisk } from "@/features/safety/crisis-detection";

it.each([
  "我现在就想自杀",
  "我已经准备好结束生命了",
  "我正准备伤害自己",
])("flags immediate wording", (text) => {
  expect(detectImmediateRisk(text)).toBe(true);
});

it.each([
  "最近心情很低落",
  "今天压力很大",
  "我不喜欢现在的工作",
])("does not over-trigger ordinary distress", (text) => {
  expect(detectImmediateRisk(text)).toBe(false);
});
