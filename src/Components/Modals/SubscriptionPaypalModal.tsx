"use client";
import { getItem } from "@/lib/localStorage";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SubscriptionPaypalModal = ({ planId }: { planId: number }) => {
  const router = useRouter();
  const token = getItem("token");
  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    "enable-funding": "venmo",
    "disable-funding": "",
    "buyer-country": "US",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  };

  return (
    <div className="pt-5">
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
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/create-order`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ plan_id: planId }),
                }
              );

              const orderData = await response.json();

              if (orderData?.data?.orderID) {
                return orderData?.data?.orderID;
              }
            } catch (error) {
              console.error(error);
            }
          }}
          onApprove={async data => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/capture-order`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    plan_id: planId,
                    orderID: data?.orderID,
                  }),
                }
              );

              const orderData = await response.json();
              if (orderData?.status) {
                toast.success(orderData?.message);
                window.location.href = `${window.location.origin}/complete-shop-creation`;
              }

              // console.log("Capturing...", orderData);
            } catch (error) {
              console.error(error);
            }
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default SubscriptionPaypalModal;
