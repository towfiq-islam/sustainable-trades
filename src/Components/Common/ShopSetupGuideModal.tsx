"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuTruck } from "react-icons/lu";
import { LeafSvg } from "../Svg/SvgContainer";

const LeafBadgeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 44 44"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 32C11 31 7 21.5 9.5 11.5C17.5 10.5 24 16 23 23" />
    <path d="M19 32C15.5 25 12.5 18 9.5 11.5" />
    <path d="M21 26C27 27 34 23 34.5 15C28 13.5 22 16.5 21 22" />
    <path d="M21 24C26 21 30 18 34.5 15" />
    <path d="M19 32C18.2 35 17.5 37 16 39" />
  </svg>
);

const CreditCardIcon = ({
  className = "w-4.5 h-4.5",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="20" height="14" rx="2.5" />
    <path d="M2 10h20" strokeWidth="2.5" />
    <rect
      x="5"
      y="14"
      width="4"
      height="2"
      rx="0.5"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

function ShopSetupGuideModalContent() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("shopCreated") === "true";
    if (fromQuery) {
      setIsOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("shopCreated")) {
        url.searchParams.delete("shopCreated");
        window.history.replaceState(
          {},
          "",
          url.pathname + (url.search ? url.search : ""),
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="absolute inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-xl max-h-[calc(100vh-40px)] overflow-y-auto side-scrollbar bg-white rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100"
        >
          <IoClose className="w-6 h-6" />
        </button>

        {/* Celebratory Hero Header */}
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="size-16 rounded-full bg-accent-blue flex items-center justify-center mx-auto mb-4 text-deep-green shadow-xs">
            <LeafSvg />
          </div>

          <h3 className="text-base sm:text-2xl font-bold text-primary-green mt-1 mb-2">
            Welcome to Sustainable Trades!
          </h3>
          <p className="text-secondary-gray text-xs sm:text-[15px] leading-relaxed">
            Your shop is officially created. Before you start adding listings,
            take a few minutes to set up your shop so you’re ready to receive
            orders.
          </p>
        </div>

        {/* Steps Section */}
        <div className="mt-4 mb-4">
          <h4 className="text-[13px] sm:text-[15px] font-semibold text-primary-green mb-4 text-left">
            Use the menu in your Shop Dashboard to complete the following
            settings:
          </h4>

          <div className="space-y-4">
            {/* Step 1: Connect Payments */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-soft-teal flex items-center justify-center shrink-0 text-deep-green mt-0.5">
                <CreditCardIcon className="w-4.5 h-4.5 text-deep-green" />
              </div>
              <div>
                <h5 className="font-bold text-primary-green text-[13px] sm:text-sm">
                  1. Connect Payments
                </h5>
                <p className="text-secondary-gray text-sm mt-0.5 leading-relaxed">
                  Go to{" "}
                  <strong className="font-bold text-primary-green">
                    Payments &rarr; Payment Integration
                  </strong>{" "}
                  to connect your PayPal account so you can accept online
                  payments.
                </p>
              </div>
            </div>

            {/* Step 2: Set Up Sales Tax */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-soft-teal flex items-center justify-center shrink-0 text-deep-green mt-0.5">
                <CreditCardIcon className="w-4.5 h-4.5 text-deep-green" />
              </div>
              <div>
                <h5 className="font-bold text-primary-green text-[13px] sm:text-sm">
                  2. Set Up Sales Tax
                </h5>
                <p className="text-secondary-gray text-sm mt-0.5 leading-relaxed">
                  Go to{" "}
                  <strong className="font-bold text-primary-green">
                    Payments &rarr; Sales Tax
                  </strong>{" "}
                  to choose how you would like sales tax calculated for your
                  shop.
                </p>
              </div>
            </div>

            {/* Step 3: Choose Delivery Settings */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-soft-teal flex items-center justify-center shrink-0 text-deep-green mt-0.5">
                <LuTruck className="w-4.5 h-4.5 text-deep-green" />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-primary-green text-[13px] sm:text-sm">
                  3. Choose Your Delivery Settings
                </h5>
                <p className="text-secondary-gray text-sm mt-0.5 leading-relaxed">
                  Set up the options you plan to offer your customers:
                </p>

                <ul className="list-disc ml-4 mt-1.5 space-y-1 text-[13px] text-secondary-gray">
                  <li>
                    <strong className="font-bold text-primary-green">
                      Shipping
                    </strong>{" "}
                    &mdash; configure your shipping method and rates, or connect
                    to Shippo.
                  </li>
                  <li>
                    <strong className="font-bold text-primary-green">
                      Local Pickup
                    </strong>{" "}
                    &mdash; add your pickup location(s).
                  </li>
                  <li>
                    <strong className="font-bold text-primary-green">
                      Local Delivery
                    </strong>{" "}
                    &mdash; add your delivery origin, ranges, and fees.
                  </li>
                </ul>

                <p className="text-muted-gray text-xs mt-1.5">
                  You only need to set up the delivery options you plan to
                  offer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Callout Card */}
        <div className="bg-callout-bg border border-accent-blue/60 rounded-xl p-3.5 mb-5 text-center">
          <p className="text-xs sm:text-[13px] font-semibold text-primary-green leading-relaxed max-w-sm mx-auto">
            Once your shop settings are complete, you’re ready to start adding
            your products and services!
          </p>
        </div>

        {/* Footer Tagline */}
        <p className="text-center text-xs sm:text-[13px] text-secondary-gray font-medium mt-3 flex items-center justify-center gap-1.5">
          Together we rise, together we thrive.
          <svg
            className="w-3.5 h-3.5 text-primary-green fill-current inline-block"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </p>
      </div>
    </div>
  );
}

export default function ShopSetupGuideModal() {
  return (
    <Suspense fallback={null}>
      <ShopSetupGuideModalContent />
    </Suspense>
  );
}
