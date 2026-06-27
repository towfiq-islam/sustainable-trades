"use client";
import Link from "next/link";
import useAuth from "@/Hooks/useAuth";
import BasicNavbar from "./BasicNavbar";
import LowerNavbar from "./LowerNavbar";
import DefaultNavbar from "./DefaultNavbar";
import ScrollToTop from "react-scroll-to-top";
import { usePathname } from "next/navigation";
import Container from "@/Components/Common/Container";
import { UpArrowSvg } from "@/Components/Svg/SvgContainer";

const Navbar = ({ dynamicPage }: any) => {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {/* Top Navbar */}
      <div
        className={`bg-accent-red text-secondary-black text-lg font-semibold text-center py-2 ${
          !user && pathname === "/" ? "block" : "hidden"
        }`}
      >
        <Container>
          <Link href="/auth/choose-package" className="">
            Free Month Trial! Sign Up
          </Link>
        </Container>
      </div>

      <nav className="sticky top-0 z-50">
        {/* Upper Navbar */}
        {user &&
        (user?.role === "customer" ||
          (user?.role === "vendor" && user?.membership)) ? (
          <BasicNavbar
            cart_quantity={
              user?.cart?.cart_items?.length > 0
                ? user?.cart?.cart_items?.length
                : 0
            }
            dynamicPage={dynamicPage}
          />
        ) : (
          <DefaultNavbar dynamicPage={dynamicPage} user={user} />
        )}

        {/* Lower Navbar*/}
        <LowerNavbar dynamicPage={dynamicPage} />
      </nav>

      {/* Scroll to top */}
      <ScrollToTop
        smooth={true}
        top={50}
        component={<UpArrowSvg />}
        className="!bg-gray-300 grid place-items-center !size-12 !text-accent-white"
      />
    </>
  );
};

export default Navbar;
