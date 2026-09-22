"use client";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface PayPalButtonWithSkeletonProps {
  createOrder: () => Promise<string | undefined>;
  onApprove: (data: any) => Promise<void>;
  onError?: (err: any) => void;
  onCancel?: (data: any) => void;
}

export const PayPalButtonWithSkeleton = ({
  createOrder,
  onApprove,
  onError,
  onCancel,
}: PayPalButtonWithSkeletonProps) => {
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
        label: "paypal",
      }}
      createOrder={createOrder as any}
      onApprove={onApprove}
      onError={onError}
      onCancel={onCancel}
    />
  );
};
