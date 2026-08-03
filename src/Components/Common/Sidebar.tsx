"use client";
import Link from "next/link";
import Image from "next/image";
import h1 from "@/Assets/h1.svg";
import h2 from "@/Assets/h2.svg";
import h3 from "@/Assets/h3.svg";
import h4 from "@/Assets/h4.svg";
import h5 from "@/Assets/h5.svg";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiChevronDown } from "react-icons/fi";
import logo from "@/Assets/logo.svg";

const Sidebar = ({ open, setOpen, dynamicPage }: any) => {
  const navLinks = [
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
          id: 11,
          page_title: "How-To Tutorials",
          path: "/help/how-to-tutorials",
          logo: h1,
        },
        { id: 12, page_title: "FAQs", path: "/help/faqs", logo: h2 },
        { id: 13, page_title: "Contact", path: "/help/contact", logo: h3 },
        {
          id: 14,
          page_title: "Terms and Conditions",
          path: "/help/terms-and-conditions",
          logo: h4,
        },
        {
          id: 15,
          page_title: "Infringement Report",
          path: "/help/infringement-report",
          logo: h5,
        },
      ],
    },
  ];

  const pathname = usePathname();
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white py-7 px-3 shadow-lg transform transition-transform duration-300 z-50
      ${open ? "translate-x-0" : "-translate-x-full"} `}
      >
        <Link href="/">
          <figure className="size-20 mx-auto rounded-full relative">
            <Image
              src={logo}
              alt="logo"
              fill
              unoptimized
              className="size-full object-cover rounded-full"
            />
          </figure>
        </Link>

        {/* Close button for mobile */}
        <div className="absolute top-3 right-3 xl:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-primary-green cursor-pointer"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        <div className="flex flex-col h-full px-3 gap-5 pt-5">
          {navLinks.map(item => {
            const isActive =
              pathname === item.path ||
              (item.sub_menu &&
                item.sub_menu.some(
                  (sub: any) =>
                    pathname === sub.path ||
                    pathname === `/about/${sub.page_slug}`,
                ));

            const isSubMenuOpen = activeSubMenu === item.id;

            return (
              <div key={item.id} className="flex flex-col">
                {item.sub_menu ? (
                  <button
                    onClick={() =>
                      setActiveSubMenu(isSubMenuOpen ? null : item.id)
                    }
                    className={`flex items-center justify-between text-left cursor-pointer text-primary-green transition-colors duration-300 ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    <span>{item.label}</span>
                    <FiChevronDown
                      className={`transition-transform duration-300 ease-out ${
                        isSubMenuOpen ? "rotate-180" : "rotate-0"
                      }`}
                      size={16}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className={`text-primary-green transition-colors duration-300 ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {item.sub_menu && (
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isSubMenuOpen ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-3 mt-3 flex flex-col gap-4">
                        {item.sub_menu.map(
                          ({
                            id,
                            page_title,
                            page_slug,
                            path,
                            logo,
                            icon,
                          }: any) => {
                            const subIsActive =
                              pathname === path ||
                              pathname === `/about/${page_slug}`;

                            return (
                              <Link
                                key={id}
                                href={path ? path : `/about/${page_slug}`}
                                className={`flex gap-2 items-center text-gray-600 hover:text-primary-green text-[15px] transition-colors duration-300 ${
                                  subIsActive
                                    ? "font-semibold text-primary-green"
                                    : ""
                                }`}
                                onClick={() => setOpen(false)}
                              >
                                <figure className="size-5 relative">
                                  {icon ? (
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/${icon}`}
                                      alt="icon"
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <Image
                                      src={logo}
                                      alt="logo"
                                      fill
                                      className="object-cover"
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Blur/backdrop overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
    </>
  );
};

export default Sidebar;
