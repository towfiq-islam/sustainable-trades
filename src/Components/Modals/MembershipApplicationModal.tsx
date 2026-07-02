"use client";
import { useApplySpotlightMutation } from "@/redux/api/shopApi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

type formData = {
  name: string;
  image: string;
  shop_name: string;
  shop_description: string;
  sustainability_important: string;
  what_impact: string;
  community_engagement: string;
};

const MembershipApplicationModal = ({ setOpen }: any) => {
  const [applySpotlight, { isLoading: isPending }] =
    useApplySpotlightMutation();
  const [imageFile, setImageFile] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("shop_name", data.shop_name);
    formData.append("shop_description", data.shop_description);
    formData.append("sustainability_important", data.sustainability_important);
    formData.append("what_impact", data.what_impact);
    formData.append("community_engagement", data.community_engagement);
    formData.append("image", data.image[0]);

    try {
      const res = await applySpotlight(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        setOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="p-5 ">
      <h2 className="md:text-xl text-lg xl:text-2xl font-semibold text-secondary-black mb-5">
        Membership Spotlight Application
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="form-label  text-sm md:text-base">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Jane Doe"
            {...register("name", { required: "Full Name is required" })}
            className="form-input"
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        {/* Upload Photo */}
        <div>
          <label className="form-label text-sm md:text-base mb-2">
            Upload Photo or Logo
          </label>
          <div>
            <label
              htmlFor="upload_photo"
              className="border border-secondary-black block w-full hover:bg-gray-50 duration-200 transition-all rounded-[5px] text-center cursor-pointer md:py-3 py-1.5 lg:py-6"
            >
              <p className="text-gray-500 text-sm md:text-base">
                Click to upload photo
              </p>

              <input
                type="file"
                className="hidden"
                id="upload_photo"
                accept="image/*"
                {...register("image", {
                  required: "Photo is required",
                  onChange: e => {
                    const file = e.target.files[0].name;
                    if (file) {
                      setImageFile(file);
                    }
                  },
                })}
              />
            </label>
            {errors.image && (
              <p className="form-error">{errors.image.message}</p>
            )}
            {imageFile && (
              <p className="text-sm text-green-500 mt-1.5">{imageFile}</p>
            )}
          </div>
        </div>

        {/* Business/Shop Name */}
        <div>
          <label
            htmlFor="shop_name"
            className="form-label text-sm md:text-base"
          >
            Business/Shop Name
          </label>
          <input
            type="text"
            id="shop_name"
            placeholder="Business name here"
            {...register("shop_name", {
              required: "Business Name is required",
            })}
            className="form-input"
          />
          {errors.shop_name && (
            <span className="form-error">{errors.shop_name.message}</span>
          )}
        </div>

        {/* Business/Shop Description */}
        <div>
          <label
            htmlFor="shop_description"
            className="form-label text-sm md:text-base"
          >
            Business/Shop Description
          </label>
          <textarea
            id="shop_description"
            className={`md:h-20 form-input`}
            placeholder="Write a short description"
            {...register("shop_description", {
              required: "Shop Description is required",
              maxLength: {
                value: 600,
                message: "Description cannot exceed 600 characters",
              },
            })}
          ></textarea>
          {errors.shop_description && (
            <span className="form-error">
              {errors.shop_description.message}
            </span>
          )}
        </div>

        {/* Why important */}
        <div>
          <label
            htmlFor="why_important"
            className="form-label text-sm md:text-base"
          >
            Why is sustainability important to you and how do you practice it?
          </label>
          <textarea
            id="why_important"
            className={`md:h-20 form-input`}
            placeholder="Write 2-3 lines"
            {...register("sustainability_important")}
          ></textarea>
        </div>

        {/* What Impact */}
        <div>
          <label
            htmlFor="what_impact"
            className="form-label text-sm md:text-base"
          >
            What impact does your business have on the community?
          </label>
          <textarea
            id="what_impact"
            className={`md:h-20 form-input`}
            placeholder="Write 2-3 lines"
            {...register("what_impact")}
          ></textarea>
        </div>

        {/* What Type */}
        <div>
          <label
            htmlFor="what_type"
            className="form-label text-sm md:text-base"
          >
            What types of community engagement are you involved in?
          </label>
          <textarea
            id="what_type"
            className={`h-auto md:h-20 form-input`}
            placeholder="Write 2-3 lines"
            {...register("community_engagement")}
          ></textarea>
        </div>

        {/* Submit btn */}
        <div className="flex justify-end">
          <button
            disabled={isPending}
            className={`text-accent-white bg-primary-green font-semibold px-10 py-1 md:py-2.5 rounded-lg duration-300 border-2 border-primary-green hover:bg-transparent hover:text-primary-green transition-all shadow ${
              isPending ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isPending ? (
              <span className="flex gap-2 items-center justify-center">
                <CgSpinnerTwo className="animate-spin" />
                <span>Submitting...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MembershipApplicationModal;
