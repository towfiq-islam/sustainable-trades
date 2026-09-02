import { getUser } from "@/lib/getUser";
import DashboardLayoutClient from "@/Shared/DashboardLayoutClient";

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
