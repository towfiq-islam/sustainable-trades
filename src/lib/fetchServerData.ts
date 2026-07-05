type serverProps = {
  endpoint: string;
  revalidate?: number;
  ssr?: boolean;
};

export async function fetchServerData({
  endpoint,
  revalidate,
  ssr = false,
}: serverProps) {
  const baseURL = `${process.env.NEXT_PUBLIC_SITE_URL}${endpoint}`;

  const res = await fetch(baseURL, {
    cache: ssr ? "no-store" : "force-cache",
    ...(ssr ? {} : { next: { revalidate: revalidate ?? 3600 } }),
  });

  if (!res.ok) {
    // 404 → return empty data instead of throwing
    if (res.status === 404) {
      return { data: [] };
    }

    // other codes → throw
    throw new Error(`Failed to fetch ${endpoint} — ${res.status}`);
  }

  return res.json();
}
