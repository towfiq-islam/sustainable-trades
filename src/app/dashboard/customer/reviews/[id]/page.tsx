"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Camera } from "@/Components/Svg/SvgContainer";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";
import { useParams } from "next/navigation";
import Image from "next/image";

const ReviewDetails = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const params = useParams();
  const orderId = params.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };


  return (
    <>
      <DashBoardHeader heading="Tell Us What You Think!" placeholder="Search" />
      <div className="mt-10">
        <div className="">
          <div className="flex gap-x-1">
            {[1, 2, 3, 4, 5].map(star => (
              <FaStar
                key={star}
                className={`size-[30px] transition-all cursor-pointer 
              ${
                (rating || hover) >= star ? "fill-amber-300" : "fill-gray-300"
              }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>

          <div className="border rounded-lg p-5 mt-3 w-fit">
            {/* <Image
              src={product.productImage}
              alt={product.productName}
              height={117}
              width={115}
              unoptimized
            /> */}
            {/* <div className="flex flex-col gap-y-10">
              <h5 className="text-[20px] font-bold text-[#000]">
                {product.productName}
              </h5>
            </div> */}
          </div>
        </div>
      </div>
      <div className="my-10">
        <h4 className="text-[20px] text-[#13141D] font-normal">
          Leave a review
        </h4>
        <textarea
          placeholder="What would you tell others?"
          className="border-2 p-4 rounded-[8px] border-[#67645F] w-full mt-3 h-[150px] text-[#67645F] font-bold text-[16px]"
        ></textarea>
        <div className="w-full mx-auto my-8">
          <label
            htmlFor="fileUpload"
            className="border border-dashed border-[#67645F] rounded-[8px] w-full h-[100px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover object-center rounded-[8px]"
              />
            ) : (
              <div className="flex gap-x-3 items-center justify-center text-gray-500">
                <Camera />
                <p className="text-[#67645F] font-bold text-[16px] mt-1">
                  Share photos or videos
                </p>
              </div>
            )}
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="">
          <h4 className="text-[20px] text-[#13141D] font-normal">
            Add a headline (required)
          </h4>
          <textarea
            placeholder="Title your experience"
            className="border-2 py-5 px-4 flex items-center rounded-[8px] border-[#67645F] w-full text-[#67645F] font-bold text-[16px]"
          ></textarea>
        </div>
        <div className="mt-12 flex justify-end">
          <button className="auth-secondary-btn w-[190px]">Submit</button>
        </div>
      </div>
    </>
  );
};

export default ReviewDetails;