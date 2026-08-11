"use client";
import { UpArrowSvg } from "@/Components/Svg/SvgContainer";
import ScrollToTop from "react-scroll-to-top";

export const ScrollTop = () => (
  <ScrollToTop
    smooth={true}
    top={50}
    component={<UpArrowSvg />}
    className="!bg-gray-300 grid place-items-center !size-10 !text-accent-white"
  />
);
