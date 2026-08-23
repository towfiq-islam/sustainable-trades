"use client";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { ReviewCardSkeleton } from "@/Components/Loader/Loader";
import PaginationControl from "@/Components/Common/PaginationControl";

const ProductReviews = ({
  reviewCount,
  reviewAvg,
  data,
  reviewLoading,
  setPage,
}: any) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showMoreId, setShowMoreId] = useState<number>(0);

  return (
    <>
      {/* Upper part */}
      <div className="flex gap-5 items-center mb-2">
        <h3 className="text-xl md:text-2xl lg:text-4xl font-semibold text-secondary-black">
          {reviewCount} Reviews
        </h3>

        <div className="flex gap-1 items-center">
          {Array.from({ length: +reviewAvg }).map((_, index) => (
            <FaStar key={index} className="text-primary-green" />
          ))}
        </div>
      </div>

      {/* Lower part */}
      <div>
        {reviewLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <ReviewCardSkeleton key={idx} />
          ))
        ) : data?.data?.length > 0 ? (
          data?.data?.map((item: any) => (
            <div
              key={item?.id}
              className="border-b last:border-b-0 border-gray-300 py-6"
            >
              <div className="flex gap-5 items-center">
                {/* Author Name */}
                <h3 className="text-lg font-semibold text-primary-green">
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
              <p className="text-secondary-gray">
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
      </div>

      {!reviewLoading && (
        <PaginationControl
          currentPage={data?.links?.first_page}
          lastPage={data?.links?.last_page}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default ProductReviews;
