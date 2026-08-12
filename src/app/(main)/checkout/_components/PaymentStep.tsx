"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { buildCheckoutPayload, VendorFormValues } from "@/lib/checkout";
import toast from "react-hot-toast";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { apiSlice } from "@/redux/api/apiSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CartItem, clearCart } from "@/redux/slices/cartSlice";
import { clearCheckout, setBuyNowItem } from "@/redux/slices/checkoutSlice";
import { PayPalButtonWithSkeleton } from "./PayPalButtonWithSkeleton";

type Props = {
  items: CartItem[];
  isBuyNow: boolean;
};

const PaymentStep = ({ items, isBuyNow }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const buildStepUrl = (step: string) => {
    const params = new URLSearchParams();
    params.set("step", step);
    if (mode) params.set("mode", mode);
    return `/checkout?${params.toString()}`;
  };
  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: "USD",
    components: "buttons",
    "enable-funding": "venmo",
    // "buyer-country": "US",
    "disable-funding": "",
    "data-page-type": "product-details",
    "data-sdk-integration-source": "developer-studio",
  };

  const {
    subscribe_website,
    terms_and_condition,
    vendors: vendorExtras,
  } = useAppSelector(state => state.checkout);
  const { getValues } = useFormContext();

  const { vendors: formValues } = getValues() as {
    vendors: VendorFormValues;
  };

  const payload = buildCheckoutPayload(items, formValues, vendorExtras, {
    payment_method: "paypal",
    terms_and_condition,
    subscribe_website,
  });

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white text-center relative">
      <button
        type="button"
        onClick={() => router.push(buildStepUrl("review-order"))}
        className="w-fit mt-3 group rounded-lg px-3 py-2 duration-300 transition-all cursor-pointer hover:bg-gray-100 absolute top-0 left-3"
      >
        <FaArrowLeftLong />
      </button>

      <h3 className="text-xl font-semibold text-secondary-black mb-1">
        Confirm and pay
      </h3>
      <p className="text-sm text-secondary-gray mb-5">
        {items.length} order{items.length > 1 ? "s" : ""} will be created — one
        per seller
      </p>

      <PayPalScriptProvider options={initialOptions as any}>
        <PayPalButtonWithSkeleton
          createOrder={async () => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/multi-vendor-checkout`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                  },
                  body: JSON.stringify(payload),
                },
              );

              const orderData = await response.json();

              if (orderData?.paypal_order_id) {
                return orderData.paypal_order_id;
              }

              throw new Error("Unable to create PayPal order");
            } catch (error) {
              console.error(error);
              toast.error("Unable to initialize payment");
              return undefined;
            }
          }}
          onApprove={async data => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/capture`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    paypal_order_id: data?.orderID,
                  }),
                },
              );

              const orderData = await response.json();

              if (orderData?.success) {
                toast.success(orderData?.message);
                dispatch(apiSlice.util.invalidateTags(["user"]));

                if (isBuyNow) {
                  dispatch(setBuyNowItem(null));
                } else {
                  dispatch(clearCart());
                }

                dispatch(clearCheckout());
                router.push(`/order-success?order_id=${orderData?.data?.id}`);
              }
            } catch (error) {
              console.error(error);
              toast.error("Payment capture failed");
            }
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaymentStep;
