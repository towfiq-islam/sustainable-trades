"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "@/Shared/DashboardSidebar";
import useAuth from "@/Hooks/useAuth";
import {
  basicNavLinks,
  customerNavLinks,
  proNavLinks,
} from "@/Components/Data/navLinks";
import CombinedNavbar from "./CombinedNavbar";
import ShopSetupGuideModal from "@/Components/Common/ShopSetupGuideModal";

type Props = {
  children: ReactNode;
  initialUser?: any;
};

export default function DashboardLayoutClient({
  children,
  initialUser,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: liveUser } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const user = liveUser ?? initialUser;

  const isPro =
    user?.role === "vendor" && user?.membership?.membership_type === "pro";
  const isBasic =
    user?.role === "vendor" && user?.membership?.membership_type === "basic";
  const isCustomer = user?.role === "customer";

  const isUnauthorized =
    (isPro && !pathname.startsWith("/dashboard/pro")) ||
    (isBasic && !pathname.startsWith("/dashboard/basic")) ||
    (isCustomer && !pathname.startsWith("/dashboard/customer"));

  const userHome = isPro
    ? "/dashboard/pro/home"
    : isBasic
      ? "/dashboard/basic/home"
      : "/dashboard/customer/orders";

  useEffect(() => {
    if (isUnauthorized) {
      router.replace(userHome);
    }
  }, [isUnauthorized, userHome, router]);

  if (isUnauthorized) {
    return null;
  }

  return (
    <section className=" flex flex-col">
      <CombinedNavbar
        variant="dashboard"
        initialUser={initialUser}
        setOpen={setOpen}
      />

      <main className="flex overflow-x-hidden grow">
        {/* Left - Sidebar */}
        <DashboardSidebar
          open={open}
          setOpen={setOpen}
          dashboardNavLinks={
            user?.role === "vendor" &&
            user?.membership?.membership_type === "pro"
              ? proNavLinks
              : user?.role === "vendor" &&
                  user?.membership?.membership_type === "basic"
                ? basicNavLinks
                : user
                  ? customerNavLinks
                  : []
          }
        />

        {/* Right - Outlet */}
        <section className="flex-1 h-[calc(100vh-80px)] p-5 lg:p-8 2xl:p-10 bg-dashboard-bg  overflow-y-auto">
          {children}
        </section>

        {/* Blur Overlay */}
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 bg-black/30 backdrop-blur-[3px] transition-opacity duration-300 2xl:hidden z-50 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      </main>

      <ShopSetupGuideModal />
    </section>
  );
}
