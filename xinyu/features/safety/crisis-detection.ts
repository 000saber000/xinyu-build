const immediatePatterns: RegExp[] = [
  /现在.{0,8}(自杀|结束生命)/,
  /(已经|正在|马上).{0,10}(准备|计划).{0,8}(自杀|伤害自己|结束生命)/,
  /正准备伤害自己/,
];

export function detectImmediateRisk(text: string): boolean {
  const compact = text.replace(/\s+/g, "");
  return immediatePatterns.some((pattern) => pattern.test(compact));
}
