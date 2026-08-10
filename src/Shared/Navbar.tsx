"use client";
import CombinedNavbar from "./CombinedNavbar";
import LowerNavbar from "./LowerNavbar";
import ScrollToTop from "react-scroll-to-top";
import { UpArrowSvg } from "@/Components/Svg/SvgContainer";

const Navbar = ({ dynamicPage }: any) => {
  return (
    <>
      <nav className="sticky top-0 z-999">
        <CombinedNavbar dynamicPage={dynamicPage} />
        <LowerNavbar />
      </nav>

      {/* Scroll to top */}
      <ScrollToTop
        smooth={true}
        top={50}
        component={<UpArrowSvg />}
        className="!bg-gray-300 grid place-items-center !size-10 !text-accent-white"
      />
    </>
  );
};

export default Navbar;
