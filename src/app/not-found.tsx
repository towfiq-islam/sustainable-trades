"use client";
import dynamic from "next/dynamic";
import notFoundAnimation from "@/Assets/404.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-lg" />
  ),
});

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen text-2xl">
      <Lottie animationData={notFoundAnimation} loop={true} />
    </div>
  );
};


export default page;
