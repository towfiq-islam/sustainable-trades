"use client";
import dynamic from "next/dynamic";

const Product = dynamic(() => import("./Product"), {
  loading: () => (
    <div className="rounded-t-lg relative animate-pulse">
      <div className="w-full h-[200px] rounded-lg bg-gray-200 border border-gray-100" />
      <div className="flex justify-between items-center mt-4">
        <div className="h-5 w-2/3 bg-gray-200 rounded" />
        <div className="size-6 rounded-full bg-gray-200" />
      </div>
      <div className="flex justify-between mt-3 items-center">
        <div className="h-9 w-28 sm:w-32 bg-gray-200 rounded-[5px]" />
      </div>
    </div>
  ),
  ssr: false,
});

export default Product;
