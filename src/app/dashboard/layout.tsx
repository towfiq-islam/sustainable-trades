import DashboardLayoutClient from "@/Shared/DashboardLayoutClient";
import { getUser } from "@/lib/getUser";
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

  const user = await getUser();

  return (
    <DashboardLayoutClient Myuser={user} initialUser={initialUser?.data}>
      {children}
    </DashboardLayoutClient>
  );
}
