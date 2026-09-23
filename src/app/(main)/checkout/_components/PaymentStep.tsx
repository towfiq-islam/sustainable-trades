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
const merchantCache: Record<
  number,
  { merchantId: string | null; shopName: string }
> = {};

const PaymentStep = ({ items, isBuyNow }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [resolvedMerchantIds, setResolvedMerchantIds] = useState<string[]>([]);
  const [isLoadingMerchants, setIsLoadingMerchants] = useState(true);
  const [merchantError, setMerchantError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function resolveVendors() {
      setIsLoadingMerchants(true);
      setMerchantError(null);

      // Distinct vendors in the current checkout
      const uniqueVendors = Array.from(
        new Map(items.map(item => [item.vendor_id, item])).values(),
      );

      const collectedMerchantIds: string[] = [];

      try {
        for (const vendor of uniqueVendors) {
          const vendorId = vendor.vendor_id;
          let cached = merchantCache[vendorId];

          if (!cached) {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/shop/${vendorId}`,
                {
                  headers: { Accept: "application/json" },
                },
              );
              const data = await res.json();
              const merchantId =
                data?.data?.paypal_account?.paypal_merchant_id || null;
              const shopName =
                data?.data?.shop_info?.shop_name ||
                vendor.shop_name ||
                `Vendor #${vendorId}`;

              cached = { merchantId, shopName };
              merchantCache[vendorId] = cached;
            } catch (err) {
              console.error(`Failed to fetch shop info for vendor ${vendorId}:`, err);
              cached = {
                merchantId: null,
                shopName: vendor.shop_name || `Vendor #${vendorId}`,
              };
            }
          }

          if (!cached.merchantId) {
            if (isMounted) {
              setMerchantError(
                `The seller "${cached.shopName}" has not connected their PayPal account yet. Please remove their items to proceed with checkout.`,
              );
              setIsLoadingMerchants(false);
            }
            return;
          }

          collectedMerchantIds.push(cached.merchantId);
        }

        if (isMounted) {
          // Deduplicate in case multiple vendor entries point to the same merchant account
          const distinctMerchantIds = Array.from(new Set(collectedMerchantIds));
          setResolvedMerchantIds(distinctMerchantIds);
          setIsLoadingMerchants(false);
        }
      } catch (err) {
        console.error("Error resolving vendor merchants:", err);
        if (isMounted) {
          setMerchantError("Failed to verify vendor payment settings. Please try again.");
          setIsLoadingMerchants(false);
        }
      }
    }

    if (items.length > 0) {
      resolveVendors();
    } else {
      setIsLoadingMerchants(false);
    }

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

  const merchantIdsKey = resolvedMerchantIds.join(",");

  // PayPal JavaScript SDK Configuration (per PayPal Multiparty / Multi-Seller specifications)
  const initialOptions = useMemo(() => {
    const options: Record<string, any> = {
      "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      currency: "USD",
      intent: "capture",
      components: "buttons",
      "enable-funding": "venmo",
      "disable-funding": "",
      "data-page-type": "checkout",
      "data-sdk-integration-source": "developer-studio",
    };

    if (resolvedMerchantIds.length === 1) {
      // Single Seller Checkout
      options["merchant-id"] = resolvedMerchantIds[0];
      options["data-merchant-id"] = resolvedMerchantIds[0];
    } else if (resolvedMerchantIds.length > 1) {
      // Multi-Seller Checkout: merchant-id=* and data-merchant-id=ID1,ID2
      options["merchant-id"] = "*";
      options["data-merchant-id"] = resolvedMerchantIds.join(",");
    }

    return options;
  }, [merchantIdsKey, resolvedMerchantIds]);

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
          <div className="w-full h-12 bg-gray-200 animate-pulse rounded-md" />
        </div>
      ) : merchantError || resolvedMerchantIds.length === 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 text-left my-4">
          <p className="font-semibold mb-1">Payment Temporarily Unavailable</p>
          <p>
            {merchantError ||
              "One or more sellers have not connected their PayPal account yet. Please contact support or the seller."}
          </p>
        </div>
      ) : (
        <PayPalScriptProvider
          key={merchantIdsKey}
          options={initialOptions as any}
        >
          <PayPalButtonWithSkeleton
            createOrder={async () => {
              try {
                // Dynamically build fresh checkout payload on click
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

                const errorMsg =
                  orderData?.message || "Unable to create PayPal order";
                toast.error(errorMsg);
                throw new Error(errorMsg);
              } catch (error: any) {
                console.error("Order creation failed:", error);
                if (!error?.message) {
                  toast.error("Unable to initialize payment");
                }
                throw error;
              }
            }}
            onApprove={async data => {
              const toastId = toast.loading("Processing payment capture...");
              try {
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

                if (orderData?.success) {
                  toast.success(orderData?.message || "Payment completed successfully!", {
                    id: toastId,
                  });
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
                  toast.error(orderData?.message || "Payment capture failed", {
                    id: toastId,
                  });
                }
              } catch (error) {
                console.error("Capture call failed:", error);
                toast.error("Payment capture failed", { id: toastId });
              }
            }}
            onError={err => {
              console.error("PayPal SDK encountered an error:", err);
              toast.error("PayPal encountered an error. Please try again or check your account details.");
            }}
            onCancel={() => {
              toast("Payment cancelled by buyer.", { icon: "ℹ️" });
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PaymentStep;
