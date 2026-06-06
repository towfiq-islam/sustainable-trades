import React from "react";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { FaAngleDown } from "react-icons/fa";
import Activity from "../../../Assets/activity.png";

const ProDashboardMessage = () => {
  return (
    <div className="flex flex-col gap-[32px] md:flex-row justify-between">
      <div className="border border-accent-gray rounded-[8px] w-full md:w-3/5">
        <div className="flex justify-between p-4">
          <h5 className="text-[16px] text-[#000] font-semibold text-center">
            Messages
          </h5>
          <div className="relative">
            <select
              name=""
              id=""
              className="border border-accent-gray rounded-[8px] cursor-pointer appearance-none outline-0 px-2 w-[90px]"
            >
              <option value="">All</option>
            </select>
            <FaAngleDown className="absolute top-1 right-3" />
          </div>
        </div>
        <div className="border-t border-b border-accent-gray py-4">
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-x-[30px] px-4 sm:items-center">
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
                Re: Order#123456
              </h5>
              <p className="text-[14px] text-[#67645F] font-normal">
                {" "}
                Rebecca Bennett: So glad that we agreed on ....
              </p>
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-x-[30px] px-4 sm:items-center">
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
                Re: Order#123456
              </h5>
              <p className="text-[14px] text-[#67645F] font-normal">
                {" "}
                Rebecca Bennett: So glad that we agreed on ....
              </p>
            </div>
          </div>
        </div>
        <div className="py-4 border-t border-accent-gray">
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-x-[30px] px-4 sm:items-center">
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
                Re: Order#123456
              </h5>
              <p className="text-[14px] text-[#67645F] font-normal">
                {" "}
                Rebecca Bennett: So glad that we agreed on ....
              </p>
            </div>
          </div>
        </div>
        <div className="py-4 border-t border-accent-gray">
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-x-[30px] px-4 sm:items-center">
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
                Re: Order#123456
              </h5>
              <p className="text-[14px] text-[#67645F] font-normal">
                {" "}
                Rebecca Bennett: So glad that we agreed on ....
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-green px-4 py-5 rounded-[10px] h-fit w-full md:w-1/3">
        <div className="flex justify-between">
          <h5 className="text-[14px] text-white font-semibold">Need Help?</h5>
          <RxCross1 className="text-[14px] text-white font-bold cursor-pointer" />
        </div>
        <p className="py-4 text-[14px] text-white">
          Read articles or reach out to a Sustainable Trade’s member for help.
        </p>
        <h6 className="text-[14px] text-white font-semibold underline cursor-pointer">
          FAQs
        </h6>
      </div>
    </div>
  );
};

export default ProDashboardMessage;
