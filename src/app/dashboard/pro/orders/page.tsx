import ProordersTabs from "@/Components/Common/DashboardReusable/PrordersTabs";

const page = () => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3.5 lg:gap-0">
        <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000]">
          Orders
        </h2>

        {/* <div className="flex flex-wrap gap-2.5  md:gap-x-4 items-center">
          <button
            className="px-6 w-full md:w-fit rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer
                      duration-300 ease-in-out flex gap-x-2 items-center h-[50px] hover:translate-y-1"
          >
            <Download />
            Download File
          </button>
          <div className="relative w-full md:w-fit">
            <input
              placeholder="Search Orders"
              type="search"
              className="w-full lg:w-[300px] py-[10px] pl-4 pr-12 outline-0 border border-[#BFBEBE] rounded-[8px] text-[16px] text-[#67645F] font-normal"
            />

            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[1px] h-[60%] bg-[#BFBEBE]" />

            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
              <FaSearch />
            </div>
          </div>
          <div className="relative w-full md:w-fit">
            <select className="border border-[#A7A39C] rounded-[8px] cursor-pointer appearance-none outline-0 px-3 pr-10 py-[10px] w-full md:w-[190px] text-[#274F45] text-[14px] font-normal">
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 6 Month">Last 6 Month</option>
              <option value="Last Year">Last Year</option>
            </select>

            <FaAngleDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 pointer-events-none" />
          </div>
        </div> */}
      </div>

      <div className="pt-9 pb-12">
        <ProordersTabs />
      </div>
    </>
  );
};

export default page;
