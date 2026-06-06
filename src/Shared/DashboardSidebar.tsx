"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

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

  const navLabelClass = "text-secondary-black font-semibold text-lg mb-4";

  return (
    <aside
      className={`${
        open ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
      } fixed top-0 left-0 z-[999] xl:static h-screen xl:h-[calc(100vh-80px)] w-72 duration-500 transition-transform border-r border-[#E4E4E4] bg-[#FFFCF9] py-5 px-4 shrink-0 overflow-y-auto side-scrollbar`}
    >
      {/* Nav Links */}
      <nav className="flex flex-col gap-5">
        {dashboardNavLinks?.map(item => {
          const isActiveParent = pathname === item.path;
          const isActiveSub = item.subMenus?.some(m => pathname === m.path);
          const isOpen = openMenus.includes(item.id);
          const isMessageActive =
            (item?.id === 28 || item?.id === 13 || item?.id === 23) &&
            (pathname?.startsWith(`/dashboard/customer/messages`) ||
              pathname?.startsWith(`/dashboard/basic/messages`) ||
              pathname?.startsWith(`/dashboard/pro/messages`));

          return (
            <div key={item.id}>
              {/* Group Labels */}
              {(item?.id === 1 || item?.id === 16 || item?.id === 25) && (
                <p className={navLabelClass}>Menu</p>
              )}
              {(item?.id === 12 || item?.id === 23) && (
                <p className={navLabelClass}>Customer Notifications</p>
              )}
              {item?.id === 14 && (
                <p className={navLabelClass}>Selling Tools</p>
              )}

              {/* Main Menu */}
              <Link
                href={item?.path}
                onClick={() =>
                  item.subMenus ? toggleMenu(item.id) : setOpen(false)
                }
                className={`w-full text-left ml-1 px-2 py-2 flex gap-3 items-center font-semibold border-l-2 hover:bg-gray-100 duration-300 transition-all hover:scale-[1.03] ${
                  isActiveParent || isActiveSub || isMessageActive
                    ? "text-primary-green border-primary-green"
                    : "text-light-green border-transparent"
                }`}
              >
                {item?.icon}
                {item.label}
              </Link>

              {/* SubMenus */}
              {item?.subMenus && isOpen && (
                <div className="ml-5 mt-2 flex flex-col gap-2">
                  {item.subMenus.map((menu, idx) => {
                    const isActiveMenu = pathname === menu.path;
                    return (
                      <Link
                        key={idx}
                        href={menu.path}
                        onClick={() => setOpen(false)}
                        className={`px-2 py-1 flex gap-2 items-center text-sm font-medium border-l-2 hover:bg-gray-100 duration-300 transition-all hover:scale-[1.03] ${
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
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
