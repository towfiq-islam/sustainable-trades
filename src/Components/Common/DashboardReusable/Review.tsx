"use client";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";
import { CustomerReviewCardSkeleton } from "@/Components/Loader/Loader";
import Image from "next/image";

type ImageItem = {
  image: string;
};

type reviewItem = {
  id: number;
  message: string;
  rating: number;
  product: {
    product_name: string;
    images: ImageItem[];
  };
};

interface ReviewProps {
  reviews: {
    data: {
      data: reviewItem[];
      links: any;
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
          reviews?.data?.data?.map((item: reviewItem) => (
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
          <p className="text-red-500 font-semibold text-lg">No Reviews Found</p>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && (
        <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
          {reviews?.data?.links?.map((item: any, idx: number) => (
            <button
              key={idx}
              onClick={() => item.url && setPage(item.url.split("=")[1])}
              className={`px-3 py-1 rounded border transition-all duration-200 
        ${
          item.active ? "bg-primary-green text-white" : "bg-white text-gray-700"
        } 
        ${!item.url ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              disabled={!item.url}
              dangerouslySetInnerHTML={{ __html: item.label }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Review;
