"use client";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoLink } from "react-icons/io5";
import Container from "@/Components/Common/Container";
import { getFeaturedShops } from "@/Hooks/api/cms_api";
import { ShopCardSkeleton } from "@/Components/Loader/Loader";

type FeaturedItem = {
  id: number;
  shop_info: {
    id: number;
    user_id: number;
    shop_image: string;
    shop_name: string;
    avg_rating: number;
    address: {
      address_line_1: string;
      display_my_address: string;
      address_10_mile: string;
      city: string;
      state: string;
    };
  };
};

const FeaturedShops = () => {
  const { latitude, longitude } = useAuth();
  const { data: featuredData, isLoading } = getFeaturedShops(
    latitude,
    longitude
  );

  return (
    <section className="mt-50 md:mt-0 py-20">
      <Container>
        {/* Title */}
        <h3 className="section_title md:text-start text-center ">
          Featured Shops
        </h3>

        {/* Shops */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {isLoading ? (
            [...Array(4)].map((_, idx) => <ShopCardSkeleton key={idx} />)
          ) : featuredData?.data?.length > 0 ? (
            featuredData?.data?.map(({ id, shop_info }: FeaturedItem) => (
              <Link
                href={`/shop-details?view=${"customer"}&id=${
                  shop_info?.user_id
                }&listing_id=${shop_info?.id}`}
                key={id}
                className="text-center space-y-1.5"
              >
                {/* Shop Image */}
                <figure className="size-30 xl:size-64 mx-auto cursor-pointer rounded-full border border-gray-100 group relative">
                  <div className="absolute bg-black/50 size-full rounded-full inset-0 opacity-0 duration-500 transition-all group-hover:opacity-100 flex justify-center items-center group-hover:backdrop-blur-[1px]">
                    <IoLink className="text-white text-2xl" />
                  </div>

                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${shop_info?.shop_image}`}
                    alt="shop_image"
                    fill
                    unoptimized
                    className="size-full rounded-full object-cover"
                  />
                </figure>

                {/* Shop Name */}
                <h3 className="mt-4 text-sm md:text-xl font-semibold text-primary-green">
                  {shop_info?.shop_name}
                </h3>

                {/* Shop Reviews */}
                <div className="flex gap-2 items-center justify-center">
                  <div className="flex gap-1 items-center justify-center">
                    {Array.from({ length: +shop_info?.avg_rating }).map(
                      (_, idx) => (
                        <FaStar
                          key={idx}
                          className="text-primary-green text-xs md:text-base"
                        />
                      )
                    )}
                    {Array.from({ length: 5 - +shop_info?.avg_rating }).map(
                      (_, index) => (
                        <FaRegStar
                          key={index}
                          className="text-primary-green text-sm"
                        />
                      )
                    )}
                  </div>
                  <p className="text-sm font-semibold text-secondary-black">
                    ({shop_info?.avg_rating})
                  </p>
                </div>

                {/* Shop Address */}
                <h4 className="text-secondary-black text-xs md:text-[15px]">
                  {shop_info?.address?.display_my_address
                    ? shop_info?.address?.address_line_1
                    : `${shop_info?.address?.city}, ${shop_info?.address?.state}`}
                </h4>
              </Link>
            ))
          ) : (
            <p className="text-lg font-semibold text-red-500">
              No featured shop found
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedShops;
