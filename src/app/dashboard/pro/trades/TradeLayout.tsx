"use client";
import React, { ReactNode, useState } from "react";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import { tips, tradetabs } from "@/Components/Data/data";

type TradeLayoutProps = {
  children: React.ReactNode[];
  initialTab: "Pending" | "Sent" | "Approved" | "Canceled";
};

const TradeLayout = ({ children, initialTab }: TradeLayoutProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // map tab label to child index
  const tabIndexMap: Record<typeof initialTab, number> = {
    Pending: 0,
    Sent: 1,
    Approved: 2,
    Canceled: 3,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[40px] font-semibold text-[#000]">Trades</h3>
        <div className="relative">
          <input
            placeholder="Search..."
            type="search"
            className="py-[10px] pl-4 outline-0 border border-[#BFBEBE] rounded-[8px] text-[16px] text-[#67645F] font-normal w-[500px]"
          />
          <div className="absolute top-4 right-3">
            <FaSearch />
          </div>
          <div className="absolute top-0 right-10 w-[2px] bg-[#BFBEBE] h-[45px]"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <ul className="flex justify-between relative after:content-[''] after:block after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:p-[3px] after:border after:border-[#A7A39C] after:rounded-lg">
          {tradetabs.map((tab) => (
            <li
              key={tab.label}
              onClick={() => setActiveTab(tab.label as typeof initialTab)}
              className={`flex gap-x-3 items-center text-[16px] cursor-pointer pb-5 px-20 justify-center
                ${
                  activeTab === tab.label
                    ? "font-semibold text-[#000] relative after:content-[''] after:block after:absolute after:bottom-0 after:left-0 after:w-full after:h-[8px] after:bg-[#274F45] after:rounded-lg"
                    : "text-[#13141D]"
                }`}
            >
              {tab.label}
              <span
                className={`border rounded-[8px] px-2 py-[2px] text-sm border-[#000]
                  ${
                    activeTab === tab.label
                      ? " bg-[#D4E2CB] text-[#6D2D4E2CB8D9]"
                      : "text-[#13141D]"
                  }`}
              >
                {tab.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Render only the active child */}
      {/* <div>{children[tabIndexMap[activeTab]]}</div> */}
      <div className="w-2/5 mt-10 border border-gray-300 rounded-lg p-6 ml-5">
        <h3 className="text-[#13141D] text-[16px] font-semibold">
          Tips for Trading
        </h3>

        <div className="mt-4 space-y-2">
          {tips.map((tip, index) => (
            <div key={index} className="border-b border-gray-400">
              <div
                className="flex justify-between items-center cursor-pointer py-2"
                onClick={() => toggle(index)}
              >
                <h4 className="text-[#13141D] text-[14px] font-normal">
                  {tip.question}
                </h4>
                <FaAngleDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
                style={{
                  maxHeight: openIndex === index ? "200px" : "0px",
                }}
              >
                <p className="mt-2 text-[#4B4A47] text-[14px]">{tip.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeLayout;
