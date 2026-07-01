"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import shopBg from "@/Assets/shoppers.png";
import magicBg from "@/Assets/magic_markers.png";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AppleLogoSvg,
  FacebookLogoSvg,
  GoogleLogoSvg,
} from "@/Components/Svg/SvgContainer";
import { CgSpinnerTwo } from "react-icons/cg";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { useRegisterMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

type formData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  agree_to_terms: boolean;
};

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected_role = searchParams.get("role");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [registrationMutation, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>();

  const password = watch("password");

  const onSubmit = async (data: formData) => {
    const payload = {
      ...data,
      agree_to_terms: data.agree_to_terms ? 1 : 0,
      role: selected_role,
    };

    try {
      const res = await registrationMutation(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        router.push("/auth/login");
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <section className="min-h-screen max-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 grid place-items-center side-scrollbar ">
        <div className="w-full  xl:w-[750px] mx-auto p-5 xl:p-10">
          <h2 className="text-xl  md:text-2xl  lg:text-3xl xl:text-4xl font-semibold text-secondary-black mb-7">
            Welcome,
            <span className="text-primary-green">
              {selected_role === "magic_maker"
                ? "Magic Maker!"
                : "Sustainable Shopper!"}
            </span>
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First & Last Name */}
            <div className="flex flex-col sm:flex-row gap-4 xl:gap-8 sm:items-center">
              <div className="flex-1">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="First Name"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                />
                {errors.first_name?.message && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Last Name"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                />
                {errors.last_name?.message && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="info@gmail.com"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email?.message && (
                <p className="text-red-600 mt-1 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input !pe-10"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password?.message && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.password.message}
                  </p>
                )}
                <button
                  onClick={e => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute top-4 right-4 cursor-pointer"
                >
                  {showPassword ? (
                    <FiEye className="text-lg" />
                  ) : (
                    <FiEyeOff className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input !pe-10"
                  placeholder="Confirm Password"
                  {...register("password_confirmation", {
                    required: "Confirm Password is required",
                    validate: value =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.password_confirmation?.message && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.password_confirmation.message}
                  </p>
                )}
                <button
                  onClick={e => {
                    e.preventDefault();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  className="absolute top-4 right-4 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FiEye className="text-lg" />
                  ) : (
                    <FiEyeOff className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="py-3">
              <div className="flex gap-3 items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 size-5"
                  {...register("agree_to_terms", {
                    required: "You must agree to the terms and conditions",
                  })}
                />
                <label
                  htmlFor="terms"
                  className="text-secondary-black text-sm md:text-base  max-w-[550px]"
                >
                  By continuing you agree to Sustainable Trade’s Terms of Use
                  and Privacy Policy.
                  <Link
                    href="/help/terms-and-conditions"
                    target="_blank"
                    className="underline text-primary-green"
                  >
                    Terms and Conditions.
                  </Link>
                </label>
              </div>
              {errors.agree_to_terms?.message && (
                <p className="text-red-600 mt-1 text-sm">
                  {errors.agree_to_terms.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-1.5 sm:py-3 md:py-4 border-2 border-primary-green rounded-lg bg-primary-green text-accent-white md:font-semibold duration-500 transition-all hover:bg-transparent hover:text-primary-green text-sm md:text-lg block w-full ${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <p className="flex gap-2 items-center justify-center">
                  <CgSpinnerTwo className="animate-spin text-xl" />
                  <span>Please wait....</span>
                </p>
              ) : selected_role === "magic_maker" ? (
                " Join as Values-Aligned Entrepreneur"
              ) : (
                " Join as Organic Shopper"
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="flex gap-1 items-center md:text-lg text-secondary-black mt-3">
            <p>Already have an account?</p>
            <Link
              className="text-primary-green font-semibold underline"
              href="/auth/login"
            >
              Sign In
            </Link>
          </div>

          {/* Divider */}
          <div className="my-7 flex gap-1 items-center text-gray-400 font-semibold">
            <div className="border-b border-gray-300 flex-1"></div>
            <div>OR</div>
            <div className="border-b border-gray-300 flex-1"></div>
          </div>

          {/* Social buttons */}
          <div className="flex justify-center items-center gap-10">
            <button className="cursor-pointer">
              <FacebookLogoSvg />
            </button>
            <button className="cursor-pointer">
              <GoogleLogoSvg />
            </button>
            <button className="cursor-pointer">
              <AppleLogoSvg />
            </button>
          </div>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block  flex-1 relative">
        <Image
          src={selected_role === "magic_maker" ? shopBg : magicBg}
          alt="welcome_img"
          className="object-cover "
          fill
          unoptimized
          placeholder="blur"
        />
      </div>
    </section>
  );
}
