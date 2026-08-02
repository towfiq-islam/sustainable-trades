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
  console.log("initialUser", initialUser);

  return (
    <DashboardLayoutClient initialUser={initialUser?.data}>
      {children}
    </DashboardLayoutClient>
  );
}
