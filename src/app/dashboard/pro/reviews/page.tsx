"use client";
import { useState } from "react";
import Review from "@/Components/Common/DashboardReusable/Review";
import useAuth from "@/Hooks/useAuth";
import { useGetShopReviewsQuery } from "@/redux/api/shopApi";

const page = () => {
  const { user } = useAuth();
  const [page, setPage] = useState<string>("");
  const { data: reviews, isLoading } = useGetShopReviewsQuery({
    id: user?.shop_info?.id,
    page,
  });

  return <Review reviews={reviews} isLoading={isLoading} setPage={setPage} />;
};

export default page;
