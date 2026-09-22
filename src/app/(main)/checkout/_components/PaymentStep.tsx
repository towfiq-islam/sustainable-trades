"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { buildCheckoutPayload, VendorFormValues } from "@/lib/checkout";
import toast from "react-hot-toast";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { apiSlice } from "@/redux/api/apiSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CartItem } from "@/Types";
import { clearCart } from "@/redux/slices/cartSlice";
import { clearCheckout, setBuyNowItem } from "@/redux/slices/checkoutSlice";
import { PayPalButtonWithSkeleton } from "./PayPalButtonWithSkeleton";

type Props = {
  items: CartItem[];
  isBuyNow: boolean;
};

// Module-level cache to avoid refetching shop info multiple times
const merchantIdCache: Record<number, string | null> = {};

const PaymentStep = ({ items, isBuyNow }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [singleMerchantId, setSingleMerchantId] = useState<string | null>(null);
  const [isLoadingMerchants, setIsLoadingMerchants] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function resolveMerchants() {
      const vendorIds = Array.from(new Set(items.map(i => i.vendor_id)));

      // When multi-vendor (multiple sellers), do not pass merchant-id to PayPal SDK.
      // Passing multiple merchant IDs causes PayPal SDK to classify the checkout as
      // multi-seller and automatically disable Venmo and Pay Later.
      // By omitting merchant-id for multi-vendor, PayPal renders all 4 options:
      // PayPal, Venmo, Pay Later, and Debit/Credit Card.
      if (vendorIds.length !== 1) {
        if (isMounted) {
          setSingleMerchantId(null);
          setIsLoadingMerchants(false);
        }
        return;
      }

      // Single vendor: resolve merchant ID
      setIsLoadingMerchants(true);
      const id = vendorIds[0];
      try {
        if (merchantIdCache[id] !== undefined) {
          if (isMounted) {
            setSingleMerchantId(merchantIdCache[id]);
            setIsLoadingMerchants(false);
          }
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/shop/${id}`,
          {
            headers: { Accept: "application/json" },
          },
        );
        const json = await res.json();
        const mId =
          json?.data?.paypal_account?.paypal_merchant_id || null;
        merchantIdCache[id] = mId;

        console.log(
          `[PayPal Debug] Dynamically resolved vendor PayPal merchant ID for shop ${id}:`,
          mId,
        );

        if (isMounted) {
          setSingleMerchantId(mId);
        }
      } catch (err) {
        console.error(`[PayPal Debug] Failed to fetch shop ${id}:`, err);
        if (isMounted) setSingleMerchantId(null);
      } finally {
        if (isMounted) setIsLoadingMerchants(false);
      }
    }

    resolveMerchants();

    return () => {
      isMounted = false;
    };
  }, [items]);

  const buildStepUrl = (step: string) => {
    const params = new URLSearchParams();
    params.set("step", step);
    if (mode) params.set("mode", mode);
    return `/checkout?${params.toString()}`;
  };

  const initialOptions = useMemo(() => {
    const options: Record<string, any> = {
      "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      currency: "USD",
      intent: "capture",
      components: "buttons",
      "enable-funding": "venmo,paylater",
      "disable-funding": "",
      "data-page-type": "checkout",
      "data-sdk-integration-source": "developer-studio",
    };

    if (singleMerchantId) {
      options["merchant-id"] = singleMerchantId;
    }

    return options;
  }, [singleMerchantId]);

  const {
    subscribe_website,
    terms_and_condition,
    vendors: vendorExtras,
    contact: reduxContact,
  } = useAppSelector(state => state.checkout);
  const { getValues } = useFormContext();

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

      {isLoadingMerchants ? (
        <div className="space-y-3 py-2">
          <div className="w-full h-12 bg-gray-200 animate-pulse rounded-md" />
          <div className="w-full h-12 bg-gray-200 animate-pulse rounded-md" />
        </div>
      ) : (
        <PayPalScriptProvider
          key={singleMerchantId || "multi-vendor"}
          options={initialOptions as any}
        >
          <PayPalButtonWithSkeleton
          createOrder={async () => {
            console.log("[PayPal Debug] createOrder triggered. Fetching latest form values...");
            try {
              const values = getValues();
              const formValues = (values?.vendors || {}) as VendorFormValues;
              const contact = {
                first_name: values?.first_name || reduxContact?.first_name || "",
                last_name: values?.last_name || reduxContact?.last_name || "",
                email: values?.email || reduxContact?.email || "",
                phone: values?.phone || reduxContact?.phone || null,
              };

              const payload = buildCheckoutPayload(
                items,
                formValues,
                vendorExtras,
                contact,
                {
                  payment_method: "paypal",
                  terms_and_condition,
                  subscribe_website,
                },
              );

              console.log("[PayPal Debug] Sending checkout payload:", payload);

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
              console.log("[PayPal Debug] /api/multi-vendor-checkout response:", orderData);

              if (orderData?.paypal_order_id) {
                console.log("[PayPal Debug] Returning paypal_order_id to SDK:", orderData.paypal_order_id);
                return orderData.paypal_order_id;
              }

              const errorMsg = orderData?.message || "Unable to create PayPal order";
              toast.error(errorMsg);
              throw new Error(errorMsg);
            } catch (error: any) {
              console.error("[PayPal Debug] createOrder failed:", error);
              if (!error?.message) {
                toast.error("Unable to initialize payment");
              }
              throw error;
            }
          }}
          onApprove={async data => {
            console.log("[PayPal Debug] onApprove triggered! Buyer approved in popup. Data:", data);
            const toastId = toast.loading("Processing payment capture...");
            try {
              console.log("[PayPal Debug] Calling /api/paypal/capture with paypal_order_id:", data?.orderID);
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/capture`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  body: JSON.stringify({
                    paypal_order_id: data?.orderID,
                  }),
                },
              );

              const orderData = await response.json();
              console.log("[PayPal Debug] /api/paypal/capture response:", orderData);

              if (orderData?.success) {
                toast.success(orderData?.message || "Payment successful!", { id: toastId });
                dispatch(apiSlice.util.invalidateTags(["user"]));

                if (isBuyNow) {
                  dispatch(setBuyNowItem(null));
                } else {
                  dispatch(clearCart());
                }

                dispatch(clearCheckout());
                router.replace(
                  `/order-success?order_id=${orderData?.data?.id}`,
                );
              } else {
                toast.error(orderData?.message || "Payment capture failed", { id: toastId });
              }
            } catch (error) {
              console.error("[PayPal Debug] Capture call failed:", error);
              toast.error("Payment capture failed", { id: toastId });
            }
          }}
          onError={err => {
            console.error("[PayPal Debug] onError event fired from PayPal SDK:", err);
            toast.error("PayPal encountered an error. Check console for details.");
          }}
          onCancel={data => {
            console.warn("[PayPal Debug] onCancel event fired. Buyer closed or cancelled popup:", data);
            toast("Payment was cancelled.", { icon: "ℹ️" });
          }}
        />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PaymentStep;
