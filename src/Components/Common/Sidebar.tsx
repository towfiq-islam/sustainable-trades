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
    <aside
      className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-lg transform transition-transform duration-300 z-50
      ${open ? "translate-x-0" : "-translate-x-full"} `}
    >
      {/* Close button for mobile */}
      <div className="flex justify-end lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-primary-green cursor-pointer"
        >
          <RxCross2 size={28} />
        </button>
      </div>

      <div className="flex flex-col h-full px-3 gap-3">
        {navLinks.map(item => {
          const isActive =
            pathname === item.path ||
            (item.sub_menu &&
              item.sub_menu.some(
                (sub: any) =>
                  pathname === sub.path ||
                  pathname === `/about/${sub.page_slug}`,
              ));

          return (
            <div key={item.id} className="flex flex-col">
              {item.sub_menu ? (
                // Parent with submenu → use button
                <button
                  onClick={() =>
                    setActiveSubMenu(activeSubMenu === item.id ? null : item.id)
                  }
                  className={`text-left text-lg text-primary-green transition-all hover:font-semibold ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`text-lg text-primary-green transition-all hover:font-semibold ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              )}
              {item.sub_menu && activeSubMenu === item.id && (
                <div className="ml-5 mt-2 flex flex-col gap-3">
                  {item.sub_menu.map(
                    ({ id, page_title, page_slug, path, logo, icon }: any) => {
                      const subIsActive =
                        pathname === path || pathname === `/about/${page_slug}`;

                      return (
                        <Link
                          key={id}
                          href={path ? path : `/about/${page_slug}`}
                          className={`flex gap-2 items-center text-gray-600 hover:text-primary-green text-base transition-all ${
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
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
