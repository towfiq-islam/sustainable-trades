"use client";
import {
  getCategoryDetails,
  getProductCategoriesClient,
} from "@/Hooks/api/cms_api";
import "swiper/css";
import { useState } from "react";
import Image from "next/image";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { AiOutlineFileUnknown } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import Container from "@/Components/Common/Container";
import Product from "@/Components/Common/Product";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ProductSkeleton } from "@/Components/Loader/Loader";
import { SingleShopSkeleton } from "@/Components/Loader/Loader";
import { FaCheck } from "react-icons/fa6";
import MagicMarkers from "@/app/(main)/_Components/MagicMarkers";
import Subscribe from "@/app/(main)/_Components/Subscribe";
import useAuth from "@/Hooks/useAuth";
import MemberSpotlight from "@/app/(main)/_Components/MemberSpotlight";
import { useGetMembershipSpotlightQuery } from "@/redux/api/shopApi";

type categoryItem = {
  id: number;
  name: string;
  image: string;
  icon: string;
};

const page = ({ params }: any) => {
  const id = Number(params?.id);
  const { latitude, longitude } = useAuth();
  const [page, setPage] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(id);
  const { data: spotlightData } = useGetMembershipSpotlightQuery({});
  const { data: allCategory, isLoading: categoryLoading } =
    getProductCategoriesClient();
  const { data: categoryDetails, isLoading } = getCategoryDetails(
    categoryId,
    latitude,
    longitude,
    page,
  );

  return (
    <>
      <MagicMarkers />

      {/* All Categories */}
      <section className="mb-20">
        <Container>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-secondary-black mb-10 capitalize">
            Explore Sustainable Products & Services Nearby
          </h2>

          <div className="relative">
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 z-10 -translate-y-1/2 shadow-md rounded-full p-3 bg-primary-green text-white transition cursor-pointer">
              <FaArrowLeft />
            </button>

            <button className="swiper-button-next-custom absolute right-0 top-1/2 z-10 -translate-y-1/2 shadow-md rounded-full p-3 bg-primary-green text-white transition cursor-pointer">
              <FaArrowRight />
            </button>

            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },

                500: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },

                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },

                1280: {
                  slidesPerView: 5,
                  spaceBetween: 40,
                },
              }}
              className="!mx-10"
            >
              {categoryLoading
                ? Array.from({ length: 7 }).map((_, index) => (
                    <SwiperSlide key={index}>
                      <SingleShopSkeleton />
                    </SwiperSlide>
                  ))
                : allCategory?.data?.map((item: categoryItem) => (
                    <SwiperSlide key={item?.id}>
                      <div
                        onClick={() => setCategoryId(item?.id)}
                        className="text-center"
                      >
                        <figure className="size-44 mx-auto cursor-pointer rounded-full overflow-hidden relative">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.image}`}
                            alt="shop_image"
                            fill
                            unoptimized
                            className="size-full rounded-full object-cover hover:scale-105 duration-500 transition-transform"
                          />
                          {categoryId === item?.id && (
                            <div className="absolute inset-0 bg-black/45 grid place-items-center text-4xl text-gray-200">
                              <FaCheck />
                            </div>
                          )}
                        </figure>

                        <h3 className="mt-4 text-primary-green font-semibold truncate">
                          {item?.name}
                        </h3>
                      </div>
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        </Container>
      </section>

      {/* Geographically Closest Listings */}
      <Container>
        {isLoading ? (
          <h2 className="w-60 h-6 mb-7 animate-pulse bg-gray-200 rounded"></h2>
        ) : (
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-secondary-black mb-7">
            {categoryDetails?.data?.category?.name}
          </h2>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : categoryDetails?.data?.products?.length === 0 ||
          !categoryDetails ? (
          <div className="flex flex-col justify-center items-center gap-3 lg:gap-4 text-center py-5 md:py-20">
            <AiOutlineFileUnknown className="text-xl md:text-3xl lg:text-6xl text-gray-500" />
            <p className="text-gray-600 text-sm md:text-lg font-semibold">
              No products found!!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {categoryDetails?.data?.products?.map((product: any) => (
              <Product key={product?.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && (
          <div className="py-8 flex justify-center items-center gap-2 flex-wrap">
            {categoryDetails?.data?.products?.links?.map(
              (item: any, idx: number) => (
                <button
                  key={idx}
                  disabled={!item.url}
                  dangerouslySetInnerHTML={{ __html: item.label }}
                  onClick={() => item.url && setPage(item.url.split("=")[1])}
                  className={`px-3 py-1 rounded border transition-all duration-200 ${item.active ? "bg-primary-green text-white" : "bg-white text-gray-700"} ${!item.url ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                />
              ),
            )}
          </div>
        )}
      </Container>

      <div className="py-10 md:py-16">
        <MemberSpotlight data={spotlightData?.data} has_community={true} />
      </div>
      <Subscribe />
    </>
  );
};

export default page;
