"use client";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

const PayPalSubscriptionButtons = ({ planId }: { planId: number }) => {
  const [{ isResolved, isRejected, isPending }] = usePayPalScriptReducer();

  if (isRejected) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load PayPal. Please refresh the page and try again.
      </div>
    );
  }

  if (!isResolved || isPending) {
    return (
      <div className="space-y-3 py-2">
        <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
      </div>
    );
  }

  return (
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
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ plan_id: planId }),
            },
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
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                plan_id: planId,
                subscriptionID: data?.subscriptionID,
              }),
            },
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
  );
};

const SubscriptionPaypalModal = ({
  planId,
  interval,
}: {
  planId: number;
  interval: string;
}) => {
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
        <PayPalSubscriptionButtons planId={planId} />
      </PayPalScriptProvider>
    </div>
  );
};

export default SubscriptionPaypalModal;
