import DashboardLayoutClient from "@/Shared/DashboardLayoutClient";
import { cookies } from "next/headers";

async function getServerUser() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/data`,
      {
        headers: {
          Cookie: cookieHeader,
          Accept: "application/json",
        },
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
    <DashboardLayoutClient initialUser={initialUser}>
      {children}
    </DashboardLayoutClient>
  );
}
