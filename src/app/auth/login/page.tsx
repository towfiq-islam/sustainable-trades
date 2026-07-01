"use client";
import {
  AppleLogoSvg,
  FacebookLogoSvg,
  GoogleLogoSvg,
} from "@/Components/Svg/SvgContainer";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import loginBg from "@/Assets/login.png";
import { useForm } from "react-hook-form";
import { CgSpinnerTwo } from "react-icons/cg";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLoginMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";
import useAuth from "@/Hooks/useAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type formData = {
  email: string;
  password: string;
};

const Page = () => {
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [login, { isLoading }] = useLoginMutation();
  const { user } = useAuth();
  console.log(user)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    try {
      const res = await login(data).unwrap();

      if (
        res?.success &&
        (res?.data?.role === "customer" || res?.data?.membership)
      ) {
        setAuthenticated();
        toast.success(res?.message);
        // router.push(
        //   `${
        //     res?.data?.role === "customer"
        //       ? "/dashboard/customer/orders"
        //       : res?.data?.role === "vendor" &&
        //           res?.data?.membership?.membership_type === "pro"
        //         ? "/dashboard/pro/home"
        //         : "/dashboard/basic/home"
        //   }`,
        // );
      } else {
        setAuthenticated();
        toast.error("Please choose a plan");
        router.push(`/auth/create-shop?step=${5}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Login failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen max-h-screen flex">
      {/* Left - From */}
      <div className="flex-1 grid place-items-center">
        <div className="w-full  xl:w-[750px] mx-auto p-5 xl:p-10">
          {/* Back to home */}
          <div className="flex items-center gap-1 text-center mb-8 hover:underline">
            <IoArrowBackOutline className="text-primary-green" />
            <Link
              href="/"
              className="text-primary-green text-sm sm:text-base cursor-pointer font-semibold"
            >
              Back to home
            </Link>
          </div>

          <h2 className="auth-heading">Welcome Back!</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 xl:gap-8 sm:items-center">
              {/* Email */}
              <div className="flex-1">
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
              <div className="flex-1">
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
            </div>

            <div className="py-3 flex justify-between items-center">
              {/* Remember me */}
              <div className="flex gap-3 items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 size-5 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-secondary-black max-w-[550px] cursor-pointer"
                >
                  Remember Me
                </label>
              </div>

              {/* Forget Pass */}
              <Link
                href="/auth/verify-email"
                className="text-gray-500 underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit btn */}
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-1.5 sm:py-3 md:py-4 border-2 border-primary-green rounded-lg bg-primary-green text-accent-white font-semibold duration-500 transition-all hover:bg-transparent hover:text-primary-green md:text-lg block w-full ${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <p className="flex gap-2 items-center justify-center">
                  <CgSpinnerTwo className="animate-spin text-xl" />
                  <span>Signing in....</span>
                </p>
              ) : (
                " Sign In"
              )}
            </button>
          </form>

          <div className="flex gap-1 justify-center items-center md:text-lg text-secondary-black mt-7">
            <p>New Member?</p>
            <Link
              className="text-primary-green font-semibold underline"
              href="/auth/choose-package"
            >
              Create an account
            </Link>
          </div>

          <div className="my-7 flex gap-1 items-center text-gray-400 font-semibold">
            <div className="border-b border-gray-300 flex-1"></div>
            <div className="">OR</div>
            <div className="border-b border-gray-300 flex-1"></div>
          </div>

          {/* Social items */}
          <div className="flex justify-center items-center gap-4 md:gap-10">
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
      <div className="hidden lg:block flex-1 relative">
        <Image
          src={loginBg}
          alt="welcome_img"
          className="object-cover"
          fill
          unoptimized
          placeholder="blur"
        />
      </div>
    </section>
  );
};

export default Page;
