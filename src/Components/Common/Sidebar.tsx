"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiChevronDown } from "react-icons/fi";
import logo from "@/Assets/logo.svg";
import { getNavLinks } from "@/Components/Data/navLinks";

const Sidebar = ({ open, setOpen, dynamicPages }: any) => {
  const navLinks = getNavLinks(dynamicPages);

  const pathname = usePathname();
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);

  // Lock body scroll + close on Escape while the drawer is open
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  return (
    <>
      <aside
        inert={!open}
        className={`fixed top-0 left-0 h-full w-[280px] bg-white py-7 px-3 shadow-lg transform transition-transform duration-300 z-50
      ${open ? "translate-x-0" : "-translate-x-full"} `}
      >
        <Link href="/" onClick={() => setOpen(false)}>
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

        {/* Close button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-primary-green cursor-pointer p-1 rounded-lg hover:bg-primary-green/10 transition-colors duration-200"
          >
            <RxCross2 size={22} />
          </button>
        </div>

        <div className="flex flex-col h-full px-3 gap-5 pt-5 overflow-y-auto side-scrollbar">
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
                    aria-expanded={isSubMenuOpen}
                    className={`flex items-center justify-between text-left cursor-pointer text-primary-green transition-colors duration-300 hover:text-primary-green/80 ${
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
                    className={`text-primary-green transition-colors duration-300 hover:text-primary-green/80 ${
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
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
    </>
  );
};

export default Sidebar;
