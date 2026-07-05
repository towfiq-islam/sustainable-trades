"use client";
import { useLocalPickupPaymentMutation } from "@/redux/api/vendorApi";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

const CheckoutPaypalModal = ({
  cart_id,
  formData,
  isLocalPayment = false,
  isGuest = false,
}: {
  cart_id: number | null;
  formData?: any;
  onClose?: any;
  isLocalPayment?: boolean;
  isGuest?: boolean;
}) => {
  const [localPickupPayment, { isLoading: isConnecting }] =
    useLocalPickupPaymentMutation();
  const router = useRouter();

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

  // For COD
  const handleCashOnDelivery = () => {
    try {
      const res: any = localPickupPayment({
        id: cart_id,
        data: {
          payment_method: "cash_on_delivery",
        },
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        router.push("/dashboard/customer/orders");
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="pt-5">
      {isLocalPayment && (
        <button
          disabled={isConnecting}
          onClick={handleCashOnDelivery}
          className={`block w-full text-center text-lg font-semibold py-3.5 rounded bg-accent-red text-white mb-4 ${
            isConnecting ? "!cursor-not-allowed opacity-85" : "cursor-pointer"
          } `}
        >
          {isConnecting ? (
            <span className="flex gap-2 items-center justify-center">
              <CgSpinnerTwo className="animate-spin text-xl" />
              <span>Please wait....</span>
            </span>
          ) : (
            "Cash On Delivery"
          )}
        </button>
      )}

      {isLocalPayment ? (
        <PayPalScriptProvider options={initialOptions as any}>
          <PayPalButtons
            style={{
              shape: "rect",
              layout: "vertical",
              color: "gold",
              label: "paypal",
            }}
            createOrder={async () => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/api/local-pickup/checkout/${cart_id}`,
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      payment_method: "paypal",
                    }),
                  },
                );

                const orderData = await response.json();

                if (orderData?.paypal_order_id) {
                  return orderData?.paypal_order_id;
                }
              } catch (error) {
                console.log(error);
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
                  router.push("/dashboard/customer/orders");
                }
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </PayPalScriptProvider>
      ) : isGuest ? (
        <PayPalScriptProvider options={initialOptions as any}>
          <PayPalButtons
            style={{
              shape: "rect",
              layout: "vertical",
              color: "gold",
              label: "paypal",
            }}
            createOrder={async () => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/api/direct-checkout/${cart_id}`,
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      payment_method: "paypal",
                    }),
                  },
                );

                const orderData = await response.json();

                if (orderData?.paypal_order_id) {
                  return orderData?.paypal_order_id;
                }
              } catch (error) {
                console.log(error);
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
                  // router.push("/dashboard/customer/orders");
                }
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </PayPalScriptProvider>
      ) : (
        <PayPalScriptProvider options={initialOptions as any}>
          <PayPalButtons
            style={{
              shape: "rect",
              layout: "vertical",
              color: "gold",
              label: "paypal",
            }}
            createOrder={async () => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/${cart_id}`,
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...formData,
                    }),
                  },
                );

                console.log(response);

                if (!response.ok) {
                  const errorBody = await response.json().catch(() => null);
                  console.error("Checkout failed:", response.status, errorBody);
                  toast.error(
                    errorBody?.message ??
                      "Could not start checkout. Please try again.",
                  );
                  throw new Error("checkout_failed"); // tells PayPal SDK the order creation failed
                }

                const orderData = await response.json();
                console.log(orderData);

                if (orderData?.paypal_order_id) {
                  return orderData?.paypal_order_id;
                }
              } catch (error) {
                console.log(error);
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
                  router.push(
                    `/order-success?order_id=${orderData?.data?.id}&shop_id=${orderData?.data?.shop_id}`,
                  );
                }
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default CheckoutPaypalModal;
