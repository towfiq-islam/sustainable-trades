"use client";
import Link from "next/link";
import useAuth from "@/Hooks/useAuth";
import Container from "@/Components/Common/Container";
import { LuTruck } from "react-icons/lu";

const LeafBadgeIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
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

const CreditCardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
    <rect x="5" y="14" width="4" height="2" rx="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const CompleteShopCreationPage = () => {
  const { user } = useAuth();

  const dashboardUrl =
    user?.membership?.membership_type === "basic"
      ? "/dashboard/basic/home"
      : "/dashboard/pro/home";

  return (
    <section className="py-12">
      <Container>
        {/* Celebratory Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="w-18 h-18 rounded-full bg-[#b0dedb] flex items-center justify-center mx-auto mb-4 text-[#173b35] shadow-sm">
            <LeafBadgeIcon className="w-10 h-10 text-[#173b35]" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-[#173b35] tracking-tight leading-tight">
            Your shop is created!
          </h1>
          <h2 className="text-xl font-semibold text-[#173b35] mt-2 mb-3">
            Welcome to Sustainable Trades!
          </h2>
          <p className="text-secondary-gray text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Your shop is officially created. Before you start adding listings, take a few
            minutes to set up your shop so you’re ready to receive orders.
          </p>
        </div>

        {/* Setup Guide Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <h3 className="text-base sm:text-lg font-semibold text-[#173b35] mb-4 text-left">
            # Use the menu in your Shop Dashboard to complete the following settings:
          </h3>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Step 1: Connect Payments */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#d6f0eb] flex items-center justify-center shrink-0 text-[#173b35]">
                <CreditCardIcon className="w-6 h-6 text-[#173b35]" />
              </div>
              <div>
                <h4 className="font-bold text-[#173b35] text-base">
                  1. Connect Payments
                </h4>
                <p className="text-secondary-gray text-sm mt-1 leading-relaxed">
                  Go to{" "}
                  <strong className="font-bold text-[#173b35]">
                    Payments &rarr; Payment Integration
                  </strong>{" "}
                  to connect your PayPal account so you can accept online payments.
                </p>
              </div>
            </div>

            {/* Step 2: Set Up Sales Tax */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#d6f0eb] flex items-center justify-center shrink-0 text-[#173b35]">
                <CreditCardIcon className="w-6 h-6 text-[#173b35]" />
              </div>
              <div>
                <h4 className="font-bold text-[#173b35] text-base">
                  2. Set Up Sales Tax
                </h4>
                <p className="text-secondary-gray text-sm mt-1 leading-relaxed">
                  Go to{" "}
                  <strong className="font-bold text-[#173b35]">
                    Payments &rarr; Sales Tax
                  </strong>{" "}
                  to choose how you would like sales tax calculated for your shop.
                </p>
              </div>
            </div>

            {/* Step 3: Choose Delivery Settings (Full Width) */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-[#d6f0eb] flex items-center justify-center shrink-0 text-[#173b35]">
                <LuTruck className="w-6 h-6 text-[#173b35]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#173b35] text-base">
                  3. Choose Your Delivery Settings
                </h4>
                <p className="text-secondary-gray text-sm leading-relaxed">
                  Set up the options you plan to offer your customers:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                  <div className="bg-[#f8faf9] rounded-xl p-4 border border-gray-100">
                    <span className="font-bold text-[#173b35] text-sm block mb-1">
                      Shipping
                    </span>
                    <span className="text-xs text-secondary-gray leading-snug block">
                      Configure your shipping method and rates, or connect to Shippo.
                    </span>
                  </div>

                  <div className="bg-[#f8faf9] rounded-xl p-4 border border-gray-100">
                    <span className="font-bold text-[#173b35] text-sm block mb-1">
                      Local Pickup
                    </span>
                    <span className="text-xs text-secondary-gray leading-snug block">
                      Add your pickup location(s).
                    </span>
                  </div>

                  <div className="bg-[#f8faf9] rounded-xl p-4 border border-gray-100">
                    <span className="font-bold text-[#173b35] text-sm block mb-1">
                      Local Delivery
                    </span>
                    <span className="text-xs text-secondary-gray leading-snug block">
                      Add your delivery origin, ranges, and fees.
                    </span>
                  </div>
                </div>

                <p className="text-[#656461] italic text-xs sm:text-sm mt-3">
                  You only need to set up the delivery options you plan to offer.
                </p>
              </div>
            </div>
          </div>

          {/* Info Callout Card with Action Button */}
          <div className="bg-[#ebf5f2] border border-[#b0dedb]/60 rounded-2xl p-5 sm:p-6 mt-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left">
              <p className="text-sm sm:text-base font-medium text-[#173b35] leading-relaxed max-w-xl">
                Once your shop settings are complete, you’re ready to start adding your products and services!
              </p>
            </div>

            <Link
              href={dashboardUrl}
              className="shrink-0 w-full md:w-auto px-5 py-3.5 rounded-xl bg-[#173b35] text-white font-medium text-sm ext-center hover:bg-[#122e2a] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Go to Shop Dashboard</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Footer Tagline */}
          <p className="text-center text-[15px] text-[#4b4a47] font-medium mt-5 flex items-center justify-center gap-2">
            Together we rise, together we thrive.
            <svg
              className="w-4 h-4 text-[#173b35] fill-current inline-block"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default CompleteShopCreationPage;
