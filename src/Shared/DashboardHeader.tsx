"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  CartSvg2,
  DownSvg,
  LoveSvg2,
  MessageSvg,
  NotificationSvg,
} from "@/Components/Svg/SvgContainer";
import { useLogout } from "@/Hooks/api/auth_api";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

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
  user: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardHeader = ({ user, setOpen }: DashboardHeaderProps) => {
  const pathname = usePathname();
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
                src="/favicon.svg"
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
              {user?.cart?.cart_items?.length > 0
                ? user?.cart?.cart_items?.length
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
              className={`bg-white border border-gray-100 z-50 rounded-xl w-60 absolute right-0 top-full mt-3 p-4   translate-y-2 hidden lg:block overflow-hidden duration-300 transition-all ${
                showPopover
                  ? "opacity-100 scale-100"
                  : "opacity-0 pointer-events-none scale-95"
              }`}
            >
              <div className="flex gap-3 items-center mb-4">
                <figure className="size-11 bg-primary-pink rounded-full grid place-items-center shrink-0 overflow-hidden relative">
                  {user?.avatar ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.avatar}`}
                      alt="user"
                      fill
                      className="rounded-full size-full object-cover"
                    />
                  ) : (
                    <p className="text-white font-medium capitalize">
                      {user?.first_name.at(0)}
                    </p>
                  )}
                </figure>

                <div>
                  <h3 className="font-semibold truncate">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-gray-500 text-sm truncate max-w-38">
                    {user?.email}
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="mt-4 flex flex-col gap-3 text-gray-700 text-sm">
                <Link
                  href={`${
                    user?.role === "customer"
                      ? "/dashboard/customer/orders"
                      : user?.role === "vendor" &&
                          user?.membership?.membership_type === "pro"
                        ? "/dashboard/pro/home"
                        : "/dashboard/basic/home"
                  }`}
                  className="flex gap-2 items-center hover:text-primary-green font-semibold duration-200 transition"
                >
                  <FaUser />
                  Back to home
                </Link>

                <button
                  disabled={isPending}
                  onClick={() => logoutMutation()}
                  className="flex gap-2 items-center text-primary-red font-semibold duration-200 cursor-pointer transition disabled:cursor-not-allowed disabled:animate-pulse disabled:opacity-70"
                >
                  <FiLogOut />
                  Log Out
                </button>
              </div>
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
