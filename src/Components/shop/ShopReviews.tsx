"use client";
import "swiper/css";
import Link from "next/link";
import Image from "next/image";
import "swiper/css/pagination";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Container from "@/Components/Common/Container";
import { RightArrowSvg } from "@/Components/Svg/SvgContainer";
import { FiMessageSquare } from "react-icons/fi";
import { ShopReviewSkeleton } from "@/Components/Loader/Loader";
import PaginationControl from "@/Components/Common/PaginationControl";
import { EmptyState } from "@/Components/Common/EmptyState";
import { useGetShopReviewsQuery } from "@/redux/api/shopApi";

type ImageItem = {
  image: string;
};

type ProductItemImg = {
  image: string;
  product_id: number;
};

type ReviewItem = {
  id: number;
  rating: number;
  message: string;
  images: ImageItem[];
  product: {
    id: string;
    product_name: string;
    images: ProductItemImg[];
  };
  user: {
    avatar: string;
    first_name: string;
    last_name: string;
  };
};

const ShopReviews = ({ id }: { id: number }) => {
  const [page, setPage] = useState<number>(0);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showMoreId, setShowMoreId] = useState<number>(0);
  const { data: shopReviews, isLoading: reviewLoading } =
    useGetShopReviewsQuery({
      id,
      page,
    });

  return (
    <section id="Reviews" className="mt-8">
      <Container>
        <h2 className="section_sub_title">Read Our Reviews</h2>

        <div>
          {reviewLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <ShopReviewSkeleton key={idx} />
              ))}
            </div>
          ) : shopReviews?.data?.data?.length > 0 ? (
            shopReviews?.data?.data?.map((item: ReviewItem) => (
              <div
                key={item?.id}
                className="flex flex-col lg:flex-row gap-5 sm:gap-10 md:gap-16 lg:items-center border-b last:border-b-0 border-gray-200 pt-4 pb-2"
              >
                {/* Left - Reviews */}
                <div className="grow flex flex-col sm:flex-row gap-4 items-start">
                  {/* Author Image */}
                  <figure className="shrink-0 size-12 grid place-items-center rounded-full relative bg-accent-red text-accent-white font-semibold">
                    {item?.user?.avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.user?.avatar}`}
                        alt="author_img"
                        fill
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : (
                      <span>{item?.user?.first_name?.at(0)}</span>
                    )}
                  </figure>

                  {/* Content */}
                  <div className="flex gap-10">
                    <div>
                      {/* Author Name */}
                      <h3 className=" text-sm sm:text-base font-semibold text-primary-green">
                        {item?.user?.first_name} {item?.user?.last_name}
                      </h3>

                      {/* Review Count */}
                      <div className="flex gap-1 items-center py-1.5">
                        {Array.from({ length: item?.rating }).map(
                          (_, index) => (
                            <FaStar
                              key={index}
                              className="text-primary-green text-xs"
                            />
                          ),
                        )}

                        {Array.from({ length: 5 - item?.rating }).map(
                          (_, index) => (
                            <FaRegStar
                              key={index}
                              className="text-primary-green text-xs"
                            />
                          ),
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-secondary-gray text-xs sm:text-[15px]">
                        {showMore && item?.id === showMoreId
                          ? item?.message
                          : item?.message?.slice(0, 150)}

                        {item?.message?.length > 150 && (
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

                    {/* Reviewed Image */}
                    <div className="flex gap-3 items-center rounded-lg w-[130px] h-[100px] shrink-0">
                      <Swiper
                        modules={[Pagination]}
                        spaceBetween={10}
                        pagination={{ clickable: true }}
                        className="review_swiper rounded-lg"
                      >
                        {item?.images?.map((img, idx) => (
                          <SwiperSlide key={idx}>
                            <figure className="w-[130px] h-[100px] rounded-lg border border-gray-100 relative">
                              <div className="absolute bg-black/10 z-50 inset-0 rounded-lg" />
                              <Image
                                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${img?.image}`}
                                alt="Reviewed img"
                                fill
                                unoptimized
                                className="w-full h-full rounded-lg object-cover"
                              />
                            </figure>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>

                {/* Right - Product under review */}
                <div className="xl:w-[300px] shrink-0">
                  <h4 className="text-primary-green text-sm font-semibold mb-3">
                    Purchased product:
                  </h4>
                  <div className="flex items-center gap-5">
                    <figure className="size-16 relative rounded-lg">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.product?.images[0]?.image}`}
                        alt="product image"
                        fill
                        unoptimized
                        className="size-full rounded-lg object-cover"
                      />
                    </figure>

                    <Link
                      href={`/product-details/${item?.product?.id}`}
                      className="text-sm font-semibold text-primary-green hover:underline"
                    >
                      {item?.product?.product_name}
                    </Link>
                    <RightArrowSvg />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<FiMessageSquare />}
              title="No reviews yet"
              description="This shop hasn't received any customer reviews so far. Be the first to share your experience once you've made a purchase."
            />
          )}

          {!reviewLoading && (
            <PaginationControl
              currentPage={shopReviews?.data?.current_page}
              lastPage={shopReviews?.data?.last_page}
              onPageChange={setPage}
              alignment="center"
            />
          )}
        </div>
      </Container>
    </section>
  );
};

export default ShopReviews;
