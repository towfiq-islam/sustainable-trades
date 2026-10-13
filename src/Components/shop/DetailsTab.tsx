"use client";
import Link from "next/link";
import { useState } from "react";
import Container from "@/Components/Common/Container";
const tabs = [
  { id: 1, label: "Listings", name: "Listings" },
  { id: 2, label: "About", name: "About" },
  { id: 3, label: "Reviews", name: "Reviews" },
  { id: 4, label: "Shop_policies", name: "Shop Policies" },
];

const DetailsTab = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <Container>
      <div className="mt-6 sm:mt-8 flex justify-start items-center w-full">
        <div className="flex items-center overflow-x-auto no-scrollbar border border-gray-200 shadow-sm rounded-xl w-full md:w-auto bg-white divide-x divide-gray-200">
          {tabs?.map((tab, idx) => (
            <Link
              key={tab?.id}
              href={`#${tab?.label}`}
              onClick={e => {
                e.preventDefault();
                setActiveTab(tab?.id);

                const section = document.getElementById(tab?.label);
                if (section) {
                  const offset = 180;
                  const y =
                    section.getBoundingClientRect().top +
                    window.scrollY -
                    offset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className={`flex-1 whitespace-nowrap text-xs sm:text-sm md:text-base text-center px-2.5 sm:px-6 md:px-12 py-2.5 sm:py-3.5 md:py-4 font-semibold transition-colors duration-200
          ${
            activeTab === tab?.id
              ? "bg-off-green text-secondary-black"
              : "text-secondary-gray hover:text-secondary-black hover:bg-gray-50"
          }
          ${idx === 0 ? "rounded-l-xl" : ""}
          ${idx === tabs.length - 1 ? "rounded-r-xl" : ""}
        `}
            >
              {tab?.name}
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default DetailsTab;
