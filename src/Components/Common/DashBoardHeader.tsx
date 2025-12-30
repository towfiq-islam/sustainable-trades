import React from "react";
import { FaSearch } from "react-icons/fa";

type dashboardheaderprops = {
  placeholder?: string;
  heading: string;
};

const DashBoardHeader: React.FC<dashboardheaderprops> = ({
  heading,
  placeholder,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between lg:items-center">
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold mb-2 md:mb-0 text-[#000]">
        {heading}
      </h2>
      {/* <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
          <div className="relative w-full">
            <input
              placeholder={"Search..."}
              type="search"
              className="py-[5px] md:py-[10px] pl-4 outline-0 border border-[#274F45] rounded-[8px] text-[16px] text-[#67645F] font-normal w-full  lg:w-[400px]"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-3">
              <FaSearch />
            </div>
            <div className="absolute top-0 right-10 w-[2px] bg-[#274F45] h-[35px] md:h-[45px]"></div>
          </div>
          <button className="cursor-pointer bg-[#D4E2CB] py-2 md:py-3 px-4 rounded-[100px] text-[#274F45] w-full text-[13px] md:text-base lg:w-fit text-nowrap font-lato font-semibold hover:scale-104 duration-500 ease-in-out">
            Continue Shopping
          </button>
        </div> */}
    </div>
  );
};

export default DashBoardHeader;
