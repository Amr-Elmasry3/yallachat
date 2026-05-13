export const nameAbbreviation = (name: string): string | null => {
  if (!name) return null;

  const words = name.split(" ");
  let result = "";

  words.map((item) => {
    return (result += item[0]);
  });

  return result;
};
