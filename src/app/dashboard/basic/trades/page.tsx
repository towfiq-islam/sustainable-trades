"use client";
import TradeLayout from "@/app/dashboard/pro/trades/TradeLayout";
import SentTrades from "@/Components/Common/DashboardReusable/SentTrades";
import PendingTrades from "@/Components/Common/DashboardReusable/PendingTrades";
import PreviousTrades from "@/Components/Common/DashboardReusable/PreviousTrades";
import CanceledTrades from "@/Components/Common/DashboardReusable/CanceledTrades";
import { useTradeCounts, useTradesdata } from "@/Hooks/api/dashboard_api";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import { tips } from "@/Components/Data/data";
import { useState } from "react";
type TradeLayoutProps = {
  children: React.ReactNode[];
  initialTab: "Pending" | "Sent" | "Approved" | "Canceled";
};

const Page = () => {
  const { data } = useTradeCounts();
  const { data: tradeData } = useTradesdata("");

  const [activeTab, setActiveTab] = useState("Pending");

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // // map tab label to child index
  // const tabIndexMap: Record<typeof initialTab, number> = {
  //   Pending: 0,
  //   Sent: 1,
  //   Approved: 2,
  //   Canceled: 3,
  // };
  const tradetabs = [
    {
      id: 1,
      label: "Pending",
      count: data?.data?.pending_count,
    },
    {
      id: 2,
      label: "Sent",
      count: data?.data?.sent_count,
    },
    {
      id: 3,
      label: "Approved",
      count: data?.data?.accepted_count,
    },
    {
      id: 4,
      label: "Canceled",
      count: data?.data?.cancelled_count,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2.5 md:flex-nowrap justify-between items-center">
        <h3 className="text-[30px] md:text-[40px] font-semibold text-[#000]">
          Trades
        </h3>
        <div className="relative w-full md:w-fit">
          <input
            placeholder="Search..."
            type="search"
            className="py-[10px] pl-4 outline-0 border border-[#BFBEBE] rounded-[8px] text-[16px] text-[#67645F] font-normal w-full  md:w-[500px]"
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
              onClick={() => setActiveTab(tab.label)}
              className={`flex gap-1.5 md:gap-x-3 items-center text-[14px] sm:text-[16px] cursor-pointer pb-5  lg:px-15 xl:px-20 justify-center
                ${
                  activeTab === tab.label
                    ? "font-semibold text-[#000] relative after:content-[''] after:block after:absolute after:bottom-0 after:left-0 after:w-full after:h-[8px] after:bg-[#274F45] after:rounded-lg"
                    : "text-[#13141D]"
                }`}
            >
              {tab.label}
              <span
                className={`border rounded-[8px] px-1 py-0.5 sm:px-2 sm:py-[2px] text-[10px] sm:text-sm border-[#000]
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

      {activeTab === "Pending" && (
        <PendingTrades pendingTradeData={tradeData?.data} />
      )}

      {activeTab === "Sent" && <SentTrades />}

      {activeTab === "Approved" && (
        <PreviousTrades approveTradeData={tradeData?.data} />
      )}

      {activeTab === "Canceled" && (
        <CanceledTrades canceledTradeData={tradeData?.data} />
      )}

      {/* <div className="w-2/5 mt-10 border border-gray-300 rounded-lg p-6 ml-5">
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
      </div> */}
    </div>
  );
};

export default Page;
