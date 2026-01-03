"use client";
import { useState } from "react";
import Review from "@/Components/Common/DashboardReusable/Review";
import { getCustomerReviews } from "@/Hooks/api/dashboard_api";

const page = () => {
  const [page, setPage] = useState<string>("");
  const { data: reviews, isLoading } = getCustomerReviews(page);

  return <Review reviews={reviews} isLoading={isLoading} setPage={setPage} />;
};

export default page;
