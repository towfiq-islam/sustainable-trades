"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import Activity from "../../../Assets/activity.png";
import Inventory from "../../../Assets/inventory.png";
import ProDashboardMessage from "./ProDashboardMessage";
import ProdashboardStatistics from "./ProdashboardStatistics";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const DashboardReusable = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="pb-9  flex flex-col  md:flex-row justify-between md:items-center gap-[32px] md:gap-0">
        <div className="text-[20px] md:text-[24px] flex flex-col gap-y-2">
          <h3 className=" font-semibold text-[#13141D] tracking-[2.4px]">
            Hi {user?.first_name},
          </h3>
          <h3 className=" font-semibold text-[#13141D] tracking-[2.4px]">
            Here’s your store: {user?.shop_info?.shop_name}
          </h3>
        </div>

        <Link
          href={`/shop-details?view=${"owner"}&id=${
            user?.shop_info?.user_id
          }&listing_id=${user?.shop_info?.id}`}
          className="px-[20px] lg:px-[58px] py-2 md:py-4 rounded-[8px] bg-[#E48872] text-[14px] md:text-[18px] font-semibold text-[#13141D] cursor-pointer hover:bg-transparent duration-500 ease-in-out border border-[#E48872] text-center"
        >
          Edit Shop
        </Link>
      </div>
      <div className="border border-[#A7A39C] py-3 rounded-[8px]">
        <div className="flex flex-wrap justify-between items-center">
          <div className="px-[40px] md:px-[65px]">
            <p className="text-[16px] text-[#67645F] font-semibold text-center">
              Orders
            </p>
            <h4 className="text-[25px] md:text-[40px] text-[#274F45] font-semibold text-center">
              12
            </h4>
          </div>
          <div className="px-[40px] md:px-[65px]">
            <p className="text-[16px] text-[#67645F] font-semibold text-center">
              Trades
            </p>
            <h4 className="text-[25px] md:text-[40px] text-[#274F45] font-semibold text-center">
              4
            </h4>
          </div>
          <div className="px-[40px] md:px-[65px]">
            <p className="text-[16px] text-[#67645F] font-semibold text-center">
              Revenue
            </p>
            <h4 className="text-[25px] md:text-[40px] text-[#274F45] font-semibold text-center">
              $458.32
            </h4>
          </div>
          <div className="px-[40px] md:px-[65px]">
            <p className="text-[16px] text-[#67645F] font-semibold text-center">
              Visits
            </p>
            <h4 className="text-[25px] md:text-[40px] text-[#274F45] font-semibold text-center">
              32
            </h4>
          </div>
        </div>
      </div>
      <div className="pt-[30px] md:pt-[77px] pb-8">
        <div className="border border-[#A7A39C] rounded-[10px] w-full md:w-fit">
          <div className="p-3">
            <div className="flex justify-between">
              <h5 className="text-[16px] text-[#000] font-semibold text-center">
                Inventory
              </h5>
              <h6 className="text-[16px] text-[#000] font-semibold text-center flex gap-x-1 items-center cursor-pointer">
                More
                <FaAngleRight />
              </h6>
            </div>
            <div className="pt-6 pb-3 flex flex-col md:flex-row gap-x-2 md:items-center">
              <Image
                src={Inventory}
                alt="Inventory"
                height={60}
                width={80}
                className="shrink-0"
              />
              <div className="">
                <div className="flex justify-between shrink-0">
                  <h4 className="text-[14px] text-[#000] font-semibold">
                    Lavender Soap Bars
                  </h4>
                  <h4 className="text-[14px] text-[#274F45] font-semibold">
                    134 items
                  </h4>
                </div>
                <p className="text-[12px] text-[#000] font-normal py-1">
                  Handmade soap bars infused with lavender essential oils...
                </p>
                <h6 className="text-[10px] text-[#000] font-semibold">
                  In Stock
                </h6>
              </div>
            </div>
          </div>
          <div className="border-t border-b border-[#C8C8C8]">
            <div className="p-3 w-full">
              <div className="flex flex-col md:flex-row gap-x-2">
                <Image
                  src={Inventory}
                  alt="Inventory"
                  height={60}
                  width={80}
                  className="shrink-0"
                />
                <div className="w-full">
                  <div className="flex justify-between shrink-0 w-full">
                    <h4 className="text-[14px] text-[#000] font-semibold">
                      LHandmade Cocoa Butter
                    </h4>
                    <h4 className="text-[14px] text-[#274F45] font-semibold">
                      2 items left
                    </h4>
                  </div>

                  <h6 className="text-[10px] text-[#000] font-semibold pt-2 md:pt-10">
                    In Stock
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 w-full">
            <div className="flex flex-col md:flex-row gap-x-2">
              <Image
                src={Inventory}
                alt="Inventory"
                height={60}
                width={80}
                className="shrink-0"
              />
              <div className="w-full">
                <div className="flex justify-between shrink-0 w-full">
                  <h4 className="text-[14px] text-[#000] font-semibold">
                    Cold-pressed Rosemary Oil
                  </h4>
                  <h4 className="text-[14px] text-[#274F45] font-semibold">
                    76 items
                  </h4>
                </div>

                <h6 className="text-[10px] text-[#E48872] font-semibold md:mt-10">
                  Running Low
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-[#A7A39C] rounded-[8px]">
        <div className="flex justify-between p-4">
          <h5 className="text-[16px] text-[#000] font-semibold text-center">
            Recent Activity
          </h5>
          <div className="relative">
            <select
              name=""
              id=""
              className="border border-[#A7A39C] rounded-[8px] cursor-pointer appearance-none outline-0 px-2 w-[90px]"
            >
              <option value="">All</option>
            </select>
            <FaAngleDown className="absolute top-1 right-3" />
          </div>
        </div>
        <div className="border-t border-b border-[#A7A39C] py-4">
          <div className="flex flex-col sm:flex-row justify-between px-4 sm:items-center gap-3.5 sm:gap-0">
            <div className="flex gap-x-2 items-center">
              <Image src={Activity} alt="Activity" width={40} height={40} />
              <div className="">
                <h5 className="text-[14px] text-[#000] font-semibold">You</h5>
                <p className="text-[14px] text-[#67645F] font-normal">
                  Sent 2 hours ago{" "}
                </p>
              </div>
            </div>
            <div className="">
              <h5 className="text-[14px] text-[#000] font-semibold">
                Trade: You began a trade with Rebecca Bennett
              </h5>
              <p className="text-[14px] text-[#67645F] font-normal">
                {" "}
                Rebecca Bennett: So glad that we agreed on ....
              </p>
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="flex  flex-col sm:flex-row justify-between px-4 sm:items-center gap-3.5 sm:gap-0">
            <div className="flex gap-x-2 items-center">
              <Image src={Activity} alt="Activity" width={40} height={40} />
              <div className="">
                <h5 className="text-[14px] text-[#000] font-semibold">
                  Taylor Lesnicki
                </h5>
                <p className="text-[14px] text-[#67645F] font-normal">
                  Sent 3 hours ago
                </p>
              </div>
            </div>
            <div className="">
              <h5 className="text-[14px] text-[#000] font-semibold">
                Trade: You began a trade with Rebecca Bennett
              </h5>
              <p className="text-[14px] text-[#67645F] font-normal">
                {" "}
                Rebecca Bennett: So glad that we agreed on ....
              </p>
            </div>
          </div>
        </div>
        <div className="py-4 border-t border-[#A7A39C]">
          <div className="flex  flex-col sm:flex-row justify-between px-4 sm:items-center gap-3.5 sm:gap-0">
            <div className="flex gap-x-2 items-center">
              <Image src={Activity} alt="Activity" width={40} height={40} />
              <div className="">
                <h5 className="text-[14px] text-[#000] font-semibold">
                  Audrey Leitner
                </h5>
                <p className="text-[14px] text-[#67645F] font-normal">
                  Sent 2 hours ago{" "}
                </p>
              </div>
            </div>
            <div className="">
              <h5 className="text-[14px] text-[#000] font-semibold">
                Trade: You began a trade with Rebecca Bennett
              </h5>
              <p className="text-[14px] text-[#67645F] font-normal">
                {" "}
                Rebecca Bennett: So glad that we agreed on ....
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-8 pb-8 lg:pb-16">
        <ProDashboardMessage />
      </div>
      <div className="">
        <ProdashboardStatistics />
      </div>
    </>
  );
};

export default DashboardReusable;
