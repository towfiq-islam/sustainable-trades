"use client";
import {
  AboutShopSkeleton,
  EditShopBannerSkeleton,
  ShopBannerSkeleton,
  ShopFAQSkeleton,
  ShopPoliciesSkeleton,
} from "@/Components/Loader/Loader";
import { use } from "react";
import ShopFAQ from "@/Components/shop/ShopFAQ";
import AboutShop from "@/Components/shop/AboutShop";
import ShopBanner from "@/Components/shop/ShopBanner";
import ShopPolicies from "@/Components/shop/ShopPolicies";
import ShopListing from "@/Components/shop/ShopListing";
import ShopReviews from "@/Components/shop/ShopReviews";
import DetailsTab from "@/Components/shop/DetailsTab";
import EditShopBanner from "@/Components/shop/EditShopBanner";
import { useGetShopDetailsQuery } from "@/redux/api/shopApi";

type Props = {
  searchParams: Promise<{ id: number; listing_id: number; view: string }>;
};

const page = ({ searchParams }: Props) => {
  const { id, listing_id, view } = use(searchParams);
  const { data: shopDetailsData, isLoading: shopDetailLoading } =
    useGetShopDetailsQuery(id);

  return (
    <>
      {/* Shop Banner */}
      {view === "customer" ? (
        shopDetailLoading ? (
          <ShopBannerSkeleton />
        ) : (
          <ShopBanner data={shopDetailsData?.data} id={id} />
        )
      ) : shopDetailLoading ? (
        <EditShopBannerSkeleton />
      ) : (
        <EditShopBanner data={shopDetailsData?.data} shop_id={id} />
      )}

      <DetailsTab />

      <ShopListing id={listing_id} />
      <ShopReviews id={listing_id} />

      {/* Shop About */}
      {shopDetailLoading ? (
        <AboutShopSkeleton />
      ) : (
        <AboutShop data={shopDetailsData?.data?.shop_info} />
      )}

      {/* Shop Policies */}
      {shopDetailLoading ? (
        <ShopPoliciesSkeleton />
      ) : (
        <ShopPolicies data={shopDetailsData?.data?.shop_info?.policies} />
      )}

      {/* Shop FAQ */}
      {shopDetailLoading ? (
        <ShopFAQSkeleton />
      ) : (
        <ShopFAQ data={shopDetailsData?.data?.shop_info?.faqs} />
      )}
    </>
  );
};

export default page;
