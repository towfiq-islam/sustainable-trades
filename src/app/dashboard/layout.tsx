"use client";
import React, { ReactNode, useState } from "react";
import DashboardSidebar from "@/Shared/DashboardSidebar";

import {
  PEightSvg,
  PElevenSvg,
  PFifteenSvg,
  PFiveSvg,
  PFourSvg,
  PFourteenSvg,
  PNineSvg,
  POneSvg,
  PSevenSvg,
  PSeventeenSvg,
  PSixSvg,
  PSixteenSvg,
  PTenSvg,
  PThirteenSvg,
  PThreeSvg,
  PTwelveSvg,
  PTwoSvg,
} from "@/Components/Svg/SvgContainer";
import useAuth from "@/Hooks/useAuth";
import DashboardHeader from "@/Shared/DashboardHeader";
import PrivateLayout from "@/Private/PrivateLayout";

const proNavLinks = [
  { id: 1, label: "Dashboard", path: "/dashboard/pro/home", icon: <POneSvg /> },
  { id: 2, label: "Orders", path: "/dashboard/pro/orders", icon: <PTwoSvg /> },
  {
    id: 3,
    label: "Trades",
    path: "/dashboard/pro/trades",
    icon: <PThreeSvg />,
  },
  {
    id: 4,
    label: "Listings & Inventory",
    path: "/dashboard/pro/listing",
    icon: <PFourSvg />,
    subMenus: [
      {
        label: "Listings",
        path: "/dashboard/pro/view-listing",
        icon: <PFourSvg />,
      },
    ],
  },
  {
    id: 5,
    label: "Payments",
    path: "/dashboard/pro/payments",
    icon: <PFiveSvg />,
    subMenus: [
      {
        label: "Payment Integration",
        path: "/dashboard/pro/payment-method",
        icon: <PFiveSvg />,
      },
      {
        label: "Sales Tax",
        path: "/dashboard/pro/taxes",
        icon: <PFiveSvg />,
      },
    ],
  },
  {
    id: 6,
    label: "Accounting",
    path: "/dashboard/pro/accounting",
    icon: <PSixSvg />,
  },
  {
    id: 7,
    label: "Membership",
    path: "/dashboard/pro/membership",
    icon: <PSevenSvg />,
  },
  {
    id: 8,
    label: "Discounts",
    path: "/dashboard/pro/discounts",
    icon: <PEightSvg />,
  },
  {
    id: 9,
    label: "Shipping",
    path: "/dashboard/pro/shipping",
    icon: <PNineSvg />,
  },
  {
    id: 10,
    label: "Favorites",
    path: "/dashboard/pro/favorites",
    icon: <PTenSvg />,
  },
  {
    id: 11,
    label: "Member Spotlight",
    path: "/dashboard/pro/member-spotlight",
    icon: <PElevenSvg />,
  },
  {
    id: 12,
    label: "Notification",
    path: "/dashboard/pro/notification",
    icon: <PTwelveSvg />,
  },
  {
    id: 13,
    label: "Messages",
    path: "/dashboard/pro/messages",
    icon: <PThirteenSvg />,
  },
  {
    id: 14,
    label: "Reviews",
    path: "/dashboard/pro/reviews",
    icon: <PFourteenSvg />,
  },
  {
    id: 15,
    label: "Settings",
    path: "/dashboard/pro/settings",
    icon: <PFifteenSvg />,
  },
];

const basicNavLinks = [
  {
    id: 16,
    label: "Dashboard",
    path: "/dashboard/basic/home",
    icon: <POneSvg />,
  },
  {
    id: 17,
    label: "Listings",
    path: "/dashboard/basic/listings",
    icon: <PSixteenSvg />,
  },
  {
    id: 18,
    label: "Trades",
    path: "/dashboard/basic/trades",
    icon: <PThreeSvg />,
  },
  {
    id: 19,
    label: "Membership",
    path: "/dashboard/basic/membership",
    icon: <PSevenSvg />,
  },
  {
    id: 20,
    label: "Favorites",
    path: "/dashboard/basic/favorites",
    icon: <PTenSvg />,
  },
  {
    id: 21,
    label: "Member Spotlight",
    path: "/dashboard/basic/member-spotlight",
    icon: <PElevenSvg />,
  },
  {
    id: 22,
    label: "Notification",
    path: "/dashboard/basic/notification",
    icon: <PTwelveSvg />,
  },
  {
    id: 23,
    label: "Messages",
    path: "/dashboard/basic/messages",
    icon: <PThirteenSvg />,
  },
  {
    id: 24,
    label: "Settings",
    path: "/dashboard/basic/settings",
    icon: <PFifteenSvg />,
  },
];

const customerNavLinks = [
  {
    id: 25,
    label: "Orders",
    path: "/dashboard/customer/orders",
    icon: <PTwoSvg />,
  },
  {
    id: 26,
    label: "Favorites",
    path: "/dashboard/customer/favorites",
    icon: <PTenSvg />,
  },
  {
    id: 27,
    label: "Cart",
    path: "/dashboard/customer/cart",
    icon: <PSeventeenSvg />,
  },
  {
    id: 28,
    label: "Messages",
    path: "/dashboard/customer/messages",
    icon: <PThirteenSvg />,
  },
  // {
  //   id: 29,
  //   label: "Membership",
  //   path: "/dashboard/customer/membership",
  //   icon: <PSevenSvg />,
  // },
  {
    id: 30,
    label: "Reviews",
    path: "/dashboard/customer/reviews",
    icon: <PFourteenSvg />,
  },
  {
    id: 31,
    label: "Settings",
    path: "/dashboard/customer/settings",
    icon: <PFifteenSvg />,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <PrivateLayout>
      <section className=" flex flex-col">
        {/* Dashboard Header */}
        <DashboardHeader setOpen={setOpen} />

        {/* Dashboard Content */}
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
                : customerNavLinks
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
    </PrivateLayout>
  );
}
