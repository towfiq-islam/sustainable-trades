"use client";
import { Paypal } from "@/Components/Svg/SvgContainer";
import useAuth from "@/Hooks/useAuth";
import {
  useDisconnectPaypalMutation,
  useOnboardPaypalMutation,
  useReconnectPaypalMutation,
} from "@/redux/api/vendorApi";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

const page = () => {
  const { user } = useAuth();
  const isOnboarded = user?.onboarded;

  // Connect
  const [onboardingConnectMutation, { isLoading: isConnecting }] =
    useOnboardPaypalMutation();

  // Disconnect
  const [onboardingDisconnectMutation, { isLoading: isDisconnecting }] =
    useDisconnectPaypalMutation();

  // Reconnect
  //  const [onboardingReconnectMutation, { isLoading: isReconnecting }] =
  //    useReconnectPaypalMutation();

  // CONNECT
  const handleConnect = () => {
    const payload = {
      success_url: `${window.location.origin}/dashboard/pro/payment-method`,
      cancel_url: `${window.location.origin}/dashboard/pro/payment-method`,
    };

    onboardingConnectMutation(payload)
      .unwrap()
      .then(res => {
        toast.success(res.message);
        window.location.href = res?.data?.url;
      })
      .catch(err => {
        toast.error(err?.data?.message);
      });
  };

  // DISCONNECT
  const handleDisconnect = () => {
    onboardingDisconnectMutation().unwrap();
  };

  // RECONNECT
  // const handleReconnect = () => {
  //   onboardingReconnectMutation(
  //     {
  //       success_url: `${window.location.origin}/dashboard/pro/payment-method`,
  //       cancel_url: `${window.location.origin}/dashboard/pro/payment-method`,
  //     },
  //     {
  //       onSuccess: (data: any) => {
  //         if (data?.success) {
  //           window.location.href = data?.data?.url;
  //         }
  //       },
  //     },
  //   );
  // };

  return (
    <>
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-secondary-black">
        Store Payments
      </h2>

      <h5 className="text-[15px] md:text-[20px] text-[#3D4145] font-normal pt-4">
        Connect and manage how you'd like to receive
        <br />
        payments from buyers.
      </h5>

      <div className="mt-9 md:mt-10 border border-[#BFBEBE] rounded-[10px] p-6 w-full max-w-[480px]">
        <div className="flex gap-3 items-start justify-between">
          <Paypal />
          {isOnboarded ? (
            <p className="px-3 py-1 rounded-full text-sm bg-primary-green text-white">
              Connected
            </p>
          ) : (
            <p className="px-3 py-1 rounded-full text-sm bg-accent-red text-gray-50">
              Not Connected
            </p>
          )}
        </div>

        <p className="font-normal text-[14px] md:text-[16px] text-[#3D4145]  pt-2">
          Customers can check out from your store with a PayPal or Venmo Account
        </p>

        <div className="flex gap-4 items-center flex-wrap">
          {/* CONNECT BUTTON */}
          {!isOnboarded && (
            <button
              disabled={isConnecting}
              onClick={handleConnect}
              className="mt-5 md:mt-10 p-2 md:p-3 border border-primary-green rounded-md text-[12px] md:text-[14px] font-semibold text-primary-green enabled:hover:text-white enabled:hover:bg-primary-green duration-500 ease-in-out uppercase disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer min-w-[130px]"
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
              className="mt-5 md:mt-10 p-2 md:p-3 border border-primary-red rounded-md text-[12px] md:text-[14px] font-semibold text-primary-red enabled:hover:text-white enabled:hover:bg-primary-red duration-500 ease-in-out uppercase disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer min-w-[130px]"
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
          {/* {isOnboarded && (
            <button
              disabled={isReconnecting}
              onClick={handleReconnect}
              className="mt-5 md:mt-10 p-2 md:p-3 bg-primary-green border border-primary-green rounded-md text-[12px] md:text-[14px] font-semibold text-white enabled:hover:opacity-90 duration-500 ease-in-out uppercase disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer min-w-[130px]"
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
          )} */}
        </div>
      </div>
    </>
  );
};

export default page;
