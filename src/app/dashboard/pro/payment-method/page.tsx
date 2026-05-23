"use client";
import { Paypal } from "@/Components/Svg/SvgContainer";
import {
  useDisconnectOnboarding,
  useOnboarding,
  useReconnectOnboarding,
} from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import { CgSpinnerTwo } from "react-icons/cg";

const page = () => {
  const { user } = useAuth();
  const isOnboarded = user?.onboarded;

  // Connect
  const { mutate: onboardingConnectMutation, isPending: isConnecting } =
    useOnboarding();

  // Disconnect
  const { mutate: onboardingDisconnectMutation, isPending: isDisconnecting } =
    useDisconnectOnboarding();

  // Reconnect
  const { mutate: onboardingReconnectMutation, isPending: isReconnecting } =
    useReconnectOnboarding();

  // CONNECT
  const handleConnect = () => {
    onboardingConnectMutation(
      {
        success_url: `${window.location.origin}/dashboard/pro/payment-method`,
        cancel_url: `${window.location.origin}/dashboard/pro/payment-method`,
      },
      {
        onSuccess: (data: any) => {
          if (data?.success) {
            window.location.href = data?.data?.url;
          }
        },
      },
    );
  };

  // DISCONNECT
  const handleDisconnect = () => {
    onboardingDisconnectMutation(undefined, {
      onSuccess: () => {
        console.log("Disconnected successfully");
      },
    });
  };

  // RECONNECT
  const handleReconnect = () => {
    onboardingReconnectMutation(
      {
        success_url: `${window.location.origin}/dashboard/pro/payment-method`,
        cancel_url: `${window.location.origin}/dashboard/pro/payment-method`,
      },
      {
        onSuccess: (data: any) => {
          if (data?.success) {
            window.location.href = data?.data?.url;
          }
        },
      },
    );
  };

  return (
    <>
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000]">
        Store Payments
      </h2>

      <h5 className="text-[15px] md:text-[20px] text-[#3D4145] font-normal pt-4">
        Connect and manage how you'd like to receive
        <br />
        payments from buyers.
      </h5>

      <div className="mt-9 md:mt-10 border border-[#BFBEBE] rounded-[10px] p-6 w-full max-w-[480px]">
        <Paypal />
        <p className="font-normal text-[14px] md:text-[16px] text-[#3D4145]  pt-2">
          Customers can check out from your store with a PayPal or Venmo Account
        </p>

        <div className="flex gap-4 items-center flex-wrap">
          {/* CONNECT BUTTON */}
          {!isOnboarded && (
            <button
              disabled={isConnecting}
              onClick={handleConnect}
              className="mt-5 md:mt-10 p-2 md:p-3 border border-[#274F45] rounded-md text-[12px] md:text-[14px] font-semibold text-[#274F45] enabled:hover:text-white enabled:hover:bg-[#274F45] duration-500 ease-in-out uppercase disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer min-w-[130px]"
            >
              {isConnecting ? (
                <p className="flex gap-2 items-center justify-center">
                  <CgSpinnerTwo className="animate-spin text-xl" />
                  <span>Please wait...</span>
                </p>
              ) : (
                "Connect"
              )}
            </button>
          )}

          {/* DISCONNECT BUTTON */}
          {isOnboarded && (
            <button
              disabled={isDisconnecting}
              onClick={handleDisconnect}
              className="mt-5 md:mt-10 p-2 md:p-3 border border-red-500 rounded-md text-[12px] md:text-[14px] font-semibold text-red-500 enabled:hover:text-white enabled:hover:bg-red-500 duration-500 ease-in-out uppercase disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer min-w-[130px]"
            >
              {isDisconnecting ? (
                <p className="flex gap-2 items-center justify-center">
                  <CgSpinnerTwo className="animate-spin text-xl" />
                  <span>Please wait...</span>
                </p>
              ) : (
                "Disconnect"
              )}
            </button>
          )}

          {/* RECONNECT BUTTON */}
          {isOnboarded && (
            <button
              disabled={isReconnecting}
              onClick={handleReconnect}
              className="mt-5 md:mt-10 p-2 md:p-3 bg-[#274F45] border border-[#274F45] rounded-md text-[12px] md:text-[14px] font-semibold text-white enabled:hover:opacity-90 duration-500 ease-in-out uppercase disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer min-w-[130px]"
            >
              {isReconnecting ? (
                <p className="flex gap-2 items-center justify-center">
                  <CgSpinnerTwo className="animate-spin text-xl" />
                  <span>Please wait...</span>
                </p>
              ) : (
                "Reconnect"
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
