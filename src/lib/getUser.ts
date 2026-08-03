import { serverFetch } from "@/lib/serverFetch";

export const getUser = async () => {
  const res = await serverFetch({ endpoint: "/api/users/data", mode: "SSR" });
  return res?.data ?? null;
};
