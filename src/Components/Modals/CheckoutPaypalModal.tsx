"use client";
import { useCheckout } from "@/Hooks/api/cms_api";
import { getItem } from "@/lib/localStorage";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

const CheckoutPaypalModal = ({
  cart_id,
  formData,
}: {
  cart_id: number | null;
  formData: any;
}) => {
  const { mutateAsync: checkoutMutation, isPending } = useCheckout(cart_id);
  const token = getItem("token");
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
    checkoutMutation(
      { ...formData, payment_method: "cash_on_delivery" },
      {
        onSuccess: (data: any) => {
          if (data?.success) {
            window.location.href = `${window.location.origin}/dashboard/customer/orders`;
          }
        },
      }
    );
  };

  return (
    <div className="pt-5">
      <button
        onClick={handleCashOnDelivery}
        disabled={isPending}
        className={`block w-full text-center text-lg font-semibold py-3.5 rounded bg-accent-red text-white mb-4 ${
          isPending ? "!cursor-not-allowed opacity-85" : "cursor-pointer"
        } `}
      >
        {isPending ? (
          <span className="flex gap-2 items-center justify-center">
            <CgSpinnerTwo className="animate-spin text-xl" />
            <span>Please wait....</span>
          </span>
        ) : (
          "Cash On Delivery"
        )}
      </button>

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
                }
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
                }
              );

              const orderData = await response.json();
              if (orderData?.success) {
                toast.success(orderData?.message);
                window.location.href = `${window.location.origin}/dashboard/customer/orders`;
              }
            } catch (error) {
              console.error(error);
            }
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default CheckoutPaypalModal;
