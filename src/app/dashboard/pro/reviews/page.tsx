"use client";
import { useState } from "react";
import Review from "@/Components/Common/DashboardReusable/Review";
import { getShopReviews } from "@/Hooks/api/cms_api";
import useAuth from "@/Hooks/useAuth";

const page = () => {
  const { user } = useAuth();
  const [page, setPage] = useState<string>("");
  const { data: reviews, isLoading } = getShopReviews(
    user?.shop_info?.id,
    page
  );

  return <Review reviews={reviews} isLoading={isLoading} setPage={setPage} />;
};

export default page;
