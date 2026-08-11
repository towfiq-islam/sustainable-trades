"use client";
import { ReactNode, useState } from "react";
import DashboardSidebar from "@/Shared/DashboardSidebar";
import useAuth from "@/Hooks/useAuth";
import {
  basicNavLinks,
  customerNavLinks,
  proNavLinks,
} from "@/Components/Data/navLinks";
import CombinedNavbar from "./CombinedNavbar";

type Props = {
  children: ReactNode;
  initialUser?: any;
};

export default function DashboardLayoutClient({
  children,
  initialUser,
}: Props) {
  const { user: liveUser } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const user = liveUser ?? initialUser;

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
        <section className="flex-1 h-[calc(100vh-80px)] p-4 md:p-8 lg:p-10 bg-[#FFFCF9]  overflow-y-auto">
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
    </section>
  );
}
