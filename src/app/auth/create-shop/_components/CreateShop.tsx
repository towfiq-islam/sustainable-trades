"use client";
import React, { useEffect, useRef, useState } from "react";
import Container from "@/Components/Common/Container";
import { useForm, FormProvider } from "react-hook-form";
import { CheckSvg, StepSvg } from "@/Components/Svg/SvgContainer";
import toast from "react-hot-toast";
import { useCreateShopMutation } from "@/redux/api/authApi";
import useAuth from "@/Hooks/useAuth";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";

type StepItem = {
  smLabel: string;
  lgLabel: string;
  component: React.ComponentType<any>;
};

const CreateShop = ({ newStep }: { newStep: number }) => {
  const { setAuthenticated } = useAuth();
  const formRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState<number>(1);
  const [createShop, { isLoading }] = useCreateShopMutation();
  const onNext = () => setStep(prev => Math.min(prev + 1, steps.length));
  const onPrev = () => setStep(prev => Math.max(prev - 1, 1));

  // Hook Form instance
  const methods = useForm({
    defaultValues: {
      // StepOne
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      company_name: "",

      // StepTwo
      shop_name: "",
      shop_image: null,
      shop_banner: null,

      // StepThree
      about_image: null,
      tagline: "",
      statement: "",
      our_story: "",
      payment_methods: [],
      shipping_information: "",
      return_policy: "",
      pinterest_url: "",
      instagram_url: "",
      website_url: "",
      facebook_url: "",

      // StepFour
      address_10_mile: 0,
      display_my_address: 0,
      do_not_display: 0,
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
      latitude: null,
      longitude: null,
    },
    mode: "onBlur",
  });

  // Steps array
  const steps: StepItem[] = [
    { smLabel: "Profile", lgLabel: "Profile Info", component: StepOne },
    { smLabel: "Shop", lgLabel: "Your Shop", component: StepTwo },
    { smLabel: "About", lgLabel: "About Your Shop", component: StepThree },
    { smLabel: "Locator", lgLabel: "Geo-Locator", component: StepFour },
    {
      smLabel: "Membership",
      lgLabel: "Choose A Membership",
      component: StepFive,
    },
  ];

  const CurrentStep = steps[step - 1].component;

  const onSubmit = async (data: any) => {
    if (
      (step === 3 || step === steps.length) &&
      (!data.faqs || data.faqs.length === 0)
    ) {
      toast.error("Please add at least one FAQ before continuing");
      return;
    }

    if (data.faqs && Array.isArray(data.faqs)) {
      data.questions = data.faqs.map((faq: any) => faq.question);
      data.answers = data.faqs.map((faq: any) => faq.answer);
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const payload = { ...data };

      delete payload.coverPhotoPreview;
      delete payload.shopPhotoPreview;
      delete payload.profilePhotoPreview;

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          return;
        }

        // File
        if (value instanceof File) {
          formData.append(key, value);
          return;
        }

        // Multiple files
        if (Array.isArray(value) && value.length && value[0] instanceof File) {
          value.forEach(file => formData.append(`${key}[]`, file));
          return;
        }

        // Array of strings/numbers
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(`${key}[]`, String(item)));
          return;
        }

        formData.append(key, String(value));
      });

      try {
        const res = await createShop(formData).unwrap();

        if (res?.success) {
          toast.success(res?.message);
          setStep(step + 1);
          setAuthenticated();
        }
      } catch (err: any) {
        toast.error(err?.data?.message);
      }
    }
  };

  useEffect(() => {
    if (newStep && !isNaN(Number(newStep))) {
      setStep(newStep);
    }
  }, [newStep]);

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  return (
    <section ref={formRef} className="py-12 relative">
      {/* Close btn */}
      <Link
        href="/"
        className="absolute top-10 right-20 text-xl cursor-pointer hover:bg-gray-200 px-2 py-2 rounded-lg duration-200 transition-colors"
      >
        <RxCross2 />
      </Link>

      <Container>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Step bar */}
            <div className="relative flex justify-between items-start max-w-5xl mx-auto">
              <div className="absolute left-[8%] right-[8%] top-5 border-t-2 border-dashed border-light-green z-0" />

              {steps.map((item, index) => {
                const isActive = index + 1 === step;
                const isCompleted = index + 1 < step;

                return (
                  <div
                    key={index}
                    className={`relative z-10 flex flex-1 flex-col items-center ${
                      isActive ? "text-primary-green" : "text-secondary-gray"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full lg:w-12 lg:h-12 w-7 h-7 ring-6 ring-white ${isActive || isCompleted ? "bg-primary-green" : "bg-light-green"}`}
                    >
                      {isCompleted ? (
                        <CheckSvg />
                      ) : isActive ? (
                        <StepSvg />
                      ) : null}
                    </div>

                    <p className="mt-3 text-center text-xs lg:text-base">
                      <span className="block lg:hidden">{item.smLabel}</span>
                      <span className="hidden lg:block">{item.lgLabel}</span>
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Step content */}
            <CurrentStep
              step={step}
              setStep={setStep}
              totalSteps={steps.length}
              onNext={onNext}
              onPrev={onPrev}
              isPending={isLoading}
            />
          </form>
        </FormProvider>
      </Container>
    </section>
  );
};

export default CreateShop;
