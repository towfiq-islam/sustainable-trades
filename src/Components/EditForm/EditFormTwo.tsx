"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Camera } from "@/Components/Svg/SvgContainer";
import { useFormContext, Controller } from "react-hook-form";

const EditFormTwo = ({ data }: any) => {
  const [shopProfilePreview, setShopProfilePreview] = useState<any>(null);
  const [shopCoverPreview, setShopCoverPreview] = useState<any>(null);

  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<any>();

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileField: "shop_image" | "shop_banner",
  ) => {
    const file: File | null = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setValue(fileField, file);
    }
    if (fileField === "shop_image") {
      setShopProfilePreview(URL.createObjectURL(file as any));
    }
    if (fileField === "shop_banner") {
      setShopCoverPreview(URL.createObjectURL(file as any));
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-primary-green text-[20px] font-semibold">
        Your Shop
      </h2>

      <div className="lg:mt-12 mt-5 grid lg:grid-cols-2 grid-cols-1 gap-x-[96px] items-center lg:gap-y-10 gap-y-5 font-lato">
        {/* Shop Name */}
        <div>
          <p className="form-label">Name Your Shop *</p>
          <input
            type="text"
            {...register("shop_name")}
            defaultValue={data?.shop_info?.shop_name}
            className="form-input"
            placeholder="Name Your Shop *"
          />
          <p className="text-red-600 mt-2">
            {errors.shop_name ? String(errors.shop_name?.message) : null}
          </p>

          <ul className="mt-[2px] text-[16px] text-secondary-gray ml-5">
            <li className="list-disc">Between 4-30 characters</li>
            <li className="list-disc">
              No special characters, spaces, or accented letters
            </li>
          </ul>
        </div>
        <h5 className="text-[16px] text-secondary-gray">
          Can be your personal name/nickname or company name. When a trade is
          offered, this is the name that will show to others.
        </h5>

        {/* City/State */}
        <div>
          <p className="form-label">City State *</p>
          <input
            type="text"
            {...register("shop_city")}
            className="form-input"
            placeholder="City, State"
            defaultValue={data?.shop_info?.address?.city}
          />
          <p className="text-red-600">
            {errors.shop_city ? String(errors.shop_city.message) : null}
          </p>
        </div>
        <h5 className="text-[16px] text-secondary-gray">
          This is so you show up in your local area on our Geo-locator map.{" "}
          <span className="underline">More info about this</span>
        </h5>
      </div>

      <div className=" mt-8 mb-[56px] lg:flex gap-x-8">
        {/* Shop Photo */}
        <div>
          <p className="text-[18px] text-secondary-black font-lato">
            Add A Profile Photo *
          </p>

          <div
            className="relative bg-[#F0EEE9] h-[270px] w-[270px] lg:mx-0 mx-auto rounded-full mt-6 flex flex-col justify-center items-center cursor-pointer overflow-hidden"
            onClick={() => document.getElementById("shopPhotoInput")?.click()}
          >
            {shopProfilePreview ? (
              <div>
                <Image
                  src={shopProfilePreview}
                  alt="Shop Preview"
                  fill
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                  <Camera />
                </div>
              </div>
            ) : (
              <div>
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.shop_info?.shop_image}`}
                  alt="Shop Preview"
                  fill
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                  <Camera />
                </div>
              </div>
            )}
          </div>

          <Controller
            name="shop_image"
            control={control}
            render={() => (
              <>
                <input
                  type="file"
                  id="shopPhotoInput"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    handleImageChange(e, "shop_image");
                  }}
                />
                <p className="text-red-600 mt-2">
                  {errors.shop_image ? String(errors.shop_image.message) : null}
                </p>
              </>
            )}
          />
          <h5 className="text-center text-[#67645F] text-[16px] mt-2">
            Max file size: 10 MB
          </h5>
        </div>

        {/* Cover Photo */}
        <div className="w-full">
          <p className="text-[18px] text-secondary-black font-lato">
            Add A Cover Photo *
          </p>
          <div
            className="relative bg-[#F0EEE9] h-[270px] w-full rounded-[8px] mt-6 flex flex-col justify-center items-center cursor-pointer overflow-hidden"
            onClick={() => document.getElementById("coverPhotoInput")?.click()}
          >
            {shopCoverPreview ? (
              <div>
                <Image
                  src={shopCoverPreview}
                  alt="Cover Preview"
                  fill
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[8px]">
                  <Camera />
                </div>
              </div>
            ) : (
              <div>
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.shop_info?.shop_banner}`}
                  alt="Cover Preview"
                  fill
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[8px]">
                  <Camera />
                </div>
              </div>
            )}
          </div>

          <Controller
            name="shop_banner"
            control={control}
            render={() => (
              <>
                <input
                  type="file"
                  id="coverPhotoInput"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageChange(e, "shop_banner")}
                />
                <p className="text-red-600 mt-2">
                  {errors.shop_banner
                    ? String(errors.shop_banner.message)
                    : null}
                </p>
              </>
            )}
          />
          <h5 className="text-center text-[#67645F] text-[16px] mt-2">
            Max file size: 10 MB
          </h5>
        </div>
      </div>
    </div>
  );
};

export default EditFormTwo;
