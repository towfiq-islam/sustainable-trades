"use client";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import { getNavLinks } from "@/Components/Data/navLinks";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";
import Container from "@/Components/Common/Container";
import {
  CartSvg2,
  DownSvg,
  LoveSvg2,
  MessageSvg,
  NotificationSvg,
  ProfileSvg,
} from "@/Components/Svg/SvgContainer";
import Sidebar from "@/Components/Common/Sidebar";
import { FaUser } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { useLogoutMutation } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";

interface CombinedNavbarProps {
  dynamicPages?: any;
  variant?: "public" | "dashboard";
  initialUser?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const CombinedNavbar = ({
  dynamicPages,
  variant = "public",
  initialUser,
  setOpen,
}: CombinedNavbarProps) => {
  const isDashboard = variant === "dashboard";
  const { totalQuantity } = useAppSelector(state => state.cart);
  const navLins = getNavLinks(dynamicPages);
  const { user: liveUser, clearAuthorization } = useAuth();
  const user = liveUser ?? initialUser;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [internalSidebarOpen, setInternalSidebarOpen] =
    useState<boolean>(false);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const [logout, { isLoading }] = useLogoutMutation();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggedIn = !!user;

  const openSubMenu = (id: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveSubMenu(id);
  };

  const scheduleCloseSubMenu = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveSubMenu(null);
    }, 150);
  };

  useEffect(() => {
    const handleWindowClick = () => {
      setShowPopover(false);
      setActiveSubMenu(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPopover(false);
        setActiveSubMenu(null);
      }
    };

    window.addEventListener("click", handleWindowClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("keydown", handleKeyDown);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleOpenSidebar = () => {
    if (setOpen) {
      setOpen(true);
    } else {
      setInternalSidebarOpen(true);
    }
  };

  const messagesHref = isDashboard
    ? "messages"
    : isLoggedIn
      ? user?.role === "customer"
        ? "/dashboard/customer/messages"
        : user?.membership?.membership_type === "pro"
          ? "/dashboard/pro/messages"
          : "/dashboard/basic/messages"
      : "/auth/login";

  const notificationHref = isDashboard
    ? "notification"
    : isLoggedIn
      ? user?.membership?.membership_type === "pro"
        ? "/dashboard/pro/notification"
        : "/dashboard/basic/notification"
      : "/auth/login";

  const favoritesHref = isDashboard
    ? "favorites"
    : isLoggedIn
      ? user?.role === "customer"
        ? "/dashboard/customer/favorites"
        : user?.membership?.membership_type === "pro"
          ? "/dashboard/pro/favorites"
          : "/dashboard/basic/favorites"
      : "/auth/login";

  const dashboardHref = isLoggedIn
    ? user?.role === "customer"
      ? "/dashboard/customer/orders"
      : user?.membership?.membership_type === "pro"
        ? "/dashboard/pro/home"
        : "/dashboard/basic/home"
    : "/auth/login";

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        toast.success("Logged out successfully");
        router.replace("/auth/login");
        dispatch(clearAuthorization());
      });
  };

  const content = (
    <div className="flex justify-between items-center">
      {/* Left */}
      <div className="flex gap-5 xl:gap-7 2xl:gap-12 items-center">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={e => {
              e.stopPropagation();
              handleOpenSidebar();
            }}
            aria-label="Open menu"
            className={`${isDashboard ? "xl:hidden" : "block lg:hidden"} text-white text-2xl cursor-pointer`}
          >
            ☰
          </button>

          {!isDashboard && (
            <Sidebar
              dynamicPages={dynamicPages}
              open={internalSidebarOpen}
              setOpen={setInternalSidebarOpen}
            />
          )}

          <Link href="/" aria-label="Go to homepage">
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
        </div>

        {/* NavLinks */}
        {isDashboard ? (
          <div
            className="hidden 2xl:flex static top-0 left-0 h-auto w-auto bg-transparent transform transition-transform duration-300 ease-in-out z-40 flex-row gap-6 2xl:gap-10 items-center p-0"
            onClick={e => e.stopPropagation()}
          >
            {navLins?.slice(0, 3)?.map(item => {
              const isActive = pathname === item?.path;
              const isDisabled = item?.id == 4 || item?.id == 5;
              return (
                <Link
                  className={`text-lg text-[#FEFEFE] ${isActive && "font-semibold "}`}
                  key={item?.id}
                  href={isDisabled ? "#" : item?.path}
                  onClick={e => {
                    e.stopPropagation();
                    if (isDisabled) e.preventDefault();
                  }}
                >
                  {item?.label}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="lg:flex hidden gap-6 2xl:gap-10 items-center relative">
            {navLins?.map(item => {
              const isActive = pathname === item?.path;
              const hasSubMenu = !!item?.sub_menu?.length;
              const isOpen = activeSubMenu === item?.id;

              if (!hasSubMenu) {
                return (
                  <Link
                    key={item?.id}
                    href={item?.path}
                    className={`2xl:text-lg text-base ${isActive ? "text-white" : "text-gray-200"}`}
                  >
                    {item?.label}
                  </Link>
                );
              }

              return (
                <div
                  key={item?.id}
                  className="relative"
                  onMouseEnter={() => openSubMenu(item?.id)}
                  onMouseLeave={scheduleCloseSubMenu}
                >
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      isOpen ? setActiveSubMenu(null) : openSubMenu(item?.id);
                    }}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    className={`flex items-center gap-1.5 2xl:text-lg text-base cursor-pointer ${isActive ? "text-white" : "text-gray-200"}`}
                  >
                    {item?.label}
                    <span
                      className={`transition-transform text-sm duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    >
                      <FaAngleDown />
                    </span>
                  </button>

                  <div
                    className={`absolute z-20 top-[calc(100%+2rem)] left-1/2 -translate-x-1/2 bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.18)] w-[250px] py-3 px-2 rounded-xl border border-gray-100 flex flex-col gap-1 transition-all duration-200 ease-out origin-top ${
                      isOpen
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
                    }`}
                  >
                    {item?.sub_menu?.map(
                      ({
                        id,
                        page_title,
                        page_slug,
                        path,
                        icon,
                        logo,
                      }: any) => {
                        const itemPath = path ? path : `/about/${page_slug}`;
                        const itemIsActive = pathname === itemPath;

                        return (
                          <Link
                            key={id}
                            href={itemPath}
                            onClick={() => setActiveSubMenu(null)}
                            className={`flex gap-3 items-center px-3 py-2.5 rounded-lg text-[15px] transition-colors duration-150 ${
                              itemIsActive
                                ? "bg-primary-green/10 text-primary-green font-semibold"
                                : "text-gray-700 hover:bg-gray-100 hover:text-primary-green"
                            }`}
                          >
                            <figure className="size-[22px] relative shrink-0">
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
                        );
                      },
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex gap-3 2xl:gap-5 items-center">
        {isLoggedIn && (
          <Link
            href={messagesHref}
            aria-label="Messages"
            className={`cursor-pointer text-accent-white hover:opacity-80 transition-opacity duration-200 ${isDashboard ? "hidden lg:block" : ""}`}
          >
            <MessageSvg />
          </Link>
        )}

        {isLoggedIn && user?.role !== "customer" && (
          <Link
            href={notificationHref}
            aria-label="Notifications"
            className={`cursor-pointer text-accent-white hover:opacity-80 transition-opacity duration-200 ${isDashboard ? "hidden lg:block" : ""}`}
          >
            <NotificationSvg />
          </Link>
        )}

        {!isDashboard && !user && (
          <Link
            href="/auth/create-shop"
            className="px-2 lg:px-4 py-1 md:py-2 block rounded-lg bg-accent-red text-secondary-black cursor-pointer shadow-[0_3px_10px_0_rgba(0,0,0,0.12),_0_3px_8px_0_rgba(0,0,0,0.08)] duration-300 transition-all hover:text-accent-red hover:bg-transparent border border-accent-red text-[15px]"
          >
            Create a Shop
          </Link>
        )}

        <Link
          href="/cart"
          aria-label={`Cart, ${totalQuantity ?? 0} items`}
          className="cursor-pointer relative hover:opacity-80 transition-opacity duration-200"
        >
          <span className="absolute -top-4 -right-4 min-w-5 h-5 px-1 font-semibold text-[11px] grid place-items-center rounded-full bg-accent-red text-white">
            {totalQuantity ?? 0}
          </span>
          <CartSvg2 />
        </Link>

        {isLoggedIn && (
          <Link
            href={favoritesHref}
            aria-label="Favorites"
            className="cursor-pointer hidden lg:block hover:opacity-80 transition-opacity duration-200"
          >
            <LoveSvg2 />
          </Link>
        )}

        {/* Profile / Account */}
        <div className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              setShowPopover(!showPopover);
            }}
            aria-expanded={showPopover}
            aria-haspopup="menu"
            aria-label="Account menu"
            className="cursor-pointer flex gap-2 items-center"
          >
            {isLoggedIn ? (
              <figure className="size-9 md:size-10 rounded-full border md:border-2 border-white relative grid place-items-center md:text-lg text-white font-semibold bg-accent-red overflow-hidden">
                {user?.avatar ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.avatar}`}
                    alt="author"
                    fill
                    unoptimized
                    className="size-full rounded-full"
                  />
                ) : (
                  <span>{user?.first_name?.at(0)}</span>
                )}
              </figure>
            ) : (
              <ProfileSvg />
            )}
            <span
              className={`duration-300 transition-transform ${showPopover ? "rotate-180" : "rotate-0"}`}
            >
              <DownSvg />
            </span>
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className={`bg-white border border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.18)] z-50 rounded-xl absolute right-0 top-full mt-3 translate-y-2 overflow-hidden duration-300 transition-all ${
              isLoggedIn ? "w-60" : "w-40"
            } ${isDashboard ? "hidden lg:block" : ""} ${
              showPopover
                ? "opacity-100 scale-100"
                : "opacity-0 pointer-events-none scale-95"
            }`}
          >
            {isLoggedIn ? (
              <div className="p-4">
                <div className="flex gap-3 items-center mb-4">
                  <figure className="size-11 bg-accent-red border-gray-200 rounded-full grid place-items-center shrink-0 overflow-hidden relative">
                    {user?.avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.avatar}`}
                        alt="user"
                        fill
                        className="rounded-full size-full object-cover"
                      />
                    ) : (
                      <p className="text-white font-medium capitalize">
                        {user?.first_name?.at(0)}
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
                    href={dashboardHref}
                    onClick={() => setShowPopover(false)}
                    className="flex gap-2 items-center hover:text-primary-green font-semibold duration-200 transition"
                  >
                    <FaUser />
                    {isDashboard ? "Back to home" : "Dashboard"}
                  </Link>

                  <button
                    disabled={isLoading}
                    onClick={handleLogout}
                    className="flex gap-2 items-center text-primary-red font-semibold duration-200 cursor-pointer transition disabled:cursor-not-allowed disabled:animate-pulse disabled:opacity-70"
                  >
                    <FiLogOut />
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col text-gray-700 p-2 text-[15px]">
                <Link
                  href="/auth/login"
                  onClick={() => setShowPopover(false)}
                  className="flex gap-2 items-center w-full py-2 font-medium hover:bg-off-green px-2 rounded-lg"
                >
                  <FiLogIn className="text-base" />
                  Log In
                </Link>
                <Link
                  href="/auth/choose-package"
                  onClick={() => setShowPopover(false)}
                  className="flex gap-2 items-center w-full py-2 font-medium hover:bg-off-green px-2 rounded-lg"
                >
                  <FiUserPlus className="text-base" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {isDashboard && user?.role !== "customer" && (
          <Link
            href={`/shop-details?view=customer&id=${user?.shop_info?.user_id}&listing_id=${user?.shop_info?.id}`}
            className="px-5 py-2 rounded-lg bg-accent-red text-secondary-black cursor-pointer shadow-[0_3px_10px_0_rgba(0,0,0,0.12),_0_3px_8px_0_rgba(0,0,0,0.08)] duration-300 transition-all hover:text-accent-red hover:bg-transparent border border-accent-red hover:scale-95 hidden lg:block"
          >
            View Shop
          </Link>
        )}
      </div>
    </div>
  );

  if (isDashboard) {
    return (
      <header className="bg-primary-green py-3 px-5 lg:px-20 relative">
        {content}
      </header>
    );
  }

  return (
    <div className="bg-primary-green py-3">
      <Container>{content}</Container>
    </div>
  );
};

export default CombinedNavbar;
