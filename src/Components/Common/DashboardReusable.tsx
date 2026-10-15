"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import ProdashboardStatistics from "./ProdashboardStatistics";
import moment from "moment";
import {
  InventoryItemSkeleton,
  NotificationSkeleton,
} from "@/Components/Loader/Loader";
import { useGetLatestProductsQuery } from "@/redux/api/productApi";
import {
  useGetDashboardHomeDataQuery,
  useGetTodaysNotificationsQuery,
} from "@/redux/api/vendorApi";
import { FaAngleRight } from "react-icons/fa";
import { FiBox, FiBell } from "react-icons/fi";
import { ImageItem } from "@/Types";

const InventoryThumbnail = ({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="size-full flex items-center justify-center bg-off-green/20 text-primary-green">
        <FiBox className="text-xl sm:text-2xl" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      onError={() => setError(true)}
      className="size-full object-cover rounded-lg"
    />
  );
};

const AvatarThumbnail = ({
  src,
  name,
}: {
  src?: string;
  name?: string;
}) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <span>{name?.at(0) || "U"}</span>;
  }

  return (
    <Image
      src={src}
      alt={name || "profile"}
      fill
      onError={() => setError(true)}
      className="rounded-full size-full object-cover"
    />
  );
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

type HomeProps = {
  isStatistics: boolean;
  isPackage?: boolean;
};

const DashboardReusable = ({ isStatistics, isPackage }: HomeProps) => {
  const { user } = useAuth();
  const { data: homeData, isLoading: homeDataLoading } =
    useGetDashboardHomeDataQuery();
  const { data: notificationsData, isLoading: notificationLoading } =
    useGetTodaysNotificationsQuery();
  const { data: latestProductsData, isLoading: latestProductsLoading } =
    useGetLatestProductsQuery({});

  return (
    <>
      {/* Top Section */}
      <div className="pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-3.5 sm:gap-6">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-secondary-black">
            Hi {user?.first_name || "Vendor"},
          </h2>
          <p className="text-sm sm:text-base text-secondary-gray font-medium">
            Here’s your store:{" "}
            <span className="font-semibold text-primary-green">
              {user?.shop_info?.shop_name || "My Shop"}
            </span>
          </p>
        </div>

        <Link
          href={`/shop-details?view=owner&id=${user?.shop_info?.user_id}&listing_id=${user?.shop_info?.id}`}
          className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-[8px] bg-accent-red text-sm sm:text-base font-semibold text-secondary-black hover:bg-transparent hover:text-accent-red border border-accent-red duration-300 transition-all text-center self-start sm:self-auto cursor-pointer"
        >
          Edit Shop
        </Link>
      </div>

      {/* Upper KPI metrics */}
      <div className="border border-gray-200 rounded-[8px] py-2 sm:py-3 mb-6 sm:mb-8 bg-off-green/5">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-accent-gray/20">
          <div className="py-3 px-4 sm:px-6 text-center flex flex-col justify-center items-center">
            <p className="text-sm sm:text-base text-muted-gray font-semibold mb-1">
              Orders
            </p>
            <h4 className="text-2xl sm:text-3xl lg:text-4xl text-primary-green font-semibold">
              {homeDataLoading ? (
                <span className="inline-block w-12 h-7 bg-warm-beige rounded animate-pulse" />
              ) : (
                (homeData?.data?.total_orders ?? 0)
              )}
            </h4>
          </div>

          <div className="py-3 px-4 sm:px-6 text-center flex flex-col justify-center items-center">
            <p className="text-sm sm:text-base text-muted-gray font-semibold mb-1">
              Trades
            </p>
            <h4 className="text-2xl sm:text-3xl lg:text-4xl text-primary-green font-semibold">
              {homeDataLoading ? (
                <span className="inline-block w-12 h-7 bg-warm-beige rounded animate-pulse" />
              ) : (
                (homeData?.data?.total_trades ?? 0)
              )}
            </h4>
          </div>

          <div className="py-3 px-4 sm:px-6 text-center flex flex-col justify-center items-center">
            <p className="text-sm sm:text-base text-muted-gray font-semibold mb-1">
              Revenue
            </p>
            <h4 className="text-2xl sm:text-3xl lg:text-4xl text-primary-green font-semibold">
              {homeDataLoading ? (
                <span className="inline-block w-16 h-7 bg-warm-beige rounded animate-pulse" />
              ) : (
                `$${Number(homeData?.data?.total_revenue ?? 0).toFixed(2)}`
              )}
            </h4>
          </div>

          <div className="py-3 px-4 sm:px-6 text-center flex flex-col justify-center items-center">
            <p className="text-sm sm:text-base text-muted-gray font-semibold mb-1">
              Visits
            </p>
            <h4 className="text-2xl sm:text-3xl lg:text-4xl text-primary-green font-semibold">
              {homeDataLoading ? (
                <span className="inline-block w-12 h-7 bg-warm-beige rounded animate-pulse" />
              ) : (
                (homeData?.data?.total_visits ?? 0)
              )}
            </h4>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col gap-5 ${isPackage ? "lg:flex-row" : ""} mb-6 sm:mb-8`}
      >
        {/* Latest Products */}
        <div className={`w-full ${isPackage ? "lg:w-2/3" : ""}`}>
          <div className="border border-gray-200 rounded-[8px] overflow-hidden">
            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-accent-gray/20">
                <h5 className="text-base sm:text-lg text-secondary-black font-semibold">
                  Inventory
                </h5>

                {latestProductsData?.data?.length > 0 && (
                  <Link
                    href={`/dashboard/${user?.membership?.membership_type}/listing`}
                    className="text-xs sm:text-sm text-primary-green hover:underline font-semibold flex gap-1 items-center cursor-pointer"
                  >
                    More
                    <FaAngleRight />
                  </Link>
                )}
              </div>

              {latestProductsLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <InventoryItemSkeleton key={idx} />
                ))
              ) : latestProductsData?.data?.length > 0 ? (
                latestProductsData?.data?.map((item: ItemData) => (
                  <div
                    key={item?.id}
                    className="py-3.5 sm:py-4 flex items-center gap-3 sm:gap-4 border-b last:border-b-0 border-accent-gray/20 overflow-hidden"
                  >
                    <figure className="relative size-16 sm:size-20 rounded-lg shrink-0 overflow-hidden bg-warm-beige/40 border border-accent-gray/40">
                      <InventoryThumbnail
                        src={
                          item?.images?.[0]?.image
                            ? `${process.env.NEXT_PUBLIC_SITE_URL}/${item.images[0].image}`
                            : undefined
                        }
                        alt={item?.product_name || "Inventory"}
                      />
                    </figure>

                    <div className="w-full min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs sm:text-sm md:text-base text-secondary-black font-semibold truncate flex-1">
                          {item?.product_name}
                        </h4>

                        <span className="text-[11px] sm:text-xs text-primary-green font-semibold shrink-0 bg-off-green/50 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          {item?.unlimited_stock
                            ? "Unlimited Stock"
                            : `${item?.product_quantity} items left`}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-secondary-gray font-normal py-0.5 sm:py-1 truncate">
                        {item?.selling_option === "for_sale_or_trade_barter"
                          ? "For sale and trade/barter"
                          : item?.selling_option === "trade/barter"
                            ? "For trade/barter"
                            : "For sale"}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-block size-2 rounded-full ${
                            item?.out_of_stock
                              ? "bg-accent-red"
                              : "bg-primary-green"
                          }`}
                        />
                        <span className="text-[11px] sm:text-xs text-secondary-black font-semibold">
                          {item?.out_of_stock ? "Out of stock" : "In Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center">
                  <div className="size-12 sm:size-14 rounded-full bg-off-green/40 grid place-items-center mb-3">
                    <FiBox className="text-primary-green text-xl sm:text-2xl" />
                  </div>

                  <h6 className="text-sm sm:text-base text-secondary-black font-semibold">
                    No inventory yet
                  </h6>

                  <p className="text-xs sm:text-sm text-muted-gray font-normal mt-1 max-w-[250px]">
                    Products you add to your store will show up here.
                  </p>

                  <Link
                    href={`/dashboard/${user?.membership?.membership_type}/create-listing`}
                    className="mt-3 px-5 py-2 rounded-[8px] bg-accent-red text-xs sm:text-sm font-semibold text-secondary-black border border-accent-red duration-300 hover:bg-transparent hover:text-accent-red"
                  >
                    Add Product
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade Popup for basic users */}
        {isPackage && (
          <div className="border border-accent-gray rounded-[8px] p-5 lg:w-1/3 text-center flex flex-col justify-center items-center">
            <h3 className="text-base sm:text-lg font-semibold text-secondary-black">
              Want more admin access?
            </h3>
            <p className="text-xs sm:text-sm font-normal text-secondary-gray max-w-[280px] pt-2 pb-4">
              Upgrade at anytime to pro! All you have to do is pay the
              difference for the remainder of the year.
            </p>

            <Link
              href="/dashboard/basic/membership"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-[8px] bg-transparent text-sm sm:text-base font-semibold text-secondary-black cursor-pointer hover:bg-accent-red hover:text-white duration-300 transition-colors border border-accent-red"
            >
              Upgrade To Pro
            </Link>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="border border-gray-200 rounded-[8px] mb-6 sm:mb-8 overflow-hidden">
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-accent-gray/30">
          <h5 className="text-base sm:text-lg text-secondary-black font-semibold">
            Recent Activity
          </h5>

          {notificationsData?.data?.data?.length > 0 && (
            <Link
              href={`/dashboard/${user?.membership?.membership_type}/notification`}
              className="text-xs sm:text-sm text-primary-green hover:underline font-semibold flex gap-1 items-center cursor-pointer"
            >
              More
              <FaAngleRight />
            </Link>
          )}
        </div>

        {notificationLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <NotificationSkeleton key={idx} />
            ))}
          </div>
        ) : notificationsData?.data?.data?.length > 0 ? (
          notificationsData?.data?.data?.map((item: NotificationItem) => (
            <div
              key={item?.id}
              className="border-b last:border-b-0 border-accent-gray/30 py-3.5 px-4 sm:px-5 hover:bg-warm-beige/20 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 sm:gap-4">
                <div className="flex gap-3 items-center min-w-0 flex-1">
                  <figure className="rounded-full size-10 sm:size-11 grid place-items-center bg-accent-red text-white text-base font-semibold relative shrink-0 overflow-hidden">
                    <AvatarThumbnail
                      src={
                        item?.user?.avatar
                          ? `${process.env.NEXT_PUBLIC_SITE_URL}/${item.user.avatar}`
                          : undefined
                      }
                      name={item?.user?.name}
                    />
                  </figure>

                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs sm:text-sm text-secondary-black font-semibold truncate">
                      {item?.user?.name}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-muted-gray font-normal">
                      {`Sent ${moment(item?.created_at).fromNow()}`}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right min-w-0 flex-1 sm:max-w-xs">
                  <h5 className="text-xs sm:text-sm text-secondary-black font-semibold truncate">
                    {item?.data?.subject}
                  </h5>
                  <p className="text-xs text-muted-gray font-normal truncate">
                    {item?.data?.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center">
            <div className="size-12 sm:size-14 rounded-full bg-off-green/40 grid place-items-center mb-3">
              <FiBell className="text-primary-green text-xl sm:text-2xl" />
            </div>
            <h6 className="text-sm sm:text-base text-secondary-black font-semibold">
              You&apos;re all caught up
            </h6>
            <p className="text-xs sm:text-sm text-muted-gray font-normal mt-1 max-w-[260px]">
              New orders, trades, and messages will appear here as they happen.
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      {isStatistics && <ProdashboardStatistics />}
    </>
  );
};

export default DashboardReusable;
