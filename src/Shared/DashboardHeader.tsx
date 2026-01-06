"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  CartSvg2,
  DownSvg,
  LoveSvg2,
  MessageSvg,
  NotificationSvg,
} from "@/Components/Svg/SvgContainer";
import useAuth from "@/Hooks/useAuth";
import { useLogout } from "@/Hooks/api/auth_api";
import { getProductCart, getSiteSettingsClient } from "@/Hooks/api/cms_api";

const navLins = [
  { id: 1, label: "Home", path: "/" },
  { id: 2, label: "Shop", path: "/shop" },
  {
    id: 3,
    label: "Community Member Spotlight",
    path: "/community-member-spotlight",
  },
];

interface DashboardHeaderProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardHeader = ({ setOpen }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { data: cartData } = getProductCart();
  const { data: siteSettings } = getSiteSettingsClient();
  const { mutate: logoutMutation, isPending } = useLogout();
  const [showPopover, setShowPopover] = useState<boolean>(false);

  useEffect(() => {
    const handleWindowClick = () => {
      setShowPopover(false);
    };
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <header className="bg-primary-green py-3 px-5 lg:px-20 relative">
      <div className="flex justify-between items-center">
        {/* Left */}
        <div className="flex gap-2 md:gap-6 2xl:gap-12 items-center">
          {/* Logo */}
          <button
            className="xl:hidden text-white text-2xl cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            ☰
          </button>
          <Link href="/">
            <figure className="size-10 md:size-14 rounded-full relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${siteSettings?.data?.logo}`}
                alt="logo"
                fill
                unoptimized
                className="size-full object-cover rounded-full"
              />
            </figure>
          </Link>

          {/* NavLinks */}
          <div
            className={` hidden 1xl:flex static top-0 left-0 h-auto w-auto bg-transparent transform transition-transform duration-300 ease-in-out z-40  flex-row gap-6 2xl:gap-10 items-center p-0 `}
            onClick={e => e.stopPropagation()}
          >
            {navLins?.map(item => {
              const isActive = pathname === item?.path;
              return (
                <Link
                  className={`text-lg text-[#FEFEFE] ${
                    isActive && "font-semibold "
                  }`}
                  key={item?.id}
                  href={item?.id == 4 || item?.id == 5 ? "#" : item?.path}
                  onClick={e => {
                    e.stopPropagation();
                    if (item?.id == 4 || item?.id == 5) {
                      e.preventDefault();
                    }
                  }}
                >
                  {item?.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="flex gap-5 items-center">
          {/* Message */}
          <Link
            href={`${
              user?.role === "customer"
                ? "messages"
                : user?.role === "vendor" &&
                  user?.membership?.membership_type === "pro"
                ? "messages"
                : "messages"
            }`}
            className="cursor-pointer hidden lg:block text-accent-white"
          >
            <MessageSvg />
          </Link>

          {/* Notification */}
          {user?.role !== "customer" && (
            <Link
              href={`${
                user?.role === "vendor" &&
                user?.membership?.membership_type === "pro"
                  ? "notification"
                  : "notification"
              }`}
              className="cursor-pointer hidden lg:block text-accent-white"
            >
              <NotificationSvg />
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="cursor-pointer relative">
            <button className="absolute -top-4 -right-4 size-5 font-semibold text-xs grid place-items-center rounded-full bg-accent-red text-white cursor-pointer">
              {cartData?.data?.total_cart_items
                ? cartData?.data?.total_cart_items
                : 0}
            </button>
            <CartSvg2 />
          </Link>

          {/* Wishlist */}
          <Link
            href={`${
              user?.role === "customer"
                ? "favorites"
                : user?.role === "vendor" &&
                  user?.membership?.membership_type === "pro"
                ? "favorites"
                : "favorites"
            }`}
            className="cursor-pointer hidden lg:block"
          >
            <LoveSvg2 />
          </Link>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowPopover(!showPopover);
              }}
              className="cursor-pointer flex gap-2 items-center"
            >
              <figure className="size-10 rounded-full border-2 border-white relative grid place-items-center text-lg text-white font-semibold bg-accent-red">
                {user?.avatar ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.avatar}`}
                    alt="author"
                    fill
                    unoptimized
                    className="size-full rounded-full"
                  />
                ) : (
                  <span>{user?.first_name.at(0)}</span>
                )}
              </figure>

              <span
                className={`duration-300 transition-transform ${
                  showPopover ? "rotate-180" : "rotate-0"
                }`}
              >
                <DownSvg />
              </span>
            </button>

            {/* Popover */}
            <div
              onClick={e => e.stopPropagation()}
              className={`absolute top-16 right-0 bg-white drop-shadow z-50 space-y-2 w-[135px] py-3 px-4 border-gray-50 rounded-lg duration-300 transition-all ${
                showPopover
                  ? "opacity-100 scale-100"
                  : "opacity-0 pointer-events-none scale-95"
              }`}
            >
              <button
                onClick={() => logoutMutation()}
                className="flex gap-2.5 items-center text-primary-green text-[17px] duration-300 transition-all hover:font-semibold cursor-pointer"
              >
                {isPending ? "Logging out..." : "Log Out"}
              </button>
            </div>
          </div>

          {user?.role !== "customer" && (
            <Link
              href={`/shop-details?view=${"customer"}&id=${
                user?.shop_info?.user_id
              }&listing_id=${user?.shop_info?.id}`}
              className="px-5 py-2  rounded-lg bg-accent-red text-secondary-black cursor-pointer shadow-[0_3px_10px_0_rgba(0,0,0,0.12),_0_3px_8px_0_rgba(0,0,0,0.08)] duration-300 transition-all hover:text-accent-red hover:bg-transparent border border-accent-red hover:scale-95 hidden lg:block"
            >
              View Shop
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
