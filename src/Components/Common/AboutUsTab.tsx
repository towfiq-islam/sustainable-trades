"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type dynamicItem = {
  id: number;
  page_title: string;
  page_slug: string;
  icon: string;
};

interface DynamicProps {
  dynamicPage: dynamicItem[];
}

const AboutUsTab = ({ dynamicPage }: DynamicProps) => {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-wrap gap-1 lg:gap-0 justify-between items-center lg:block lg:w-[280px] lg:py-8 px-2 sm:px-5 shrink-0 lg:shadow-[0_3px_8px_0_rgba(0,0,0,0.08),_0_3px_10px_0_rgba(0,0,0,0.12)]  space-y-4 rounded-lg ">
      {dynamicPage?.map(({ id, page_title, page_slug, icon }) => (
        <Link
          key={id}
          href={`/about/${page_slug}`}
          className={`flex gap-2.5 items-center text-[14px] md:text-[16px] lg:text-lg lg:border-l-2 border-b-2 lg:border-b-0 pl-1 lg:py-2 duration-300 transition-all mb-0 lg:mb-[16px] hover:text-primary-green ${
            pathname === `/about/${page_slug}`
              ? "font-semibold text-primary-green border-primary-green"
              : "text-light-green border-transparent"
          }`}
        >
          {/* Logo */}
          <figure className="size-[24px] hidden lg:block relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/${icon}`}
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

export default AboutUsTab;
