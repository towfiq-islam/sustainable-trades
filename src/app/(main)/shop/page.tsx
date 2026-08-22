"use client";
import "swiper/css";
import { useEffect, useState } from "react";
import Image from "next/image";
import "swiper/css/navigation";
import useAuth from "@/Hooks/useAuth";
import { FaCheck } from "react-icons/fa6";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Container from "@/Components/Common/Container";
import Product from "@/Components/Common/Product";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ProductSkeleton } from "@/Components/Loader/Loader";
import { SingleShopSkeleton } from "@/Components/Loader/Loader";
import MagicMarkers from "@/app/(main)/_Components/MagicMarkers";
import Subscribe from "@/app/(main)/_Components/Subscribe";
import MemberSpotlight from "../_Components/MemberSpotlight";
import { useGetMembershipSpotlightQuery } from "@/redux/api/shopApi";
import {
  useGetCategoryDetailsQuery,
  useGetNearbyProductsQuery,
  useGetProductCategoriesQuery,
} from "@/redux/api/productApi";
import PaginationControl from "@/Components/Common/PaginationControl";
import { FiPackage, FiMapPin } from "react-icons/fi";
import { EmptyState } from "@/Components/Common/EmptyState";

type categoryItem = {
  id: number;
  name: string;
  image: string;
  icon: string;
};

const page = () => {
  const { latitude, longitude } = useAuth();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [nearbyPage, setNearbyPage] = useState<number>(1);
  const { data: spotlightData } = useGetMembershipSpotlightQuery({});
  const { data: allCategory, isLoading: categoryLoading } =
    useGetProductCategoriesQuery({});

  const { data: categoryDetails, isFetching } = useGetCategoryDetailsQuery(
    {
      id: categoryId,
      lat: latitude,
      lng: longitude,
      page,
    },
    { skip: !categoryId },
  );

  const { data: nearbyProducts, isLoading: nearbyProductsLoading } =
    useGetNearbyProductsQuery({
      lat: latitude,
      lng: longitude,
      page: nearbyPage,
    });

  useEffect(() => {
    setCategoryId(allCategory?.data[0]?.id);
  }, [allCategory]);

  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  const goToFirstCategory = () => {
    if (allCategory?.data?.[0]?.id) {
      setCategoryId(allCategory.data[0].id);
    }
  };

  return (
    <>
      <MagicMarkers />

      {/* All Categories */}
      <section className="mb-10 md:mb-20">
        <Container>
          <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-secondary-black pt-3 xl:pt-0 mb-5 lg:mb-10 capitalize">
            Explore Category Wise Sustainable Products Nearby
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
        {isFetching ? (
          <h2 className="w-60 h-6 mb-7 animate-pulse bg-gray-200 rounded"></h2>
        ) : (
          <h2 className="text-lg md:text-2xl xl:text-3xl font-semibold text-secondary-black mb-5 xl:mb-7">
            {categoryDetails?.data?.category?.name}
          </h2>
        )}

        {isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : categoryDetails?.data?.length === 0 ? (
          <EmptyState
            icon={<FiPackage />}
            title="Nothing here yet"
            description={`No sustainable listings under "${categoryDetails?.data?.category?.name || "this category"}" near you right now. Try another category or check back soon.`}
            actionLabel="Browse first category"
            onAction={goToFirstCategory}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {categoryDetails?.data?.products?.data?.map((product: any) => (
              <Product key={product?.id} product={product} />
            ))}
          </div>
        )}

        {!isFetching && categoryDetails?.data?.products && (
          <div className="py-8">
            <PaginationControl
              currentPage={categoryDetails.data.products.current_page}
              lastPage={categoryDetails.data.products.last_page}
              onPageChange={setPage}
              alignment="center"
            />
          </div>
        )}
      </Container>

      {/* Nearby Listings */}
      <Container>
        <h2 className="mt-8 xl:mt-16 text-xl lg:text-2xl xl:text-3xl font-semibold text-secondary-black mb-5 lg:mb-10 capitalize">
          Sustainable Products & Services Nearby
        </h2>

        {nearbyProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : nearbyProducts?.data?.length === 0 ? (
          <EmptyState
            icon={<FiMapPin />}
            title="No sellers nearby just yet"
            description="We couldn't find sustainable products or services close to your location. New vendors join every week — try widening your search area or check back later."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {nearbyProducts?.data?.data?.map((product: any) => (
              <Product isMiles={true} key={product?.id} product={product} />
            ))}
          </div>
        )}

        {!nearbyProductsLoading && nearbyProducts?.data && (
          <div className="py-8">
            <PaginationControl
              currentPage={nearbyProducts.data.current_page}
              lastPage={nearbyProducts.data.last_page}
              onPageChange={setNearbyPage}
            />
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
