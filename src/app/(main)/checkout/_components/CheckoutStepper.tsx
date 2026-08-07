"use client";
import Link from "next/link";
import {
  FiShoppingCart,
  FiTruck,
  FiMapPin,
  FiClipboard,
  FiCreditCard,
} from "react-icons/fi";
import type { IconType } from "react-icons";

export type CheckoutStep =
  | "delivery-options"
  | "delivery-details"
  | "review-order"
  | "payment";

type Node = {
  key: string;
  label: string;
  icon: IconType;
  href?: string;
};

const STEPS: { key: CheckoutStep; label: string; icon: IconType }[] = [
  { key: "delivery-options", label: "Delivery Options", icon: FiTruck },
  { key: "delivery-details", label: "Delivery Details", icon: FiMapPin },
  { key: "review-order", label: "Review Order", icon: FiClipboard },
  { key: "payment", label: "Payment", icon: FiCreditCard },
];

const CheckoutStepper = ({ current }: { current: CheckoutStep }) => {
  const nodes: Node[] = [
    { key: "cart", label: "Cart", icon: FiShoppingCart, href: "/cart" },
    ...STEPS,
  ];
  const currentIndex = STEPS.findIndex(s => s.key === current) + 1;
  const currentLabel = nodes[currentIndex]?.label ?? "";

  const connectorCount = nodes.length - 1;
  const gridTemplateColumns = Array.from(
    { length: nodes.length + connectorCount },
    (_, i) => (i % 2 === 0 ? "auto" : "1fr"),
  ).join(" ");

  return (
    <nav className="mb-7">
      <div className="-mx-1 px-1">
        <div
          className="grid items-center gap-y-2 max-w-3xl mx-auto"
          style={{ gridTemplateColumns, gridTemplateRows: "auto auto" }}
        >
          {nodes.map((node, idx) => {
            const nodeCol = 2 * idx + 1;
            const isCurrent = idx === currentIndex;
            const isDone = idx < currentIndex;
            const Icon = node.icon;

            const circle = (
              <span
                className={`rounded-full flex items-center justify-center transition-all shrink-0 ${
                  isCurrent
                    ? "size-9 sm:size-11 bg-primary-green text-white shadow-sm"
                    : `size-8 sm:size-10 border-2 ${
                        isDone
                          ? "border-primary-green text-white bg-primary-green"
                          : "border-gray-300 text-secondary-gray"
                      }`
                }`}
              >
                <Icon className="text-sm sm:text-base" />
              </span>
            );

            return (
              <div key={node.key} className="contents">
                {/* Row 1: circle */}
                <div
                  style={{ gridColumn: nodeCol, gridRow: 1 }}
                  className="flex justify-center"
                >
                  {node.href ? (
                    <Link href={node.href} className="group">
                      {circle}
                    </Link>
                  ) : (
                    circle
                  )}
                </div>

                {/* Row 2: label — hidden on mobile, shown from sm: up */}
                <div
                  style={{ gridColumn: nodeCol, gridRow: 2 }}
                  className="hidden sm:flex justify-center"
                >
                  <span
                    className={`text-xs whitespace-nowrap ${
                      isCurrent
                        ? "font-semibold text-secondary-black"
                        : isDone
                          ? "font-medium text-primary-green"
                          : "text-secondary-gray"
                    }`}
                  >
                    {node.label}
                  </span>
                </div>

                {/* Connector after this node (skip after the last one) */}
                {idx < nodes.length - 1 && (
                  <div
                    style={{ gridColumn: nodeCol + 1, gridRow: 1 }}
                    className="flex items-center px-0.5 sm:px-0"
                  >
                    <span
                      className={`h-0.5 w-full min-w-[16px] rounded-full ${
                        idx < currentIndex ? "bg-primary-green" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile-only */}
      <p className="sm:hidden text-center text-sm font-semibold text-secondary-black mt-2">
        Step {currentIndex} of {nodes.length - 1}: {currentLabel}
      </p>
    </nav>
  );
};

export default CheckoutStepper;
