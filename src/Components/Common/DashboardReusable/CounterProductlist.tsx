import Image from "next/image";
import React, { useState } from "react";
import DetailsImage from "../../../Assets/e1.jpg";

const CounterProductlist = () => {
  const [visibleTrades, setVisibleTrades] = useState(5);
  const trades = [
    {
      title: "8oz Watermelon Sustainable Soap",
      company: "The Soap Shop",
      qty: "20 Bars",
      date: "11/28/23",
      status: "Pending",
      image: DetailsImage,
    },
    {
      title: "Citrus Island Hand Soap",
      company: "Holistic",
      qty: "10 Jars",
      date: "11/28/23",
      status: "Sent",
      image: DetailsImage,
    },
    {
      title: "Organic Herbal Bath",
      company: "BodyTech",
      qty: "4 Baskets",
      date: "11/28/23",
      status: "Pending",
      image: DetailsImage,
    },
    {
      title: "Organic Musk Bath",
      company: "BodyTech",
      qty: "4 Baskets",
      date: "11/28/23",
      status: "Pending",
      image: DetailsImage,
    },
    {
      title: "Organic Honey Bar Soap",
      company: "BodyTech",
      qty: "4 Baskets",
      date: "11/28/23",
      status: "Pending",
      image: DetailsImage,
    },
  ];
  const handleSeeMore = () => {
    setVisibleTrades(prev => Math.min(prev + 5, trades.length));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-accent-red text-[#fff]";
      case "Sent":
        return "bg-primary-green text-[#fff]";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[16px] text-accent-gray">
            Showing {visibleTrades} of {trades.length}
          </p>
          {visibleTrades < trades.length && (
            <button
              onClick={handleSeeMore}
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              See More
            </button>
          )}
        </div>

        <div className="space-y-4">
          {trades.slice(0, visibleTrades).map((trade, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start border-b border-[#BFBEBE] pb-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Image
                  src={trade.image}
                  alt={trade.title}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h5 className="text-[#000] font-semibold underline mb-1 text-[14px] sm:text-[16px]">
                    {trade.title}
                  </h5>
                  <p className="text-[12px] sm:text-[14px] font-normal text-secondary-black">
                    {trade.company}
                  </p>
                  <p className="text-[12px] sm:text-[14px] font-normal text-secondary-black">
                    Qty: {trade.qty}
                  </p>
                  <p className="text-[12px] sm:text-[14px] font-normal text-[#828282]">
                    # 379
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end sm:gap-2 min-w-[80px]">
                <span
                  className={`px-3 py-1 rounded-full text-[14px] md:text-lg font-medium w-full text-center ${getStatusColor(
                    trade.status,
                  )}`}
                >
                  {trade.status}
                </span>
                <p className="text-[14px] font-normal text-secondary-gray">
                  Offer Date:
                </p>
                <p className="text-[14px] font-normal text-secondary-gray">
                  {trade.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CounterProductlist;
