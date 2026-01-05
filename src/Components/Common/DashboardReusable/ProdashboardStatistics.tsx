import {
  getListingData,
  getOrderData,
  getTradesData,
  getVisitorData,
} from "@/Hooks/api/dashboard_api";
import { FaAngleRight } from "react-icons/fa";

const ProdashboardStatistics = () => {
  const { data: listingData, isLoading: listingLoading } = getListingData();
  const { data: tradeData, isLoading: tradeLoading } = getTradesData();
  const { data: orderData, isLoading: orderLoading } = getOrderData();
  const { data: visitorData, isLoading: visitorLoading } = getVisitorData();

  return (
    <div className="border border-[#A7A39C] rounded-[8px] pt-5 px-6">
      <h3 className="text-[#13141D] text-[16px] font-semibold">
        Order/Store Statistics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-x-20 lg:gap-y-12 pt-4 lg:pt-8 pb-8 lg:pb-24 lg:px-20">
        <div className="border border-[#A7A39C] p-4 rounded-[8px]">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
              <h5 className="text-[16px] text-[#000] font-semibold text-center">
                Listings
              </h5>
              <h6 className="text-[16px] text-[#000] font-semibold text-center flex gap-x-1 items-center cursor-pointer">
                More
                <FaAngleRight />
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Active
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {listingData?.data?.active_listings}
              </h6>
            </div>
            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Expired
              </h5>

              <h6 className="text-[14px] text-[#000] font-semibold">
                {listingData?.data?.inactive_listings}
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Sold out
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {listingData?.data?.sold_out_listings}
              </h6>
            </div>
          </div>
        </div>

        <div className="border border-[#A7A39C] p-4 rounded-[8px]">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
              <h5 className="text-[16px] text-[#000] font-semibold text-center">
                Orders
              </h5>
              <h6 className="text-[16px] text-[#000] font-semibold text-center flex gap-x-1 items-center cursor-pointer">
                More
                <FaAngleRight />
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                New
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {orderData?.data?.new_orders}
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Shipped
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {orderData?.data?.shipped_orders}
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Completed
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {orderData?.data?.completed_orders}
              </h6>
            </div>
          </div>
        </div>

        <div className="border border-[#A7A39C] p-4 rounded-[8px]">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
              <h5 className="text-[16px] text-[#000] font-semibold text-center">
                Trades
              </h5>
              <h6 className="text-[16px] text-[#000] font-semibold text-center flex gap-x-1 items-center cursor-pointer">
                More
                <FaAngleRight />
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Pending
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {tradeData?.data?.pending_trades}
              </h6>
            </div>
            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Accepted
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {tradeData?.data?.accepted_trades}
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Completed
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {tradeData?.data?.completed_trades}
              </h6>
            </div>
          </div>
        </div>

        <div className="border border-[#A7A39C] p-4 rounded-[8px]">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
              <h5 className="text-[16px] text-[#000] font-semibold text-center">
                Visitors
              </h5>
              <h6 className="text-[16px] text-[#000] font-semibold text-center flex gap-x-1 items-center cursor-pointer">
                More
                <FaAngleRight />
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Total Visits
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {tradeData?.data?.total_visits}
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Today's visit
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {visitorData?.data?.today_visits}
              </h6>
            </div>

            <div className="flex justify-between">
              <h5 className="text-[14px] text-[#000] font-semibold text-center">
                Last Month Visit
              </h5>
              <h6 className="text-[14px] text-[#000] font-semibold">
                {visitorData?.data?.last_month_visits}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdashboardStatistics;
