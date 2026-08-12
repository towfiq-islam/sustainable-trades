import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export const PayPalButtonWithSkeleton = ({
  createOrder,
  onApprove,
}: {
  createOrder: () => Promise<string | undefined>;
  onApprove: (data: any) => Promise<void>;
}) => {
  const [{ isResolved, isRejected }] = usePayPalScriptReducer();

  if (isRejected) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load PayPal. Please refresh the page and try again.
      </div>
    );
  }

  if (!isResolved) {
    return (
      <div className="space-y-3">
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
        label: "paypal",
      }}
      createOrder={createOrder as any}
      onApprove={onApprove}
    />
  );
};
