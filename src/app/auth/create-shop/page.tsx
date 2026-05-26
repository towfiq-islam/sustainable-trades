"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCreateShop } from "@/Hooks/api/auth_api";
import Container from "@/Components/Common/Container";
import { useForm, FormProvider } from "react-hook-form";
import { CheckSvg, StepSvg } from "@/Components/Svg/SvgContainer";
import StepOne from "@/Components/PageComponents/authPages/stepForm/StepOne";
import StepTwo from "@/Components/PageComponents/authPages/stepForm/StepTwo";
import StepFour from "@/Components/PageComponents/authPages/stepForm/StepFour";
import StepFive from "@/Components/PageComponents/authPages/stepForm/StepFive";
import StepThree from "@/Components/PageComponents/authPages/stepForm/StepThree";
import toast from "react-hot-toast";

type StepItem = {
  smLabel: string;
  lgLabel: string;
  component: React.ComponentType<any>;
};

const page = () => {
  const searchParams = useSearchParams();
  const newStep = Number(searchParams.get("step"));
  const [step, setStep] = useState<number>(1);
  const { mutateAsync: createShopMutation, isPending } = useCreateShop();
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
      shop_city: "",
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
      await createShopMutation(payload);
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (newStep && !isNaN(Number(newStep))) {
      setStep(newStep);
    }
  }, [newStep]);

  return (
    <section className="py-12">
      <Container>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Step bar */}
            <div className="flex 2xl:gap-28 xl:gap-x-20 gap-5 justify-center items-center">
              {steps.map((item, index) => {
                const isActive = index + 1 === step;
                const isCompleted = index + 1 < step;

                return (
                  <div
                    key={index}
                    className={`text-center ${
                      isActive ? "text-primary-green" : "text-[#A7A39C]"
                    }`}
                  >
                    <div
                      className={`rounded-full grid place-items-center mx-auto mb-2 ${
                        isActive || isCompleted
                          ? "bg-primary-green lg:size-12 size-6"
                          : "bg-[#77978F] lg:size-10 size-5"
                      }`}
                    >
                      {isActive && <StepSvg />}
                      {isCompleted && <CheckSvg />}
                    </div>

                    <p className="text-[12px] lg:text-[18px]">
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
              isPending={isPending}
            />
          </form>
        </FormProvider>
      </Container>
    </section>
  );
};

export default page;
