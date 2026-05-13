export const randomBackground = (seed: string): string | null => {
  if (!seed) return null;

  const colors: string[] = [
    "bg-[#fc814a]",
    "bg-[#50a5f1]",
    "bg-[#ffd166]",
    "bg-[#560bad]",
    "bg-[#6153cc]",
    "bg-[#ef476f]",
    "bg-[#025640]",
    "bg-[#665429]",
    "bg-[#601c2c]",
    "bg-[#303238]",
  ];

  const index: number =
    seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % colors.length;

  return colors[index];
};
