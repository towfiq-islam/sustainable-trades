"use client";
import { Paypal } from "@/Components/Svg/SvgContainer";
import { useOnboarding } from "@/Hooks/api/dashboard_api";
import { CgSpinnerTwo } from "react-icons/cg";

const page = () => {
  const { mutate: onboardingMutation, isPending } = useOnboarding();

  const handleOnboarding = () => {
    onboardingMutation(
      {},
      {
        onSuccess: (data: any) => {
          if (data?.success) {
            window.location.href = data?.data?.url;
          }
        },
      }
    );
  };

  return (
    <>
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000]">
        Store Payments
      </h2>

      <h5 className="text-[15px] md:text-[20px] text-[#3D4145] font-normal pt-4">
        Connect and manage how you'd like to receive
        <br /> payments from buyers.
      </h5>

      <div className="mt-9 md:mt-10 border border-[#BFBEBE] rounded-[10px] p-6 w-full max-w-[480px]">
        <Paypal />
        <p className="font-normal text-[14px] md:text-[16px] text-[#3D4145]  pt-2">
          Customers can check out from your store with a PayPal or Venmo Account
        </p>

        <button
          disabled={isPending}
          onClick={handleOnboarding}
          className={`mt-5 md:mt-10 p-2 md:p-3 border border-[#274F45] rounded-md text-[12px] md:text-[14px] font-semibold text-[#274F45] hover:text-white hover:bg-[#274F45] duration-500 ease-in-out uppercase ${
            isPending ? "cursor-not-allowed opacity-80" : "cursor-pointer"
          }`}
        >
          {isPending ? (
            <p className="flex gap-2 items-center justify-center">
              <CgSpinnerTwo className="animate-spin text-xl" />
              <span>Please wait....</span>
            </p>
          ) : (
            "Manage"
          )}
        </button>
      </div>
    </>
  );
};

export default page;
