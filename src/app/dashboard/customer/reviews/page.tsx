"use client";
import { useState } from "react";
import Review from "@/Components/Common/DashboardReusable/Review";
import { useGetCustomerReviewsQuery } from "@/redux/api/OrderApi";

const page = () => {
  const [page, setPage] = useState<string>("");
  const { data: reviews, isLoading } = useGetCustomerReviewsQuery(page);

  return <Review reviews={reviews} isLoading={isLoading} setPage={setPage} />;
};

export default page;
