"use client";
import Lottie from "lottie-react";
import emptyAnimation from "@/Assets/cart.json";

const EmptyCartAnimation = () => (
  <div className="w-40 md:w-48 lg:w-54 mx-auto">
    <Lottie animationData={emptyAnimation} loop={true} autoplay={true} />
  </div>
);

export default EmptyCartAnimation;
