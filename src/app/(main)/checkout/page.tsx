"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import Container from "@/Components/Common/Container";
import { useAppSelector } from "@/redux/store";
import CheckoutStepper, { CheckoutStep } from "./_components/CheckoutStepper";
import FulfillmentStep from "./_components/FulfillmentStep";
import VendorDetailsStep from "./_components/VendorDetailsStep";
import OrderSummarySidebar from "./_components/OrderSummarySidebar";
import ReviewStep from "./_components/ReviewStep";
import PaymentStep from "./_components/PaymentStep";

const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const step = (searchParams.get("step") as CheckoutStep) || "fulfillment";
  const { items } = useAppSelector(state => state.cart);

  const methods = useForm({ defaultValues: { vendors: {} } });

  if (!items.length) {
    return (
      <Container>
        <p className="text-center text-secondary-gray py-20">
          Your cart is empty.
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <CheckoutStepper current={step} />

      <FormProvider {...methods}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            {step === "fulfillment" && <FulfillmentStep />}
            {step === "details" && <VendorDetailsStep />}
            {step === "review" && <ReviewStep />}
            {step === "payment" && <PaymentStep />}
          </div>

          <div className="lg:col-span-4">
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
