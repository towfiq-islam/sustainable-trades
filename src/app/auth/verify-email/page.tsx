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
          <h2 className="text-xl sm:text-2xl md:text-3xl  lg:text-4xl font-semibold text-secondary-black mb-5">
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
                <span>Verifying...</span>
              </div>
            ) : (
              "Get OTP"
            )}
          </button>
        </div>
      </form>
    </Container>
  );
};

export default page;
