"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaAngleDown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

type SubMenu = {
  label: string;
  path: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
};

type NavLinsProps = {
  id: number;
  label: string;
  path: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  subMenus?: SubMenu[];
};

type SidebarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dashboardNavLinks: NavLinsProps[];
};

const DashboardSidebar = ({
  open,
  setOpen,
  dashboardNavLinks,
}: SidebarProps) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<number[]>([]);

  const toggleMenu = (id: number) => {
    setOpenMenus(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id],
    );
  };

  const parentLinkClass = (isActive: boolean) =>
    `w-full text-left ml-1 px-2.5 py-2 lg:py-2.5 flex gap-3 items-center text-sm xl:text-base font-semibold border-l-2 hover:bg-gray-100/80 rounded-r-lg duration-200 transition-all ${
      isActive
        ? "text-primary-green border-primary-green bg-primary-green/5"
        : "text-light-green border-transparent"
    }`;

  return (
    <aside
      className={`${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } fixed top-0 left-0 z-[999] lg:static h-screen lg:h-[calc(100vh-80px)] w-60 xl:w-68 2xl:w-72 duration-300 transition-transform border-r border-light-gray bg-dashboard-bg py-4 px-3.5 shrink-0 overflow-y-auto side-scrollbar shadow-2xl lg:shadow-none flex flex-col`}
    >
      {/* Mobile Drawer Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-light-gray lg:hidden">
        <span className="text-base font-semibold text-secondary-black">
          Dashboard Menu
        </span>
        <button
          onClick={() => setOpen(false)}
          className="size-8 rounded-lg grid place-items-center text-secondary-gray hover:bg-gray-100 hover:text-secondary-black text-xl"
          aria-label="Close menu"
        >
          <IoClose />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2">
        {dashboardNavLinks?.map(item => {
          const isActiveParent = pathname === item.path;
          const isActiveSub = item.subMenus?.some(m => pathname === m.path);
          const isOpen = openMenus.includes(item.id);
          const isActive = isActiveParent || !!isActiveSub;
          const hasSubMenus = !!item?.subMenus;

          return (
            <div key={item.id}>
              {/* Main Menu */}
              {hasSubMenus ? (
                <button
                  type="button"
                  onClick={() => toggleMenu(item.id)}
                  aria-expanded={isOpen}
                  className={parentLinkClass(isActive)}
                >
                  {item?.icon}
                  <span className="flex-1">{item.label}</span>
                  <span
                    className={`text-sm transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <FaAngleDown />
                  </span>
                </button>
              ) : (
                <Link
                  href={item?.path}
                  onClick={() => setOpen(false)}
                  className={parentLinkClass(isActive)}
                >
                  {item?.icon}
                  <span className="flex-1">{item.label}</span>
                </Link>
              )}

              {/* SubMenus */}
              <div
                className={`ml-5 grid transition-all duration-300 ease-out ${
                  hasSubMenus && isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-2"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-2">
                    {item?.subMenus?.map((menu, idx) => {
                      const isActiveMenu = pathname === menu.path;
                      return (
                        <Link
                          key={idx}
                          href={menu.path}
                          onClick={() => setOpen(false)}
                          className={`px-2 py-[3px] 2xl:py-1 flex gap-2 items-center text-sm font-medium border-l-2 hover:bg-gray-100 duration-300 transition-all hover:scale-[1.03] ${
                            isActiveMenu
                              ? "text-primary-green border-primary-green"
                              : "text-light-green border-transparent"
                          }`}
                        >
                          {menu?.icon && <span>{menu.icon}</span>}
                          {menu.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
