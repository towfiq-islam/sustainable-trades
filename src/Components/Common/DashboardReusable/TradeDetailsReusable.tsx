"use client";
import Image from "next/image";
import React, { useState } from "react";
import DetailsImage from "../../../Assets/e1.jpg";
import { useParams, useRouter } from "next/navigation";
import TradeDetaillsBottom from "./TradeDetaillsBottom";
import { FaAngleDown, FaRegStar } from "react-icons/fa6";
import { LocationSvg1, Reload } from "@/Components/Svg/SvgContainer";
import { useSingleTradeOffer } from "@/Hooks/api/dashboard_api";
import moment from "moment";
import { getShopDetails } from "@/Hooks/api/cms_api";

const TradeDetailsReusable = () => {
  const params = useParams();
  const router = useRouter();
  const tradeId = params?.id;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const actionButtons = ["Approve", "Counter", "Deny"];
  const actionButtonStyles: Record<
    string,
    { bg?: string; border?: string; text: string }
  > = {
    Approve: {
      bg: "bg-[#274F45]",
      text: "text-white",
      border: "#274F45",
    },
    Deny: { border: "border-[#8B200C]", text: "text-[#8B200C]" },
    Counter: {
      bg: "bg-[#E48872]",
      text: "text-black",
      border: "border-[#E48872]",
    },
    Message: { border: "border-gray-200", text: "text-black" },
    "Write A review": {
      bg: "#5B867B",
      text: "text-black",
    },
  };

  const { data: tradeSingleData, isLoading: tradeLoading } =
    useSingleTradeOffer(tradeId);

  const senderUserId = tradeSingleData?.data?.sender?.shop_info?.user_id;

  console.log(senderUserId);

  const { data: tradeSenderShopData, isLoading: shopLoading } =
    getShopDetails(senderUserId);

  const tradeSenderProduct = tradeSingleData?.data?.items?.find(
    (item: any) => item?.product?.shop?.user_id === +senderUserId
  );
 
  console.log(tradeSenderProduct);

  if (tradeLoading || shopLoading) {
    return <div className="p-10 text-center">Loading Trade Details...</div>;
  }

  if (!tradeSingleData) {
    return <div className="p-10 text-center">No trade found.</div>;
  }

  return (
    <div>
      <div className="flex gap-x-5 items-center mt-6">
        <h3 className="text-[16px] text-[#274F45] font-semibold">
          Trade Details
        </h3>
        <h4 className="text-[16px] text-[#A7A39C] font-semibold">
          {" "}
          {moment(tradeSingleData?.data?.created_at).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}
        </h4>
        <h5 className="text-[16px] text-[#A7A39C] font-semibold">
          Inquiry <span># {tradeSingleData?.data?.inquiry}</span>
        </h5>
      </div>
      <div className="flex justify-between my-10">
        <div className="flex gap-x-4">
          <Image
            src={DetailsImage}
            alt="DetailsImage"
            height={100}
            width={100}
            className="h-[100px] w-[100px] rounded-lg"
          />
          <div className="flex flex-col gap-y-1">
            <h3 className="text-[20px] font-semibold text-[#13141D]">
              {tradeSenderProduct?.product?.product_name}
            </h3>
            <h4 className="text-[20px] font-normal text-[#4B4A47] flex gap-x-5 items-center">
              {tradeSenderProduct?.product?.shop?.shop_name}
              <span className="text-[14px] underline cursor-pointer text-[#A7A39C] font-lato">
                View Shop
              </span>
            </h4>
            <div className="flex gap-x-[2px]">
              <FaRegStar className="fill-green-950" />
              <FaRegStar className="fill-green-950" />
              <FaRegStar className="fill-green-950" />
              <FaRegStar className="fill-green-950" />
              <FaRegStar className="fill-green-950" />
            </div>
            <div className="flex gap-x-2 items-center">
              <LocationSvg1 />
              <h5 className="text-[14px] underline cursor-pointer text-[#A7A39C] font-lato">
                13 mi. away -
              </h5>
              <h5 className="text-[14px] underline cursor-pointer text-[#A7A39C] font-lato">
                Denver, CO
              </h5>
            </div>
            <ul className="flex flex-col gap-y-2">
              <li className="flex gap-x-2 te4xt-[16px] font-normal text-[#4B4A47] items-center">
                Qty: <span className="font-bold">3 Bars </span>
              </li>
              <li className="flex gap-x-2 te4xt-[16px] font-normal text-[#4B4A47] items-center">
                Item Price: <span className="font-bold">$10</span>
              </li>
              <li className="flex gap-x-2 te4xt-[16px] font-normal text-[#4B4A47] items-center">
                Total amount: <span className="font-bold">$30 </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-[20px] font-semibold text-[#274F45]">
            {tradeSenderShopData?.data?.first_name}{" "}
            {tradeSenderShopData?.data?.last_name}
          </h4>

          <div className="flex gap-x-2 mt-4 items-center">
            <h4 className="text-[14px] font-bold text-[#000] underline">
              {tradeSenderShopData?.data?.shop_info?.shop_name}
            </h4>
            {Array.from({
              length: 6 - +tradeSenderShopData?.data?.rating_avg,
            }).map((_, index) => (
              <FaRegStar
                key={index}
                className="text-primary-green text-xs md:text-sm"
              />
            ))}
          </div>
          <div className="flex gap-x-2 items-center mt-1">
            <LocationSvg1 />
            <h5 className="text-[14px] underline cursor-pointer text-[#000] font-lato">
              {tradeSenderShopData?.data?.shop_info?.address?.display_my_address
                ? tradeSenderShopData?.data?.shop_info?.address?.address_line_1
                : `${tradeSenderShopData?.data?.shop_info?.address?.city}, ${tradeSenderShopData?.data?.shop_info?.address?.state}`}
            </h5>
          </div>
          <div className="flex flex-col">
            <h4 className="text-[16px] text-[#274F45] font-semibold">
              Shop description
            </h4>
            <p className="text-[14px] max-w-[400px]">
              {tradeSenderShopData?.data?.shop_info?.about?.our_story}
            </p>
          </div>
          <div className="">
            {/* faq */}
            {tradeSenderShopData?.data?.shop_info?.faqs?.map(
              (faq: any, index: number) => {
                const isOpen = openIndex === index;

                return (
                  <div key={index}>
                    <div
                      className="flex justify-between py-4 cursor-pointer items-center"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      <h5 className="text-[15px] font-normal text-[#274F45]">
                        {faq?.question}
                      </h5>

                      <FaAngleDown
                        className={`transform transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>

                    <div
                      className={`overflow-hidden transition-[max-height] max-w-[500px] duration-500 ease-in-out ${
                        isOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <p className="pb-4">{faq?.answer}</p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-x-5 items-center mt-16">
        <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
        <div className="inline-block">
          <Reload
            className={`cursor-pointer transform transition-transform hover:rotate-180 duration-500 ease-in-out`}
          />
        </div>
        <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
      </div>
      <div className="mt-14 py-6 border-b border-[#BFBEBE]">
        <div className="flex gap-x-4">
          <Image
            src={DetailsImage}
            alt="DetailsImage"
            height={100}
            width={100}
            className="h-[100px] w-[100px] rounded-lg"
          />
          <div className="flex flex-col gap-y-1">
            <h3 className="text-[20px] font-semibold text-[#13141D]">
              8oz Watermelon Sustainable Bar Soap
            </h3>
            <h4 className="text-[20px] font-normal text-[#4B4A47] flex gap-x-5 items-center">
              The Soap Shop
              <span className="text-[14px] underline cursor-pointer text-[#A7A39C] font-lato">
                View Shop
              </span>
            </h4>
            <div className="flex gap-x-[2px]">
              <FaRegStar className="fill-green-950" />
              <FaRegStar className="fill-green-950" />
              <FaRegStar className="fill-green-950" />
              <FaRegStar className="fill-green-950" />
              <FaRegStar className="fill-green-950" />
            </div>
            <div className="flex gap-x-2 items-center">
              <LocationSvg1 />
              <h5 className="text-[14px] underline cursor-pointer text-[#A7A39C] font-lato">
                13 mi. away -
              </h5>
              <h5 className="text-[14px] underline cursor-pointer text-[#A7A39C] font-lato">
                Denver, CO
              </h5>
            </div>
            <ul className="flex flex-col gap-y-2">
              <li className="flex gap-x-2 te4xt-[16px] font-normal text-[#4B4A47] items-center">
                Qty: <span className="font-bold">3 Bars </span>
              </li>
              <li className="flex gap-x-2 te4xt-[16px] font-normal text-[#4B4A47] items-center">
                Item Price: <span className="font-bold">$10</span>
              </li>
              <li className="flex gap-x-2 te4xt-[16px] font-normal text-[#4B4A47] items-center">
                Total amount: <span className="font-bold">$30 </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex gap-x-5 flex-wrap mt-6">
        {actionButtons.map((btn, i) => {
          const style = actionButtonStyles[btn] || {
            text: "text-black",
          };

          return (
            <button
              key={i}
              onClick={() => {
                if (btn === "Counter") {
                  router.push(`/dashboard/pro/trades/counter/${tradeId}`);
                } else if (btn === "Approve") {
                  router.push(`/dashboard/pro/trades/approve/${tradeId}`);
                } else if (btn === "Deny") {
                  router.push(`/dashboard/pro/trades/deny/${tradeId}`);
                } else {
                  console.log(`${btn} clicked for trade ${tradeId}`);
                }
              }}
              className={`relative cursor-pointer py-[10px] border px-4 rounded-md font-lato font-semibold overflow-hidden
        hover:scale-110 duration-500 ease-in-out
        ${style.bg || ""} ${
                style.border
                  ? `border-2 ${style.border}`
                  : "border-2 border-gray-300"
              } ${style.text}
       `}
            >
              <span className="relative z-10">{btn}</span>
            </button>
          );
        })}
      </div>
      <div className="my-20">
        <TradeDetaillsBottom />
      </div>
    </div>
  );
};

export default TradeDetailsReusable;
