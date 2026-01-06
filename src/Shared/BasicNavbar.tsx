"use client";
import Link from "next/link";
import Image from "next/image";
import h1 from "@/Assets/h1.svg";
import h2 from "@/Assets/h2.svg";
import h3 from "@/Assets/h3.svg";
import h4 from "@/Assets/h4.svg";
import h5 from "@/Assets/h5.svg";
import useAuth from "@/Hooks/useAuth";
import { usePathname } from "next/navigation";
import { useLogout } from "@/Hooks/api/auth_api";
import React, { useEffect, useState } from "react";
import Container from "@/Components/Common/Container";
import {
  CartSvg2,
  DownSvg,
  LoveSvg2,
  MessageSvg,
  NotificationSvg,
} from "@/Components/Svg/SvgContainer";
import Sidebar from "@/Components/Common/Sidebar";
import { getProductCart, getSiteSettingsClient } from "@/Hooks/api/cms_api";

const BasicNavbar = ({ dynamicPage }: any) => {
  const { data: siteSettings } = getSiteSettingsClient();
  const { data: cartData } = getProductCart();

  const navLins = [
    { id: 1, label: "Home", path: "/" },
    { id: 2, label: "Shop", path: "/shop" },
    {
      id: 3,
      label: "Community Member Spotlight",
      path: "/community-member-spotlight",
    },
    {
      id: 4,
      label: "About",
      path: "/about",
      sub_menu: dynamicPage,
    },
    {
      id: 5,
      label: "Help",
      path: "/help",
      sub_menu: [
        {
          id: Math.random(),
          page_title: "How-To Tutorials",
          path: "/help/how-to-tutorials",
          logo: h1,
        },
        {
          id: Math.random(),
          page_title: "FAQs",
          path: "/help/faqs",
          logo: h2,
        },
        {
          id: Math.random(),
          page_title: "Contact",
          path: "/help/contact",
          logo: h3,
        },
        {
          id: Math.random(),
          page_title: "Terms and Conditions",
          path: "/help/terms-and-conditions",
          logo: h4,
        },
        {
          id: Math.random(),
          page_title: "Infringement Report",
          path: "/help/infringement-report",
          logo: h5,
        },
      ],
    },
  ];

  const { user } = useAuth();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [activeSubMenu, setActiveSubMenu] = useState<number>(0);
  const { mutate: logoutMutation, isPending } = useLogout();

  useEffect(() => {
    const handleWindowClick = () => {
      setShowMenu(false);
      setShowPopover(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <div className="bg-primary-green py-3">
      <Container>
        <div className="flex justify-between items-center">
          {/* Left */}
          <div className="flex gap-6 xl:gap-12 items-center">
            {/* Left - Logo */}
            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSidebarOpen(true);
                  }}
                  className="block lg:hidden text-white text-2xl cursor-pointer"
                >
                  ☰
                </button>
              )}

              <Sidebar
                dynamicPage={dynamicPage}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
              />
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
            </div>

            {/* NavLinks */}
            <div className="lg:flex hidden gap-5 xl:gap-10 items-center relative">
              {navLins?.map(item => {
                const isActive = pathname === item?.path;

                return (
                  <Link
                    className={`text-lg text-white ${
                      isActive && "font-semibold "
                    }`}
                    key={item?.id}
                    href={item?.id == 4 || item?.id == 5 ? "#" : item?.path}
                    onClick={e => {
                      e.stopPropagation();
                      if (item?.id == 4 || item?.id == 5) {
                        e.preventDefault();
                      }
                      setShowMenu(true);
                      setActiveSubMenu(item?.id);
                    }}
                  >
                    {item?.label}
                  </Link>
                );
              })}

              {/* Sub Menu */}
              <div
                onClick={e => e.stopPropagation()}
                className={`absolute z-10 top-12 ${
                  activeSubMenu === 4 ? "-right-32" : "-right-56"
                } bg-white drop-shadow  w-[280px] py-7 px-5 border-gray-50 rounded-lg flex flex-col gap-7 ${
                  showMenu && (activeSubMenu === 4 || activeSubMenu === 5)
                    ? "block"
                    : "hidden"
                }`}
              >
                {navLins?.map(
                  item =>
                    item?.id === activeSubMenu &&
                    item?.sub_menu?.map(
                      ({
                        id,
                        page_title,
                        page_slug,
                        path,
                        icon,
                        logo,
                      }: any) => (
                        <Link
                          key={id}
                          href={`${path ? path : `/about/${page_slug}`}`}
                          onClick={() => setShowMenu(false)}
                          className={`flex gap-2.5 items-center text-[17px] duration-300 transition-all text-primary-green ${
                            (pathname === `/about/${page_slug}` ||
                              pathname === path) &&
                            "font-semibold text-primary-green"
                          }
                        `}
                        >
                          <figure className="size-[24px] relative">
                            {icon ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${icon}`}
                                alt="icon"
                                fill
                                unoptimized
                                className="size-full object-cover"
                              />
                            ) : (
                              <Image
                                src={logo}
                                alt="logo"
                                fill
                                unoptimized
                                className="size-full object-cover"
                              />
                            )}
                          </figure>

                          <span>{page_title}</span>
                        </Link>
                      )
                    )
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex gap-5 items-center">
            {/* Message */}
            <Link
              href={`${
                user?.role === "customer"
                  ? "dashboard/customer/messages"
                  : user?.role === "vendor" &&
                    user?.membership?.membership_type === "pro"
                  ? "dashboard/pro/messages"
                  : "dashboard/basic/messages"
              }`}
              className="cursor-pointer text-accent-white"
            >
              <MessageSvg />
            </Link>

            {/* Notification */}
            {user?.role !== "customer" && (
              <Link
                href={`${
                  user?.role === "vendor" &&
                  user?.membership?.membership_type === "pro"
                    ? "dashboard/pro/notification"
                    : "dashboard/basic/notification"
                }`}
                className="cursor-pointer text-accent-white"
              >
                <NotificationSvg />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="cursor-pointer relative">
              <button className="absolute -top-4 -right-4 size-5 font-semibold text-xs grid place-items-center rounded-full bg-accent-red text-white cursor-pointer">
                {cartData?.data?.total_cart_items}
              </button>
              <CartSvg2 />
            </Link>

            {/* Wishlist */}
            <Link
              href={`${
                user?.role === "customer"
                  ? "dashboard/customer/favorites"
                  : user?.role === "vendor" &&
                    user?.membership?.membership_type === "pro"
                  ? "dashboard/pro/favorites"
                  : "dashboard/basic/favorites"
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
                <Link
                  href={`${
                    user?.role === "customer"
                      ? "/dashboard/customer/orders"
                      : user?.role === "vendor" &&
                        user?.membership?.membership_type === "pro"
                      ? "/dashboard/pro/home"
                      : "/dashboard/basic/home"
                  }`}
                  className="flex gap-2.5 items-center text-primary-green text-[17px] duration-300 transition-all hover:font-semibold"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => logoutMutation()}
                  className="flex gap-2.5 items-center text-primary-green text-[17px] duration-300 transition-all hover:font-semibold cursor-pointer"
                >
                  {isPending ? "Logging out..." : "Log Out"}
                </button>
              </div>
            </div>

            {/* View shop */}
            {user?.role !== "customer" && (
              <Link
                href={`/shop-details?view=${"customer"}&id=${
                  user?.shop_info?.user_id
                }&listing_id=${user?.shop_info?.id}`}
                className="px-5 py-2 hidden lg:block rounded-lg bg-accent-red text-secondary-black cursor-pointer shadow-[0_3px_10px_0_rgba(0\,0\,0\,0.12),_0_3px_8px_0_rgba(0\,0\,0\,0.08)] duration-300 transition-all hover:text-accent-red hover:bg-transparent border border-accent-red hover:scale-95"
              >
                View Shop
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BasicNavbar;
