"use client";
import Container from "@/Components/Common/Container";
import { useVerifyEmailMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

type formData = {
  email: string;
};

const page = () => {
  // Mutation
  const router = useRouter();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  // Form Data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    try {
      const res: any = await verifyEmail(data).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        router.push(`/auth/verify-otp/${res?.data?.email}`);
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
          <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold text-secondary-black mb-5">
            Verify email address
          </h2>

          {/* Email Address */}
          <div className="mb-5">
            <input
              placeholder="Enter your email address"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="form-input"
            />
            {errors.email && (
              <span className="text-red-600 mt-1 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 sm:gap-4 items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="auth-primary-btn flex-1 text-center py-2.5 xl:py-3 !px-4 !rounded-lg text-sm sm:text-base font-medium xl:font-semibold"
            >
              Back
            </button>

            <button
              disabled={isLoading}
              type="submit"
              className={`flex-1 px-4 py-2.5 xl:py-3 border-2 border-primary-green rounded-lg bg-primary-green text-accent-white font-medium xl:font-semibold duration-500 transition-all hover:bg-transparent hover:text-primary-green text-sm sm:text-base text-center ${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <div className="flex gap-2 items-center justify-center">
                  <CgSpinnerTwo className="animate-spin text-xl" />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Get OTP"
              )}
            </button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default page;
