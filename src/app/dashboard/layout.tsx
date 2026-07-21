import { cookies } from "next/headers";
import DashboardLayoutClient from "@/Shared/DashboardLayoutClient";

async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/data`,
      {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getServerUser();
  return (
    <DashboardLayoutClient initialUser={initialUser?.data}>
      {children}
    </DashboardLayoutClient>
  );
}
