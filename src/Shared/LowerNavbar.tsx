"use client";
import Link from "next/link";
import Image from "next/image";
import h1 from "@/Assets/h1.svg";
import h2 from "@/Assets/h2.svg";
import h3 from "@/Assets/h3.svg";
import h4 from "@/Assets/h4.svg";
import h5 from "@/Assets/h5.svg";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Container from "@/Components/Common/Container";
import { SearchSvg } from "@/Components/Svg/SvgContainer";
import useAuth from "@/Hooks/useAuth";
import { FaAngleDown } from "react-icons/fa";

const LowerNavbar = ({ user, dynamicPage }: any) => {
  const { search, setSearch } = useAuth();
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
    {
      id: 6,
      label: "Blog",
      path: "/blog",
    },
  ];

  const pathname = usePathname();
  const router = useRouter();
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(0);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <div className="bg-white py-4 drop-shadow">
      <Container>
        <div className="flex justify-between items-center">
          {/* Left - NavLinks */}
          <div>
            <div
              className={`gap-5 xl:gap-10 items-center relative ${
                user ? "hidden" : "hidden lg:flex"
              }`}
            >
              {navLins?.map(item => {
                const isActive = pathname === item?.path;
                const hasSubMenu = !!item?.sub_menu?.length;
                const isOpen = activeSubMenu === item?.id;

                if (!hasSubMenu) {
                  return (
                    <Link
                      className={`text-lg transition-colors duration-200 ${
                        isActive
                          ? "font-semibold text-primary-green"
                          : "text-primary-green"
                      }`}
                      key={item?.id}
                      href={item?.path}
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
                      className={`flex items-center gap-1.5 text-lg transition-colors duration-200 cursor-pointer ${
                        isActive || isOpen
                          ? "font-semibold text-primary-green"
                          : "text-primary-green"
                      }`}
                    >
                      {item?.label}
                      <span
                        className={`transition-transform text-base duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <FaAngleDown />
                      </span>
                    </button>

                    {/* Sub Menu */}
                    <div
                      className={`absolute z-20 top-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.18)] w-[250px] py-3 px-2 rounded-xl border border-gray-100 flex flex-col gap-1 transition-all duration-200 ease-out origin-top ${
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

            <Link
              href="/"
              className={`text-base xl:text-lg text-primary-green font-semibold ${
                user ? "block" : "hidden"
              }`}
            >
              Home
            </Link>
          </div>

          {/* Right - Searchbar */}
          <div className="flex gap-1 items-center border border-primary-green px-3 py-2 rounded-lg w-full lg:w-[400px]  xl:w-[528px]">
            <SearchSvg />
            <input
              type="text"
              value={search}
              onChange={e => {
                const value = e.target.value;
                setSearch(value);
                if (value.trim()) {
                  router.push("/product-location");
                }
              }}
              placeholder="Search by product....."
              className="w-full border-none outline-none"
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LowerNavbar;
