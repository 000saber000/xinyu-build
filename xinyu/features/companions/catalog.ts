export const companions = [
  { id: "fox", name: "小茶", kind: "赤狐", tone: "温和、有耐心、善于倾听", spritePosition: "0% 0%" },
  { id: "owl", name: "青书", kind: "林鸮", tone: "睿智、善解人意、不说教", spritePosition: "50% 0%" },
  { id: "deer", name: "白露", kind: "灵鹿", tone: "温柔、包容、鼓励人心", spritePosition: "100% 0%" },
  { id: "cat", name: "月团", kind: "猫咪", tone: "安静、俏皮、不过度热情", spritePosition: "0% 100%" },
  { id: "spirit", name: "微光", kind: "幻想精灵", tone: "轻盈、诗意、保持清澈", spritePosition: "50% 100%" },
] as const;

export type CompanionId = typeof companions[number]["id"];
