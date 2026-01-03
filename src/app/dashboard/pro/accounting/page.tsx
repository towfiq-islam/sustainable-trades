import AccountTable from "@/Components/Common/DashboardReusable/AccountTable";
import { FaAngleRight } from "react-icons/fa";

const page = () => {
  return (
    <>
      <div className="flex flex-wrap w-full justify-between">
        <h3 className="text-[30px] lg:text-[36px] font-semibold text-[#000] flex items-center gap-x-2">
          Accounting <FaAngleRight className="mt-2" /> Sales
        </h3>
        {/* <div className="flex flex-wrap gap-3 md:gap-6 items-center w-full md:w-fit ">
          <button
            className="w-full md:w-fit px-6 rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer
            duration-300 ease-in-out flex gap-x-2 items-center h-[50px] justify-center hover:translate-y-1"
          >
            <Download />
            Download File
          </button>
          <button className="w-full  px-6 bg-[#D4E2CB] rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer hover:translate-y-1 duration-300 ease-in-out md:w-[170px] h-[50px] flex items-center justify-center">
            Change
          </button>
        </div> */}
      </div>

      <div className="mt-10">
        <AccountTable title="Sales" />
      </div>

      {/* <div className="mt-10">
        <AccountTable title="Barters and Trades" />
      </div> */}
    </>
  );
};

export default page;
