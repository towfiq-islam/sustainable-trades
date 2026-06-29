"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "@/Components/Common/Container";
import { CartSvg, DownSvg, ProfileSvg } from "@/Components/Svg/SvgContainer";
import Sidebar from "@/Components/Common/Sidebar";

const DefaultNavbar = ({ user, dynamicPage }: any) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
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
    <div className="bg-primary-green py-3">
      <Container>
        <div className="flex justify-between items-center">
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setOpen(true);
                }}
                className="block lg:hidden text-white text-2xl cursor-pointer"
              >
                ☰
              </button>
            )}

            <Sidebar dynamicPage={dynamicPage} open={open} setOpen={setOpen} />
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
          </div>

          {/* Right */}
          <div className="flex gap-2 lg:gap-4 items-center">
            <Link
              href="/auth/create-shop"
              className="px-2 lg:px-4 py-1 md:py-2 block rounded-lg bg-accent-red text-secondary-black cursor-pointer shadow-[0_3px_10px_0_rgba(0\,0\,0\,0.12),_0_3px_8px_0_rgba(0\,0\,0\,0.08)] duration-300 transition-all hover:text-accent-red hover:bg-transparent border border-accent-red hover:scale-95 text-[12px] md:text-base"
            >
              Create a Shop
            </Link>

            <button
              onClick={e => {
                e.stopPropagation();
                setShowPopover(!showPopover);
              }}
              className="cursor-pointer flex md:gap-2 items-center relative"
            >
              <ProfileSvg />
              <span
                className={`duration-300 transition-transform ${
                  showPopover ? "rotate-180" : "rotate-0"
                }`}
              >
                <DownSvg />
              </span>

              {/* Popover */}
              <div
                onClick={e => e.stopPropagation()}
                className={`absolute top-14 right-0 bg-gray-50 shadow-lg border z-50 space-y-1.5 w-[100px] py-3 px-4 border-gray-100 rounded-lg duration-300 transition-all ${
                  showPopover
                    ? "opacity-100 scale-100"
                    : "opacity-0 pointer-events-none scale-95"
                }`}
              >
                <Link
                  href="/auth/choose-package"
                  onClick={() => setShowPopover(false)}
                  className={`flex gap-2.5 items-center text-primary-green text-[17px] duration-300 transition-all hover:font-semibold font-medium`}
                >
                  Sign Up
                </Link>

                <Link
                  href="/auth/login"
                  onClick={() => setShowPopover(false)}
                  className={`flex gap-2.5 items-center text-primary-green text-[17px] duration-300 transition-all hover:font-semibold font-medium`}
                >
                  Log In
                </Link>
              </div>
            </button>

            <Link href="/cart" className="cursor-pointer">
              <CartSvg />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DefaultNavbar;
