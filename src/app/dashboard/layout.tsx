import DashboardLayoutClient from "@/Shared/DashboardLayoutClient";
import { serverFetch } from "@/lib/serverFetch";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await serverFetch({
    endpoint: "/api/users/data",
    mode: "SSR",
  });

  return (
    <DashboardLayoutClient initialUser={initialUser?.data}>
      {children}
    </DashboardLayoutClient>
  );
}
