import { useGetOrderStatisticsQuery } from "@/redux/api/ordersApi";
import { useGetVendorListingsQuery } from "@/redux/api/productApi";
import { useGetTradesDataQuery } from "@/redux/api/tradeApi";
import { useGetVisitorDataQuery } from "@/redux/api/vendorApi";

const ProdashboardStatistics = () => {
  const { data: listingData, isLoading: listingLoading } =
    useGetVendorListingsQuery({});
  const { data: tradeData, isLoading: tradeLoading } = useGetTradesDataQuery(
    {},
  );
  const { data: orderData, isLoading: orderLoading } =
    useGetOrderStatisticsQuery({});
  const { data: visitorData, isLoading: visitorLoading } =
    useGetVisitorDataQuery();

  return (
    <div className="border border-gray-200 rounded-[8px] p-4 sm:p-6 mb-6 sm:mb-8">
      <h3 className="text-secondary-black text-base sm:text-lg font-semibold">
        Order / Store Statistics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-4">
        {/* Listings */}
        <div className="border border-gray-200 rounded-[8px] p-4 flex flex-col gap-3.5">
          <h5 className="text-sm sm:text-base text-secondary-black font-semibold pb-2 border-b border-accent-gray/30">
            Listings
          </h5>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Active</span>
            <span className="font-semibold text-primary-green">
              {listingLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (listingData?.data?.active_listings ?? 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Expired</span>
            <span className="font-semibold text-secondary-black">
              {listingLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (listingData?.data?.inactive_listings ?? 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Sold out</span>
            <span className="font-semibold text-accent-red">
              {listingLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (listingData?.data?.sold_out_listings ?? 0)
              )}
            </span>
          </div>
        </div>

        {/* Orders */}
        <div className="border border-gray-200 rounded-[8px] p-4 flex flex-col gap-3.5">
          <h5 className="text-sm sm:text-base text-secondary-black font-semibold pb-2 border-b border-accent-gray/30">
            Orders
          </h5>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">New</span>
            <span className="font-semibold text-primary-green">
              {orderLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (orderData?.data?.new_orders ?? 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Shipped</span>
            <span className="font-semibold text-secondary-black">
              {orderLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (orderData?.data?.shipped_orders ?? 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Completed</span>
            <span className="font-semibold text-primary-green">
              {orderLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (orderData?.data?.completed_orders ?? 0)
              )}
            </span>
          </div>
        </div>

        {/* Trades */}
        <div className="border border-gray-200 rounded-[8px] p-4 flex flex-col gap-3.5">
          <h5 className="text-sm sm:text-base text-secondary-black font-semibold pb-2 border-b border-accent-gray/30">
            Trades
          </h5>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Pending</span>
            <span className="font-semibold text-accent-red">
              {tradeLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (tradeData?.data?.pending_trades ?? 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Accepted</span>
            <span className="font-semibold text-primary-green">
              {tradeLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (tradeData?.data?.accepted_trades ?? 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Completed</span>
            <span className="font-semibold text-primary-green">
              {tradeLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (tradeData?.data?.completed_trades ?? 0)
              )}
            </span>
          </div>
        </div>

        {/* Visitors */}
        <div className="border border-gray-200 rounded-[8px] p-4 flex flex-col gap-3.5">
          <h5 className="text-sm sm:text-base text-secondary-black font-semibold pb-2 border-b border-accent-gray/30">
            Visitors
          </h5>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">
              Total Visits
            </span>
            <span className="font-semibold text-primary-green">
              {visitorLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (visitorData?.data?.total_visits ?? 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">
              Today&apos;s visit
            </span>
            <span className="font-semibold text-secondary-black">
              {visitorLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (visitorData?.data?.today_visits ?? 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-secondary-gray font-medium">Last Month</span>
            <span className="font-semibold text-secondary-black">
              {visitorLoading ? (
                <span className="inline-block w-6 h-4 bg-warm-beige rounded animate-pulse" />
              ) : (
                (visitorData?.data?.last_month_visits ?? 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdashboardStatistics;
