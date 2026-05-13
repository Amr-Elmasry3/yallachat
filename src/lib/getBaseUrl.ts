import { headers } from "next/headers";

export const getBaseUrl = async (): Promise<string> => {
  const headersList = await headers();

  const host = headersList.get("host");

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  return `${protocol}://${host}`;
};
