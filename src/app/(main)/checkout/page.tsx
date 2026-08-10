"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import Container from "@/Components/Common/Container";
import { useAppSelector } from "@/redux/store";
import CheckoutStepper, { CheckoutStep } from "./_components/CheckoutStepper";
import OrderSummarySidebar from "./_components/OrderSummarySidebar";
import ReviewStep from "./_components/ReviewStep";
import PaymentStep from "./_components/PaymentStep";
import DeliveryOptions from "./_components/DeliveryOptions";
import DeliveryDetails from "./_components/DeliveryDetails";

const CheckoutContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = (searchParams.get("step") as CheckoutStep) || "delivery-options";
  const { items } = useAppSelector(state => state.cart);
  const hasMountedRef = useRef(false);
  const [isResetting, setIsResetting] = useState(true);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;

      if (step !== "delivery-options") {
        router.replace("/checkout?step=delivery-options");
        return;
      }
    }
    setIsResetting(false);
  }, [step, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const methods = useForm({ defaultValues: { vendors: {} }, mode: "all" });

  if (!items.length) {
    return (
      <Container>
        <p className="text-center text-secondary-gray text-lg py-20">
          Your cart is empty.
        </p>
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
            {step === "delivery-options" && <DeliveryOptions />}
            {step === "delivery-details" && <DeliveryDetails />}
            {step === "review-order" && <ReviewStep />}
            {step === "payment" && <PaymentStep />}
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
