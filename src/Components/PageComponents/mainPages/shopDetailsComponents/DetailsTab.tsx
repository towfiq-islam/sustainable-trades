"use client";
import Link from "next/link";
import React, { useState } from "react";
import Container from "@/Components/Common/Container";
const tabs = [
  { id: 1, label: "Listings" },
  { id: 2, label: "About" },
  { id: 3, label: "Reviews" },
  { id: 4, label: "Shop_policies" },
];

const DetailsTab = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <Container>
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="inline-flex flex-wrap md:flex-nowrap items-center border border-gray-300 shadow rounded-lg w-full md:w-auto">
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
              className={`flex-1 text-sm md:text-base text-center px-3 md:px-14 py-3 md:py-4 font-semibold
          ${
            activeTab === tab?.id
              ? "bg-off-green text-secondary-black"
              : "text-secondary-gray"
          }
          ${idx === 0 && "rounded-tl-lg rounded-bl-none md:rounded-tr-none"}
          ${idx === tabs.length - 1 && "rounded-r-lg md:rounded-bl-none"}
        `}
            >
              {tab?.label}
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default DetailsTab;
