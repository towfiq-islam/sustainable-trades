"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import {
  DollarSvg,
  DThreeSvg,
  EditIconDarkSvg,
  EditIconSvg,
  LocationTwoSvg,
  StarSvg,
} from "@/Components/Svg/SvgContainer";
import Container from "@/Components/Common/Container";
import { ImSpinner9 } from "react-icons/im";
import {
  useUpdateShopBannerMutation,
  useUpdateShopPhotoMutation,
} from "@/redux/api/shopApi";
import { ShopBannerData } from "@/Types";

interface BannerProps {
  shop_id: number;
  data: ShopBannerData;
}

const EditShopBanner = ({ shop_id, data }: BannerProps) => {
  const bannerUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${data?.shop_info?.shop_banner}`;
  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${data?.shop_info?.shop_image}`;
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const [updateShopPhoto, { isLoading: profilePending }] =
    useUpdateShopPhotoMutation();
  const [updateShopBanner, { isLoading: bannerPending }] =
    useUpdateShopBannerMutation();

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewCover(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("shop_banner", file);
      updateShopBanner(formData).unwrap();
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewProfile(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("shop_image", file);
      updateShopPhoto(formData).unwrap();
    }
  };

  return (
    <section className="mb-8 sm:mb-12">
      {/* Shop Profile and Cover photo */}
      <div
        style={{
          backgroundImage: `url(${
            bannerPending ? "" : previewCover || bannerUrl
          })`,
        }}
        className={`h-[180px] sm:h-[240px] md:h-[290px] lg:h-[350px] bg-no-repeat bg-center bg-cover bg-black/50 bg-blend-overlay relative ${
          bannerPending && "animate-pulse"
        }`}
      >
        <Container>
          <div className="flex h-[180px] sm:h-[240px] md:h-[290px] lg:h-[350px] items-end relative">
            <label
              htmlFor="cover"
              aria-label="Edit cover photo"
              className="absolute top-4 sm:top-6 lg:top-10 right-2 sm:right-4 lg:right-0 bg-primary-green size-8 sm:size-10 cursor-pointer rounded-full grid place-items-center z-30 border border-gray-500 shadow hover:scale-105 transition-transform"
            >
              {bannerPending ? (
                <ImSpinner9 className="animate-spin text-white text-base sm:text-xl" />
              ) : (
                <div className="scale-75 sm:scale-100">
                  <EditIconDarkSvg />
                </div>
              )}
            </label>

            <input
              type="file"
              accept="image/*"
              id="cover"
              className="hidden"
              onChange={handleBannerChange}
            />

            <figure className="size-24 sm:size-32 md:size-[150px] lg:size-[180px] -mb-6 sm:-mb-8 lg:-mb-10 bg-gray-300 grid place-items-center rounded-full border-4 lg:border-[5px] border-white relative shrink-0 shadow-md">
              {!profilePending && (
                <label
                  htmlFor="profile"
                  aria-label="Edit profile photo"
                  className="absolute right-0 sm:right-1 lg:right-2 top-0 sm:top-1 bg-white size-7 sm:size-8 lg:size-10 cursor-pointer rounded-full grid place-items-center z-10 border border-gray-200 shadow-sm hover:scale-105 transition-transform"
                >
                  <div className="scale-75 sm:scale-90 lg:scale-100">
                    <EditIconSvg />
                  </div>
                </label>
              )}

              <input
                type="file"
                accept="image/*"
                id="profile"
                className="hidden"
                onChange={handleProfileChange}
              />

              {profilePending ? (
                <ImSpinner9 className="animate-spin text-3xl sm:text-5xl lg:text-6xl text-primary-blue" />
              ) : (
                <Image
                  src={previewProfile || profileUrl}
                  alt="shop_profile"
                  fill
                  className="object-cover rounded-full"
                />
              )}
            </figure>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-9 sm:mt-12 lg:mt-14 gap-5 sm:gap-6">
          {/* Left */}
          <div className="w-full md:w-auto">
            {/* Shop Name */}
            <div className="flex gap-4 sm:gap-6 items-center">
              <h3 className="text-secondary-black text-xl sm:text-2xl lg:text-3xl font-semibold break-words">
                {data?.shop_info?.shop_name}
              </h3>
            </div>

            {/* Location */}
            <div className="flex gap-2 sm:gap-3 items-center py-1.5 sm:py-2 lg:py-3.5">
              <span className="shrink-0">
                <LocationTwoSvg />
              </span>
              <p className="text-secondary-gray text-xs sm:text-sm lg:text-lg break-words">
                {data?.shop_info?.address?.display_my_address
                  ? data?.shop_info?.address?.address_line_1
                  : `${data?.shop_info?.address?.city}, ${data?.shop_info?.address?.state}`}
              </p>
            </div>

            {/* Counts & Actions */}
            <div className="flex flex-wrap gap-3 sm:gap-5 lg:gap-8 items-center text-xs sm:text-sm lg:text-base">
              <div className="flex gap-1.5 sm:gap-2 items-center">
                <p className="flex justify-center items-center size-6 sm:size-7 rounded-full bg-primary-green shrink-0">
                  <StarSvg />
                </p>
                <p className="text-secondary-black font-semibold">
                  {data?.rating_avg
                    ? Number(data.rating_avg).toFixed(1)
                    : "0.0"}
                </p>
              </div>

              <div className="flex gap-1.5 sm:gap-2 items-center">
                <p className="flex justify-center items-center size-6 sm:size-7 rounded-full bg-accent-red shrink-0">
                  <DollarSvg />
                </p>
                <p className="text-secondary-black font-semibold whitespace-nowrap">
                  {data?.shop_info?.order_count} Sales
                </p>
              </div>

              <div className="flex gap-1.5 sm:gap-2 items-center">
                <p className="flex justify-center items-center size-6 sm:size-7 rounded-full bg-off-green shrink-0">
                  <DThreeSvg />
                </p>
                <p className="text-secondary-black font-semibold whitespace-nowrap">
                  {data?.trade_offers_count} Trades
                </p>
              </div>

              <Link
                href={`/edit-my-shop/${shop_id}`}
                className="underline font-semibold text-primary-green duration-300 hover:scale-95 transition-transform whitespace-nowrap ml-1 sm:ml-0"
              >
                Edit Shop
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
            <div className="flex gap-4 sm:gap-5 items-center justify-between md:justify-end">
              <div className="text-left md:text-right">
                <h3 className="text-secondary-black font-semibold text-base sm:text-lg lg:text-xl mb-0.5 sm:mb-1">
                  {data?.first_name} {data?.last_name}
                </h3>
                <p className="text-secondary-gray text-xs sm:text-sm">
                  {data?.shop_info?.shop_name}
                </p>
              </div>
              <figure className="size-11 sm:size-14 shrink-0 rounded-full bg-accent-red grid place-items-center font-semibold text-base sm:text-lg text-white overflow-hidden relative shadow-sm">
                {data?.avatar ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.avatar}`}
                    alt="author"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <span>{data?.first_name?.at(0)}</span>
                )}
              </figure>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EditShopBanner;
