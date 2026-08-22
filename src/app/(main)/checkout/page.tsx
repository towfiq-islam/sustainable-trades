"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import Container from "@/Components/Common/Container";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { clearCheckout, setBuyNowItem } from "@/redux/slices/checkoutSlice";
import useAuth from "@/Hooks/useAuth";
import CheckoutStepper from "./_components/CheckoutStepper";
import { CheckoutStep } from "@/Types";
import OrderSummarySidebar from "./_components/OrderSummarySidebar";
import ReviewStep from "./_components/ReviewStep";
import DeliveryOptions from "./_components/DeliveryOptions";
import DeliveryDetails from "./_components/DeliveryDetails";
import Link from "next/link";
import dynamic from "next/dynamic";

const PaymentStep = dynamic(() => import("./_components/PaymentStep"));

const CheckoutContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const step = (searchParams.get("step") as CheckoutStep) || "delivery-options";
  const isBuyNow = searchParams.get("mode") === "buy-now";
  const { isAuthenticated } = useAuth();
  const { items: cartItems } = useAppSelector(state => state.cart);
  const { buyNowItem } = useAppSelector(state => state.checkout);
  const items = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cartItems;
  const hasMountedRef = useRef(false);
  const [isResetting, setIsResetting] = useState(true);
  const [checkoutMode, setCheckoutMode] = useState<
    "guest" | "authenticated" | null
  >(isAuthenticated ? "authenticated" : null);

  useEffect(() => {
    if (isAuthenticated) {
      setCheckoutMode("authenticated");
      return;
    }
    const saved = sessionStorage.getItem("checkout_guest_mode");
    if (saved === "guest") setCheckoutMode("guest");
  }, [isAuthenticated]);

  const handleContinueAsGuest = () => {
    sessionStorage.setItem("checkout_guest_mode", "guest");
    setCheckoutMode("guest");
  };

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;

      if (step !== "delivery-options") {
        dispatch(clearCheckout());
        if (isBuyNow) dispatch(setBuyNowItem(null));

        const params = new URLSearchParams();
        params.set("step", "delivery-options");
        if (isBuyNow) params.set("mode", "buy-now");
        router.replace(`/checkout?${params.toString()}`);
        return;
      }
    }
    setIsResetting(false);
  }, [step, router, dispatch, isBuyNow]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const methods = useForm({ defaultValues: { vendors: {} }, mode: "all" });

  if (!items.length) {
    return (
      <Container>
        <p className="text-center text-secondary-gray text-lg py-16">
          {isBuyNow
            ? "This quick checkout has expired. Please go back and try again."
            : "Your cart is empty."}
        </p>

        {isBuyNow && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-lg bg-primary-green text-white font-semibold cursor-pointer hover:scale-95 transition-all duration-300"
            >
              Continue shopping
            </button>
          </div>
        )}
      </Container>
    );
  }

  if (!checkoutMode) {
    const redirectTo = `/checkout${isBuyNow ? "?mode=buy-now" : ""}`;

    return (
      <Container>
        <div className="max-w-md mx-auto text-center py-16">
          <h2 className="text-2xl font-semibold text-secondary-black mb-3">
            How would you like to check out?
          </h2>
          <p className="text-secondary-gray text-[15px] mb-8">
            You can check out as a guest, or sign in for faster checkout and
            order tracking.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-3 rounded-lg bg-primary-green text-white font-semibold cursor-pointer hover:scale-95 transition-all duration-300"
            >
              Continue as guest
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/auth/login?redirect=${encodeURIComponent(redirectTo)}`,
                )
              }
              className="w-full py-3 rounded-lg border border-gray-300 font-semibold text-secondary-black cursor-pointer hover:bg-gray-50"
            >
              Sign in to your account
            </button>
          </div>

          <div className="flex gap-1 justify-center items-center text-secondary-black mt-7">
            <p>Don't have an account?</p>
            <Link
              className="text-primary-green text-[15px] font-semibold underline"
              href={`/auth/choose-package?redirect=${encodeURIComponent(redirectTo)}`}
            >
              Create one for free
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (isResetting && step !== "delivery-options") {
    return null;
  }

  return (
    <Container>
      <CheckoutStepper current={step} />

      <FormProvider {...methods}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            {step === "delivery-options" && <DeliveryOptions items={items} />}
            {step === "delivery-details" && <DeliveryDetails items={items} />}
            {step === "review-order" && <ReviewStep items={items} />}
            {step === "payment" && (
              <PaymentStep items={items} isBuyNow={isBuyNow} />
            )}
          </div>

          <div className="lg:col-span-4 sticky top-40">
            <OrderSummarySidebar items={items} />
          </div>
        </div>
      </FormProvider>
    </Container>
  );
};

const CheckoutPage = () => (
  <section className="my-10">
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  </section>
);

export default CheckoutPage;
