"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Camera } from "@/Components/Svg/SvgContainer";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAddReview } from "@/Hooks/api/dashboard_api";

type ReviewFormValues = {
  title: string;
  message: string;
  images: FileList;
};

const page = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params?.id);

  const { mutateAsync: addReviewMutation, isPending } = useAddReview(orderId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>();

  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setValue("images", files);

    const previewUrls = Array.from(files).map(file =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  };

  const onSubmit = async (data: ReviewFormValues) => {
    setError("");
    if (!rating) {
      setError("Please select a rating");
      return;
    }

    const formData = new FormData();
    formData.append("rating", String(rating));
    formData.append("title", data.title);
    formData.append("message", data.message);

    if (data?.images?.length) {
      Array.from(data.images).forEach(file => {
        formData.append("images[]", file);
      });
    }

    await addReviewMutation(formData);
  };

  return (
    <>
      <DashBoardHeader heading="Tell Us What You Think!" placeholder="Search" />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Rating */}
        <div className="my-7">
          <div className="flex gap-x-1">
            {[1, 2, 3, 4, 5].map(star => (
              <FaStar
                key={star}
                className={`size-[30px] cursor-pointer transition-all ${
                  (rating || hover) >= star ? "fill-amber-300" : "fill-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>

          {!rating && error && (
            <p className="text-red-500 text-sm mt-1">Rating is required</p>
          )}
        </div>

        {/* Title */}
        <div>
          <h4 className="text-[20px]">Add a headline (required)</h4>
          <input
            type="text"
            placeholder="Title your experience"
            className="border-2 py-3 px-4 rounded-[8px] w-full mt-3"
            {...register("title", {
              required: "Title is required",
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="my-8">
          <h4 className="text-[20px]">Leave a review</h4>
          <textarea
            {...register("message", {
              required: "Message is required",
            })}
            placeholder="What would you tell others?"
            className="border-2 p-4 rounded-[8px] w-full mt-3 h-[150px]"
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Images */}
        <div className="w-full mx-auto my-8">
          <label
            htmlFor="fileUpload"
            className="border border-dashed rounded-[8px] w-full h-[100px] flex items-center justify-center cursor-pointer"
          >
            {previews.length ? (
              <div className="flex gap-2">
                {previews?.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="preview"
                    className="size-20 object-cover rounded"
                  />
                ))}
              </div>
            ) : (
              <div className="flex gap-x-3 items-center text-gray-500">
                <Camera />
                <p>Share photos or videos</p>
              </div>
            )}
          </label>

          <input
            type="file"
            id="fileUpload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Submit */}
        <div className="mt-12 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="auth-secondary-btn w-[190px]"
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default page;
