"use client";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";
import { CustomerReviewCardSkeleton } from "@/Components/Loader/Loader";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { ReviewItem } from "@/Types";
import PaginationControl from "../PaginationControl";

interface ReviewProps {
  reviews: {
    data: {
      data: ReviewItem[];
      links: any;
      current_page: number;
      last_page: number;
    };
  };
  isLoading: any;
  setPage: any;
}

const Review = ({ reviews, isLoading, setPage }: ReviewProps) => {
  return (
    <>
      <DashBoardHeader heading="Your Reviews" placeholder="Search" />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <CustomerReviewCardSkeleton key={idx} />
          ))
        ) : reviews?.data?.data?.length > 0 ? (
          reviews?.data?.data?.map((item: ReviewItem) => (
            <div
              key={item?.id}
              className="border border-gray-300 rounded-xl p-6 shadow-md bg-white flex flex-col items-center text-center"
            >
              <figure className="size-16 rounded-full mb-4 border border-gray-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.product?.images[0]?.image}`}
                  unoptimized
                  width={16}
                  height={16}
                  alt={"ProductImage"}
                  className="size-full rounded-full object-cover"
                />
              </figure>

              <h3 className="text-lg font-semibold">
                {item?.product?.product_name}
              </h3>

              <p className="text-sm text-gray-500">Product Review</p>

              <p className="mt-3 text-gray-700 italic">“{item.message}”</p>
              <div className="mt-3 text-yellow-500">
                {"★".repeat(item?.rating)}
                {"☆".repeat(5 - item?.rating)}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center">
            <div className="size-14 rounded-full bg-accent-red/10 grid place-items-center mb-5">
              <FiStar className="text-accent-red text-2xl" />
            </div>
            <h6 className="text-secondary-black font-semibold">
              No reviews yet
            </h6>
            <p className="text-sm text-gray-500 font-normal mt-2 max-w-[280px]">
              Reviews customers leave on your products will show up here.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && (
        <PaginationControl
          currentPage={reviews?.data?.current_page}
          lastPage={reviews?.data?.last_page}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default Review;
