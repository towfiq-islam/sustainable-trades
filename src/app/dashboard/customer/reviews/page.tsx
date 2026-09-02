"use client";
import { useState } from "react";
import Review from "@/Components/Common/Review";
import { useGetCustomerReviewsQuery } from "@/redux/api/ordersApi";

const page = () => {
  const [page, setPage] = useState<string>("");
  const { data: reviews, isFetching: isLoading } =
    useGetCustomerReviewsQuery(page);
  return <Review reviews={reviews} isLoading={isLoading} setPage={setPage} />;
};

export default page;
