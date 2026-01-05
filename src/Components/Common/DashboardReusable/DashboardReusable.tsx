"use client";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import ProdashboardStatistics from "./ProdashboardStatistics";
import { FaAngleRight } from "react-icons/fa";
import {
  getDashboardHomeData,
  getLatestProducts,
  useNotification,
} from "@/Hooks/api/dashboard_api";
import moment from "moment";

type ImageItem = {
  image: string;
};

type ItemData = {
  id: number;
  product_name: string;
  unlimited_stock: boolean;
  product_quantity: string;
  selling_option: string;
  out_of_stock: boolean;
  images: ImageItem[];
};

type NotificationItem = {
  id: number;
  created_at: string;
  user: {
    avatar: string;
    name: string;
  };
  data: {
    subject: string;
    message: string;
  };
};

const DashboardReusable = () => {
  const { user } = useAuth();
  const { data: homeData, isLoading: homeDataLoading } = getDashboardHomeData();
  const { data: latestProductsData, isLoading: latestProductsLoading } =
    getLatestProducts();
  const { data: notificationsData, isLoading: notificationLoading } =
    useNotification();

  return (
    <>
      {/* Top Section */}
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

      {/* Upper section */}
      <div className="border border-[#A7A39C] py-3 rounded-[8px]">
        <div className="flex flex-wrap justify-between items-center">
          <div className="px-[40px] md:px-[65px]">
            <p className="text-[16px] text-[#67645F] font-semibold text-center">
              Orders
            </p>
            <h4 className="text-[25px] md:text-[40px] text-[#274F45] font-semibold text-center">
              {homeData?.data?.total_orders}
            </h4>
          </div>
          <div className="px-[40px] md:px-[65px]">
            <p className="text-[16px] text-[#67645F] font-semibold text-center">
              Trades
            </p>
            <h4 className="text-[25px] md:text-[40px] text-[#274F45] font-semibold text-center">
              {homeData?.data?.total_trades}
            </h4>
          </div>
          <div className="px-[40px] md:px-[65px]">
            <p className="text-[16px] text-[#67645F] font-semibold text-center">
              Revenue
            </p>
            <h4 className="text-[25px] md:text-[40px] text-[#274F45] font-semibold text-center">
              ${homeData?.data?.total_revenue}
            </h4>
          </div>
          <div className="px-[40px] md:px-[65px]">
            <p className="text-[16px] text-[#67645F] font-semibold text-center">
              Visits
            </p>
            <h4 className="text-[25px] md:text-[40px] text-[#274F45] font-semibold text-center">
              {homeData?.data?.total_visits}
            </h4>
          </div>
        </div>
      </div>

      {/* Latest Products */}
      <div className="pt-[30px] md:pt-[77px] pb-8">
        <div className="border border-[#A7A39C] rounded-[10px] w-full md:w-[380px]">
          <div className="p-3">
            <div className="flex justify-between">
              <h5 className="text-[16px] text-[#000] font-semibold text-center">
                Inventory
              </h5>

              <Link
                href="/dashboard/pro/listing"
                className="text-[16px] text-[#000] font-semibold text-center flex gap-x-1 items-center cursor-pointer"
              >
                More
                <FaAngleRight />
              </Link>
            </div>

            {latestProductsData?.data?.map((item: ItemData) => (
              <div
                key={item?.id}
                className="py-4 flex flex-col md:flex-row gap-3 md:items-center border-b last:border-b-0 border-gray-300"
              >
                <figure className="relative w-[100px] h-[80px] rounded-lg">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.images?.[0]?.image}`}
                    alt="Inventory"
                    fill
                    className="shrink-0 w-full h-full object-cover rounded-lg"
                  />
                </figure>

                <div className="w-full">
                  <div className="flex w-full justify-between items-center">
                    <h4 className="text-[14px] text-[#000] font-semibold">
                      {item?.product_name}
                    </h4>

                    <h4 className="text-[14px] text-[#274F45] font-semibold">
                      {`${item?.product_quantity} items left`}
                    </h4>
                  </div>

                  <p className="text-sm text-[#000] font-normal py-1 truncate">
                    {item?.selling_option}
                  </p>

                  <h6 className="text-[12px] text-[#000] font-semibold">
                    {item?.out_of_stock ? "Out of stock" : "In Stock"}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border border-[#A7A39C] rounded-[8px]">
        <div className="flex justify-between p-4">
          <h5 className="text-[16px] text-[#000] font-semibold text-center">
            Recent Activity
          </h5>

          <Link
            href="/dashboard/pro/notification"
            className="text-[16px] text-[#000] font-semibold text-center flex gap-x-1 items-center cursor-pointer"
          >
            More
            <FaAngleRight />
          </Link>
        </div>

        {notificationsData?.data?.notifications?.map(
          (item: NotificationItem) => (
            <div
              key={item?.id}
              className="border-b last:border-b-0 border-[#A7A39C] py-4"
            >
              <div className="flex flex-col sm:flex-row justify-between px-4 sm:items-center gap-3.5 sm:gap-0">
                <div className="flex gap-x-2 items-center">
                  <figure className="rounded-full size-[50px] grid place-items-center bg-accent-red text-white text-lg font-semibold relative">
                    {item?.user?.avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.user?.avatar}`}
                        alt="profile"
                        fill
                        className="rounded-full size-full object-cover"
                      />
                    ) : (
                      <h3>{item?.user?.name?.at(0)}</h3>
                    )}
                  </figure>

                  <div className="">
                    <h5 className="text-[14px] text-[#000] font-semibold">
                      {item?.user?.name}
                    </h5>
                    <p className="text-[14px] text-[#67645F] font-normal">
                      {`Sent ${moment(item?.created_at).fromNow()}`}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-[14px] text-[#000] font-semibold">
                    {item?.data?.subject}
                  </h5>
                  <p className="text-[14px] text-[#67645F] font-normal truncate">
                    {item?.data?.message}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* <div className="pt-8 pb-8 lg:pb-16">
        <ProDashboardMessage />
      </div> */}

      {/* Statistics */}
      <div className="mt-10">
        <ProdashboardStatistics />
      </div>
    </>
  );
};

export default DashboardReusable;
