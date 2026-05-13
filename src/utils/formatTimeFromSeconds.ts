export const formatTimeFromSeconds = (
  sec: number | undefined,
): string | null => {
  if (!sec) return null;

  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
