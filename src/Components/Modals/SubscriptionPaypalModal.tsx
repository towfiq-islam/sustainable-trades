"use client";
import { getItem } from "@/lib/localStorage";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

const SubscriptionPaypalModal = ({
  planId,
  interval,
}: {
  planId: number;
  interval: string;
}) => {
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

  return (
    <div className="pt-5">
      {interval === "yearly" ? (
        <p className="text-primary-green leading-[160%] text-[17px] mb-7">
          <span className="font-semibold"> Note:</span> By selecting the annual
          plan, you authorize an automatic charge once per year. Your
          subscription will renew annually unless canceled before the renewal
          date.
        </p>
      ) : (
        <p className="text-primary-green leading-[160%] text-[17px] mb-7">
          <span className="font-semibold"> Note:</span> By selecting the monthly
          plan, you authorize an automatic charge each month. Your subscription
          will renew monthly unless canceled before the next billing cycle.
        </p>
      )}

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
