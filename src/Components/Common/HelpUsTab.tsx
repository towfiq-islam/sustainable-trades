"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import h1 from "@/Assets/h1.svg";
import h2 from "@/Assets/h2.svg";
import h3 from "@/Assets/h3.svg";
import h4 from "@/Assets/h4.svg";
import h5 from "@/Assets/h5.svg";
import { usePathname } from "next/navigation";
const navLinks = [
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
];

const HelpUsTab = () => {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-wrap gap-1 lg:gap-0 justify-between items-center lg:block lg:w-[280px] lg:py-8 px-2 sm:px-5 shrink-0 lg:shadow-[0_3px_8px_0_rgba(0,0,0,0.08),_0_3px_10px_0_rgba(0,0,0,0.12)]  space-y-4 rounded-lg ">
      {navLinks?.map(({ id, page_title, path, logo }) => (
        <Link
          key={id}
          href={path}
          className={`flex gap-2.5 items-center text-[14px] md:text-[16px] lg:text-lg lg:border-l-2 border-b-2 lg:border-b-0 pl-1 lg:py-2 duration-300 transition-all mb-0 lg:mb-[16px] hover:text-primary-green ${
            pathname === path
              ? "font-semibold text-primary-green border-primary-green"
              : "text-light-green border-transparent"
          }`}
        >
          {/* Logo */}
          <figure className="size-[24px] hidden lg:block relative">
            <Image
              src={logo}
              alt="logo"
              fill
              className="size-full object-cover"
            />
          </figure>

          {/* Title */}
          <span>{page_title}</span>
        </Link>
      ))}
    </div>
  );
};

export default HelpUsTab;
