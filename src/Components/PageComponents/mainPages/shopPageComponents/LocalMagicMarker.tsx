"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { AiOutlineFileSearch } from "react-icons/ai";
import { LuFileQuestion } from "react-icons/lu";
import { getAllShopsClient } from "@/Hooks/api/cms_api";
import Container from "@/Components/Common/Container";
import { SearchSvg } from "@/Components/Svg/SvgContainer";
import { ShopListSkeleton } from "@/Components/Loader/Loader";
import ShopsMap from "@/Components/PageComponents/mainPages/shopPageComponents/ShopsMap";

type Props = {
  address: string;
};

const LocalMagicMarker = ({ address }: Props) => {
  // States
  const [searchShop, setSearchShop] = useState<string>(address);
  const [page, setPage] = useState<string>("");
  const [hoveredShop, setHoveredShop] = useState<any>(null);

  // Query
  const { data: shopData, isLoading: shopLoading } = getAllShopsClient(
    searchShop,
    page,
  );

  return (
    <section className="mt-10 mb-16">
      <Container>
        <div className="space-y-7">
          {/* Upper Part */}
          <div className="flex flex-col md:flex-row gap-2.5 md:gap-0 justify-between items-center">
            <h3 className="text-2xl lg:text-3xl font-semibold text-secondary-black">
              Find Your Local Magic Makers
            </h3>

            <div className="flex justify-end gap-1 items-center border border-primary-green px-2 py-2 rounded-[6px] w-full md:w-[350px]">
              <SearchSvg />
              <input
                type="text"
                onChange={e => setSearchShop(e.target.value)}
                placeholder="Denver, CO 80012"
                defaultValue={searchShop}
                className="w-full border-none outline-none"
              />
            </div>
          </div>

          {/* Lower Part */}
          <div className="grid lg:grid-cols-2 gap-5 border border-gray-100 rounded-lg p-3">
            {/* Left - Shop List */}
            {searchShop ? (
              <div className="space-y-2 md:h-[550px] overflow-y-auto">
                {shopLoading ? (
                  Array.from({ length: 7 }).map((_, idx) => (
                    <ShopListSkeleton key={idx} />
                  ))
                ) : shopData?.data?.length === 0 || !shopData ? (
                  <div className="text-gray-700 font-semibold text-lg text-center flex justify-center flex-col gap-2 items-center h-full p-2 lg:p-8 bg-[#d4e2cb2f]">
                    <LuFileQuestion className="text-5xl text-gray-600" />
                    No Shop Found
                  </div>
                ) : (
                  shopData?.data?.data?.map((item: any) => (
                    <Link
                      href={`/shop-details?view=${"customer"}&id=${
                        item?.shop_info?.user_id
                      }&listing_id=${item?.shop_info?.id}`}
                      key={item?.id}
                      className="flex gap-2.5 md:gap-5 md:items-center border-b last:border-b-0 border-gray-300 py-2 sm:py-3 cursor-pointer hover:bg-green-50"
                      onMouseEnter={() => setHoveredShop(item)}
                      onMouseLeave={() => setHoveredShop(null)}
                    >
                      <figure className="size-17 sm:size-22 shrink-0 rounded-lg relative">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.shop_info?.shop_image}`}
                          alt="shop_image"
                          fill
                          unoptimized
                          className="size-full object-cover rounded-lg"
                        />
                      </figure>

                      <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:items-center grow">
                        <div className="grow">
                          <h3 className="text-sm sm:text-lg font-semibold text-primary-green truncate">
                            {item?.shop_info?.shop_name}
                          </h3>

                          <div className="flex gap-1 items-center py-1.5 sm:py-2">
                            {Array.from({
                              length: +item?.shop_info?.avg_rating,
                            }).map((_, idx) => (
                              <FaStar
                                key={idx}
                                className="text-primary-green text-xs md:text-base"
                              />
                            ))}
                            {Array.from({
                              length: 5 - +item?.shop_info?.avg_rating,
                            }).map((_, index) => (
                              <FaRegStar
                                key={index}
                                className="text-primary-green text-sm"
                              />
                            ))}
                          </div>

                          <p className="text-secondary-gray font-semibold text-sm">
                            {item?.shop_info?.address?.display_my_address
                              ? item?.shop_info?.address?.address_line_1
                              : `${item?.shop_info?.address?.city}, ${item?.shop_info?.address?.state}`}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}

                {/* Pagination */}
                {!shopLoading && (
                  <div className="py-8 flex justify-center items-center gap-2 flex-wrap">
                    {shopData?.data?.links?.map((item: any, idx: number) => (
                      <button
                        key={idx}
                        disabled={!item.url}
                        dangerouslySetInnerHTML={{ __html: item.label }}
                        onClick={() =>
                          item.url && setPage(item.url.split("=")[1])
                        }
                        className={`px-3 py-1 rounded border transition-all duration-200 ${item.active ? "bg-primary-green text-white" : "bg-white text-gray-700"} ${!item.url ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-center h-full p-2 lg:p-8 bg-[#d4e2cb2f] rounded-xl">
                <h3 className="text-2xl lg:text-3xl font-semibold text-secondary-black mb-5">
                  Search to find your local magic makers
                </h3>
                <p className="text-secondary-black text-sm lg:text-lg mb-5">
                  Use our Geo-locator to find local food, businesses, artisans,
                  and services making a positive impact. Enter your zip code to
                  discover nearby offerings.
                </p>
                <AiOutlineFileSearch className="text-3xl lg:text-5xl" />
              </div>
            )}

            {/* Right - Google Map */}
            <div className="md:h-[550px]">
              {shopData?.data?.data && shopData?.data?.data?.length > 0 ? (
                <ShopsMap
                  shops={shopData?.data?.data}
                  hoveredShop={hoveredShop}
                  shopLoading={shopLoading}
                />
              ) : (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b54a1f5678ef%3A0x1234567890abcdef!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1691261744101!5m2!1sen!2sus"
                  loading="lazy"
                  className="h-full w-full border-0"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LocalMagicMarker;
