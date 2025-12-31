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
    intent: "subscription",
    vault: true,
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
            label: "subscribe",
          }}
          createSubscription={async () => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/create-subscription`,
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

              if (orderData?.data?.subscriptionID) {
                return orderData?.data?.subscriptionID;
              }
            } catch (error) {
              console.error(error);
            }
          }}
          onApprove={async data => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/capture-subscription`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    plan_id: planId,
                    subscriptionID: data?.subscriptionID,
                  }),
                }
              );

              const orderData = await response.json();
              if (orderData?.status) {
                toast.success(orderData?.message);
                window.location.href = `${window.location.origin}/complete-shop-creation`;
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

export default SubscriptionPaypalModal;
