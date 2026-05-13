export const formatDateFromISO = (isoString?: string | null): string => {
  const date: Date = isoString ? new Date(isoString) : new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
