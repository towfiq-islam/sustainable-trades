"use client";
import { useLocalPickupPayment } from "@/Hooks/api/dashboard_api";
import { getItem } from "@/lib/localStorage";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

const CheckoutPaypalModal = ({
  cart_id,
  formData,
  onClose,
  isLocalPayment = false,
}: {
  cart_id: number | null;
  formData?: any;
  onClose?: any;
  isLocalPayment?: boolean;
}) => {
  const { mutate: localPickupPayment, isPending: isConnecting } =
    useLocalPickupPayment(cart_id);
  const queryClient = useQueryClient();
  const token = getItem("token");
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
    localPickupPayment(
      { payment_method: "cash_on_delivery" },
      {
        onSuccess: (data: any) => {
          if (data?.success) {
            router.push("/dashboard/customer/orders");
          }
        },
      },
    );
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
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
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
                console.error(error);
              }
            }}
            onApprove={async data => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/capture`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
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
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      ...formData,
                    }),
                  },
                );

                const orderData = await response.json();

                if (orderData?.paypal_order_id) {
                  return orderData?.paypal_order_id;
                }
              } catch (error) {
                console.error(error);
              }
            }}
            onApprove={async data => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/capture`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      paypal_order_id: data?.orderID,
                    }),
                  },
                );

                const orderData = await response.json();
                if (orderData?.success) {
                  toast.success(orderData?.message);
                  queryClient.invalidateQueries("get-product-cart" as any);
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
