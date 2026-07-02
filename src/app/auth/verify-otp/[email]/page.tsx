"use client";
import Container from "@/Components/Common/Container";
import { useVerifyOTPMutation } from "@/redux/api/authApi";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";
import OTPInput from "react-otp-input";

type formData = {
  otp: string;
};

const page = () => {
  // Hook
  const router = useRouter();
  const { email } = useParams();

  // Mutations
  const [verifyOtp, { isLoading }] = useVerifyOTPMutation();

  // Form Data
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    const payload = { email: decodeURIComponent(email as string), ...data };

    try {
      const res: any = await verifyOtp(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        router.push(`/auth/reset-password/${res?.data?.email}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-h-screen flex items-center justify-center text-center"
      >
        <div className="w-full sm:w-[450px] gap-y-5 md:gap-y-7 3xl:gap-y-10">
          <h2 className="text-xl sm:text-2xl  md:text-3xl  lg:text-4xl font-semibold text-secondary-black mb-5 text-center">
            Verify your otp
          </h2>

          <p className="text-center text-sm lg:text-base text-gray-600 mb-5 max-w-[500px] mx-auto">
            Enter the OTP code that we sent to your email{" "}
            {decodeURIComponent(email as string)}, Be careful not to share code
            with anyone.
          </p>

          {/* OTP Input */}
          <div className="my-10">
            <Controller
              name="otp"
              control={control}
              rules={{
                required: "OTP is required",
                minLength: { value: 4, message: "OTP must be 4 digits" },
              }}
              render={({ field }) => (
                <OTPInput
                  {...field}
                  value={field.value || ""}
                  onChange={field.onChange}
                  numInputs={4}
                  renderInput={(props: any) => <input {...props} />}
                  containerStyle={"flex items-center justify-center"}
                  inputStyle={`mx-auto !w-[50px] md:!w-[90px] !h-[50px] md:!h-[70px] border border-primary-green md:rounded-[12px] !bg-plan-card rounded-[8px] text-lg md:text-xl font-medium text-primary-green bg-[linear-gradient(90deg,_rgba(33,72,159,0.15)_0%,_rgb(39, 79, 69)_100%)]`}
                />
              )}
            />
            {errors.otp && (
              <p className="text-red-600 mt-2 text-sm">{errors.otp.message}</p>
            )}
          </div>

          {/* Verify OTP btn */}
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
              "Verify OTP"
            )}
          </button>
        </div>
      </form>
    </Container>
  );
};

export default page;
