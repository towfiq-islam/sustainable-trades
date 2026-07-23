"use client";
import {
  AboutShopSkeleton,
  EditShopBannerSkeleton,
  ShopBannerSkeleton,
  ShopFAQSkeleton,
  ShopPoliciesSkeleton,
} from "@/Components/Loader/Loader";
import { use, useState } from "react";
import ShopFAQ from "@/Components/PageComponents/mainPages/shopDetailsComponents/ShopFAQ";
import AboutShop from "@/Components/PageComponents/mainPages/shopDetailsComponents/AboutShop";
import ShopBanner from "@/Components/PageComponents/mainPages/shopDetailsComponents/ShopBanner";
import ShopPolicies from "@/Components/PageComponents/mainPages/shopDetailsComponents/ShopPolicies";
import ShopListing from "@/Components/PageComponents/mainPages/shopDetailsComponents/ShopListing";
import ShopReviews from "@/Components/PageComponents/mainPages/shopDetailsComponents/ShopReviews";
import DetailsTab from "@/Components/PageComponents/mainPages/shopDetailsComponents/DetailsTab";
import EditShopBanner from "@/Components/PageComponents/mainPages/shopDetailsComponents/EditShopBanner";
import {
  useGetAllProductsUnderShopQuery,
  useGetProductCategoriesQuery,
  useGetProductSubCategoriesQuery,
} from "@/redux/api/productApi";
import {
  useGetFeaturedListingsQuery,
  useGetShopDetailsQuery,
  useGetShopReviewsQuery,
} from "@/redux/api/shopApi";

type Props = {
  searchParams: Promise<{ id: number; listing_id: number; view: string }>;
};

const page = ({ searchParams }: Props) => {
  const { id, listing_id, view } = use(searchParams);

  // States
  const [category_id, setCategory] = useState<string>("");
  const [sub_category_id, setSubCategory] = useState<string>("");
  const [short_by, setSortBy] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<string>("");
  const [reviewPage, setReviewPage] = useState<string>("");

  const { data: productCategories, isLoading: categoryLoading } =
    useGetProductCategoriesQuery({});
  const { data: productSubCategories, isLoading: subCategoryLoading } =
    useGetProductSubCategoriesQuery({});

  const { data: shopDetailsData, isLoading: shopDetailLoading } =
    useGetShopDetailsQuery(id);
  const { data: featuredListings, isLoading: featuredLoading } =
    useGetFeaturedListingsQuery(listing_id);
  const { data: shopReviews, isLoading: reviewLoading } =
    useGetShopReviewsQuery({
      id: listing_id,
      page,
    });

  const { data: products, isFetching: isShopLoading } =
    useGetAllProductsUnderShopQuery(
      {
        id: listing_id,
        category_id,
        sub_category_id,
        short_by,
        search,
        page,
      },
      { skip: !listing_id },
    );

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

      {/* Shop Tabs */}
      <DetailsTab />

      {/* Shop Listings */}
      <ShopListing
        featuredListings={featuredListings?.data}
        allListings={products?.data}
        setSearch={setSearch}
        setCategory={setCategory}
        setSubCategory={setSubCategory}
        setSortBy={setSortBy}
        setPage={setPage}
        featuredLoading={featuredLoading}
        listingsLoading={isShopLoading}
        categoryLoading={categoryLoading}
        subCategoryLoading={subCategoryLoading}
        productCategories={productCategories?.data}
        productSubCategories={productSubCategories?.data}
      />

      {/* Shop Reviews */}
      <ShopReviews
        data={shopReviews?.data}
        reviewLoading={reviewLoading}
        setReviewPage={setReviewPage}
      />

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
