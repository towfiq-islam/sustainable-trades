"use client";
import Link from "next/link";
import Image from "next/image";
import h1 from "@/Assets/h1.svg";
import h2 from "@/Assets/h2.svg";
import h3 from "@/Assets/h3.svg";
import h4 from "@/Assets/h4.svg";
import h5 from "@/Assets/h5.svg";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/Components/Common/Container";
import { SearchSvg } from "@/Components/Svg/SvgContainer";
import useAuth from "@/Hooks/useAuth";

const LowerNavbar = ({ dynamicPage }: any) => {
  const { user, setSearch } = useAuth();
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
  const [activeSubMenu, setActiveSubMenu] = useState<number>(0);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleWindowClick = () => {
      setShowMenu(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
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

                return (
                  <Link
                    className={`text-base xl:text-lg text-primary-green ${
                      isActive && "font-semibold "
                    }`}
                    key={item?.id}
                    href={item?.id == 4 || item?.id == 5 ? "#" : item?.path}
                    onClick={e => {
                      e.stopPropagation();
                      if (item?.id == 4 || item?.id == 5) {
                        e.preventDefault();
                      }
                      setShowMenu(true);
                      setActiveSubMenu(item?.id);
                    }}
                  >
                    {item?.label}
                  </Link>
                );
              })}

              {/* Sub Menu */}
              <div
                onClick={e => e.stopPropagation()}
                className={`absolute top-12 ${
                  activeSubMenu === 4 ? "-right-32" : "-right-56"
                } bg-white drop-shadow  w-[280px] py-7 px-5 border-gray-50 rounded-lg flex flex-col gap-7 ${
                  showMenu && (activeSubMenu === 4 || activeSubMenu === 5)
                    ? "block"
                    : "hidden"
                }`}
              >
                {navLins?.map(
                  item =>
                    item?.id === activeSubMenu &&
                    item?.sub_menu?.map(
                      ({
                        id,
                        page_title,
                        page_slug,
                        path,
                        icon,
                        logo,
                      }: any) => (
                        <Link
                          key={id}
                          href={`${path ? path : `/about/${page_slug}`}`}
                          onClick={() => setShowMenu(false)}
                          className={`flex gap-2.5 items-center text-light-green text-[17px] duration-300 transition-all hover:text-primary-green ${
                            (pathname === `/about/${page_slug}` ||
                              pathname === path) &&
                            "font-semibold text-primary-green"
                          }
                        `}
                        >
                          <figure className="size-[24px] relative">
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
                      ),
                    ),
                )}
              </div>
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
              onChange={e => {
                setSearch(e.target.value);
                router.push("/product-location");
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
