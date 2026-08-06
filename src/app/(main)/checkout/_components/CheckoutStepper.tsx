"use client";
import Link from "next/link";

export type CheckoutStep = "details" | "review" | "payment";

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "details", label: "Vendor details" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
];

const CheckoutStepper = ({ current }: { current: CheckoutStep }) => {
  const currentIndex = STEPS.findIndex(s => s.key === current);

  return (
    <nav className="flex items-center gap-2 text-sm font-medium mb-6 flex-wrap">
      <Link
        href="/cart"
        className="text-secondary-gray hover:text-primary-green hover:underline"
      >
        Cart
      </Link>

      {STEPS.map((step, idx) => {
        const isCurrent = idx === currentIndex;
        const isDone = idx < currentIndex;

        return (
          <span key={step.key} className="flex items-center gap-2">
            <span className="text-secondary-gray">›</span>
            <span
              className={
                isCurrent
                  ? "text-primary-green font-semibold"
                  : isDone
                    ? "text-secondary-black"
                    : "text-secondary-gray"
              }
            >
              {step.label}
            </span>
          </span>
        );
      })}
    </nav>
  );
};

export default CheckoutStepper;
