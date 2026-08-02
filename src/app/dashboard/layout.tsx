import DashboardLayoutClient from "@/Shared/DashboardLayoutClient";
import { getUser } from "@/lib/getUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getUser();

  return (
    <DashboardLayoutClient initialUser={initialUser}>
      {children}
    </DashboardLayoutClient>
  );
}
