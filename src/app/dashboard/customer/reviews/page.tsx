"use client";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";
import { testimonial } from "@/Components/Data/data";
import Image from "next/image";

const Review = () => {
  return (
    <>
      <DashBoardHeader heading="Your Reviews" placeholder="Search" />
      <div className="my-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {testimonial.map(item => (
          <div
            key={item.id}
            className="border rounded-xl p-6 shadow-md bg-white flex flex-col items-center text-center"
          >
            <Image
              src={item.avatar}
              unoptimized
              alt={"ProductImage"}
              className="w-16 h-16 rounded-full mb-4"
            />

            <h3 className="text-lg font-semibold">
              {item.type === "product" ? item.productName : item.shopName}
            </h3>

            <p className="text-sm text-gray-500">
              {item.type === "product" ? "Product Review" : "Shop Review"} •{" "}
              {item.date}
            </p>

            <p className="mt-3 text-gray-700 italic">“{item.review}”</p>
            <div className="mt-3 text-yellow-500">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Review;
