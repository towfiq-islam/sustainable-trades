import { cookies } from "next/headers";

type Props = {
  endpoint: string;
  mode: "SSG" | "SSR" | "ISR";
  revalidate?: number;
  tags?: string[];
};

export async function serverFetch({
  endpoint,
  mode = "SSG",
  revalidate = 3600,
  tags = [],
}: Props) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${endpoint}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const fetchOptions: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } =
    mode === "SSR"
      ? { cache: "no-store" }
      : mode === "ISR"
        ? { cache: "force-cache", next: { revalidate, tags } }
        : { cache: "force-cache" };

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token && {
          Cookie: `token=${token}`,
        }),
      },
    });

    if (!res.ok) {
      console.error(
        `[serverFetch] Error: ${res.status} ${res.statusText} at ${url}`,
      );
      return null;
    }

    return res.json();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[serverFetch] Network Error: ${message} at ${url}`);
    return null;
  }
}
