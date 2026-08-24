"use client";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { ReviewCardSkeleton } from "@/Components/Loader/Loader";
import PaginationControl from "@/Components/Common/PaginationControl";
import { useGetProductReviewsQuery } from "@/redux/api/productApi";

const ProductReviews = ({ id }: { id: number }) => {
  const [page, setPage] = useState<number>(0);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showMoreId, setShowMoreId] = useState<number>(0);
  const { data: productReviews, isFetching: reviewLoading } =
    useGetProductReviewsQuery({ id, page });

  return (
    <>
      <h3 className="text-xl md:text-2xl lg:text-4xl font-semibold text-secondary-black mb-2">
        {productReviews?.data?.reviews?.total} Reviews
      </h3>

      {/* Lower part */}
      <div>
        {reviewLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <ReviewCardSkeleton key={idx} />
          ))
        ) : productReviews?.data?.reviews?.data?.length > 0 ? (
          productReviews?.data?.reviews?.data?.map((item: any) => (
            <div
              key={item?.id}
              className="border-b last:border-b-0 border-gray-300 py-3"
            >
              <div className="flex gap-5 items-center">
                {/* Author Name */}
                <h3 className="text-base font-semibold text-primary-green">
                  Reviewed by {item?.user?.first_name} {item?.user?.last_name}
                </h3>

                {/* Review Count */}
                <div className="flex gap-1 items-center py-2">
                  {Array.from({ length: +item?.rating }).map((_, index) => (
                    <FaStar
                      key={index}
                      className="text-primary-green text-sm"
                    />
                  ))}

                  {Array.from({ length: 5 - +item?.rating }).map((_, index) => (
                    <FaRegStar
                      key={index}
                      className="text-primary-green text-sm"
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-secondary-gray text-[15px]">
                {showMore && item?.id === showMoreId
                  ? item?.message
                  : item?.message?.slice(0, 120)}

                {item?.message?.length > 120 && (
                  <button
                    onClick={() => {
                      setShowMore(!showMore);
                      setShowMoreId(item?.id);
                    }}
                    className="text-primary-green font-semibold cursor-pointer pl-2"
                  >
                    {showMore && item?.id === showMoreId
                      ? "read less"
                      : "read more...."}
                  </button>
                )}
              </p>
            </div>
          ))
        ) : (
          <p className="font-medium mt-3 text-gray-500">No reviews yet!</p>
        )}

        {!reviewLoading && (
          <PaginationControl
            currentPage={productReviews?.data?.reviews?.current_page}
            lastPage={productReviews?.data?.reviews?.last_page}
            onPageChange={setPage}
            className="!pb-0"
            alignment="center"
          />
        )}
      </div>
    </>
  );
};

export default ProductReviews;
