export const formatTimeFromISO = (isoString: string | null): string | null => {
  if (!isoString) return null;

  const date: Date = new Date(isoString);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};
