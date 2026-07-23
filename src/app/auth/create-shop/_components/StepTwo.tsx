"use client";
import React from "react";
import { Camera } from "@/Components/Svg/SvgContainer";
import { useFormContext, Controller } from "react-hook-form";

const StepTwo = ({ step, setStep, totalSteps }: any) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    register,
  } = useFormContext();
  const shopPhotoPreview = watch("shopPhotoPreview");
  const coverPhotoPreview = watch("coverPhotoPreview");

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    previewField: "shopPhotoPreview" | "coverPhotoPreview",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue(previewField, reader.result as string, {
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="lg:mt-16 mt-5">
      <h2 className="auth_title">Your Shop</h2>

      {/* Shop Info */}
      <div className="border border-accent-gray rounded-[20px] lg:my-[56px] my-6 xl:p-20 p-10">
        <div className="mt-5 grid lg:grid-cols-2 grid-cols-1 xl:gap-x-[96px] gap-x-10 items-center lg:gap-y-10 gap-y-5 font-lato">
          {/* Shop Name */}
          <div>
            <p className="form-label">
              Name Your Shop <span>*</span>
            </p>
            <input
              type="text"
              className="form-input"
              placeholder="Name Your Shop *"
              {...register("shop_name", {
                required: "Shop name is required",
                minLength: { value: 4, message: "Minimum 4 characters" },
                maxLength: { value: 30, message: "Maximum 30 characters" },
                pattern: {
                  value: /^[A-Za-z0-9 ]+$/,
                  message: "Only letters, numbers, and spaces allowed",
                },
              })}
            />
            {errors.shop_name && (
              <p className="text-red-600 text-sm pt-1">
                {errors.shop_name.message as string}
              </p>
            )}

            <ul className="mt-[2px] text-[16px] text-secondary-gray ml-5">
              <li className="list-disc">Between 4-30 characters</li>
              <li className="list-disc">
                No special characters, spaces, or accented letters
              </li>
            </ul>
          </div>

          <h5 className="text-[16px] text-secondary-gray">
            Can be your personal name/nickname or company name.  When a trade is
            offered, this is the name that will show to others.
          </h5>

          {/* City State */}
          {/* <div>
            <p className="form-label">City State *</p>
            <input
              type="text"
              className="form-input"
              placeholder="City, State"
              {...register("shop_city", {
                required: "City and State are required",
              })}
            />
            {errors.shop_city && (
              <p className="text-red-600">
                {errors.shop_city.message as string}
              </p>
            )}
          </div> */}

          {/* <h5 className="text-[16px] text-secondary-gray">
            This is so you show up in your local area on our Geo-locator map.
            More info about this
          </h5> */}
        </div>
      </div>

      <div className="border border-accent-gray rounded-[20px] mt-8 mb-[56px] xl:p-20 p-5 py-10">
        <div className="lg:flex gap-x-8">
          {/* Shop Photo */}
          <div>
            <p className="text-[18px] text-secondary-black font-lato lg:text-start text-center">
              Add A Profile Photo{" "}
              <span className="text-red-600 text-xl">*</span>
            </p>

            <div
              className="relative bg-[#F0EEE9] sm:h-[270px] sm:w-[270px] w-[220px] h-[220px] rounded-full mt-6 flex flex-col justify-center items-center cursor-pointer overflow-hidden md:mx-start mx-auto"
              onClick={() => document.getElementById("shopPhotoInput")?.click()}
            >
              {shopPhotoPreview ? (
                <>
                  <img
                    src={shopPhotoPreview}
                    alt="Shop Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 bg-opacity-40 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                    <Camera />
                  </div>
                </>
              ) : (
                <>
                  <Camera />
                  <p>Add Photo</p>
                </>
              )}
            </div>

            <Controller
              name="shop_image"
              control={control}
              rules={{ required: "Shop profile photo is required" }}
              render={({ field }) => (
                <>
                  <input
                    type="file"
                    id="shopPhotoInput"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file);
                      handleImageChange(e, "shopPhotoPreview");
                    }}
                  />
                  {errors.shop_image && (
                    <p className="text-red-600 text-center text-sm pt-2">
                      {errors.shop_image.message as string}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Cover Photo */}
          <div className="w-full lg:mt-0 mt-10">
            <p className="text-[18px] text-secondary-black font-lato lg:text-start text-center">
              Add A Shop Banner <span className="text-red-600 text-xl">*</span>
            </p>

            <div
              className="relative bg-[#F0EEE9] h-[270px] w-full rounded-[8px] mt-6 flex flex-col justify-center items-center cursor-pointer overflow-hidden"
              onClick={() =>
                document.getElementById("coverPhotoInput")?.click()
              }
            >
              {coverPhotoPreview ? (
                <>
                  <img
                    src={coverPhotoPreview}
                    alt="Cover Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 bg-opacity-40 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[8px]">
                    <Camera />
                  </div>
                </>
              ) : (
                <>
                  <Camera />
                  <p>Add Photo</p>
                </>
              )}
            </div>
            <Controller
              name="shop_banner"
              control={control}
              rules={{ required: "Cover photo is required" }}
              render={({ field }) => (
                <>
                  <input
                    type="file"
                    id="coverPhotoInput"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file);
                      handleImageChange(e, "coverPhotoPreview");
                    }}
                  />
                  {errors.shop_banner && (
                    <p className="text-red-600 text-sm pt-2">
                      {errors.shop_banner.message as string}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="md:flex justify-between items-center">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="auth-primary-btn w-full md:w-fit"
        >
          Back
        </button>

        <button
          type="submit"
          className="auth-secondary-btn md:mt-0 mt-3 w-full md:w-fit"
        >
          {step < totalSteps ? "Save and Continue" : "Submit"}
        </button>
      </div>
    </section>
  );
};

export default StepTwo;
