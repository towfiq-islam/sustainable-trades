"use client";
import { useState } from "react";
import { LuEye } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { CgSpinnerTwo } from "react-icons/cg";
import { FaRegEyeSlash } from "react-icons/fa6";
import Container from "@/Components/Common/Container";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

type formData = {
  password: string;
  password_confirmation: string;
};

const page = () => {
  // Mutation
  const router = useRouter();
  const { email } = useParams();
  const [passwordReset, { isLoading }] = useResetPasswordMutation();

  // States
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Form Data
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>();

  const password = watch("password");

  const onSubmit = async (data: formData) => {
    const payload = { email: decodeURIComponent(email as string), ...data };
    try {
      const res = await passwordReset(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        router.push("/auth/login");
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-h-screen flex items-center justify-center"
      >
        <div className="w-full sm:w-[450px]">
          <h2 className="text-xl sm:text-2xl  md:text-3xl  lg:text-4xl font-semibold text-secondary-black mb-5 text-center">
            Reset password
          </h2>

          <div className="flex flex-col gap-y-5 3xl:gap-y-7">
            {/* New Password */}
            <div className="relative">
              <input
                placeholder="Create New Password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "New Password is required",
                })}
                className="form-input !pr-8 md:!pr-10 lg:!pr-14"
              />
              {errors.password && (
                <span className="text-red-600 mt-1 text-sm">
                  {errors.password.message}
                </span>
              )}
              <button
                className="absolute top-2.5 md:top-3.5 lg:top-5 right-2 md:right-3 lg:right-5 cursor-pointer"
                onClick={e => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <LuEye className="text-lg lg:text-2xl text-gray-500" />
                ) : (
                  <FaRegEyeSlash className="text-lg lg:text-2xl text-gray-500" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                placeholder="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("password_confirmation", {
                  required: "Confirm Password is required",
                  validate: value =>
                    value === password || "Passwords do not match",
                })}
                className="form-input !pr-8 md:!pr-10 lg:!pr-14"
              />
              {errors.password_confirmation && (
                <span className="text-red-600 mt-1 text-sm">
                  {errors.password_confirmation.message}
                </span>
              )}
              <button
                className="absolute top-2.5 md:top-3.5 lg:top-5 right-2 md:right-3 lg:right-5 cursor-pointer"
                onClick={e => {
                  e.preventDefault();
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              >
                {showConfirmPassword ? (
                  <LuEye className="text-lg lg:text-2xl text-gray-500" />
                ) : (
                  <FaRegEyeSlash className="text-lg lg:text-2xl text-gray-500" />
                )}
              </button>
            </div>

            {/* Submit btn */}
            <button
              disabled={isLoading}
              type="submit"
              className={`px-10 sm:py-3 border-2 border-primary-green rounded-lg bg-primary-green text-accent-white font-semibold duration-500 transition-all hover:bg-transparent hover:text-primary-green md:text-lg block w-full ${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <div className="flex gap-2 items-center justify-center">
                  <CgSpinnerTwo className="animate-spin text-xl" />
                  <span>Changing...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default page;
