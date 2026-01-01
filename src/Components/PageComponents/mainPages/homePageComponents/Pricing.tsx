"use client";
import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { useRouter } from "next/navigation";
import Modal from "@/Components/Common/Modal";
import { getPricingData } from "@/Hooks/api/cms_api";
import Container from "@/Components/Common/Container";
import { PricingSkeletonCard } from "@/Components/Loader/Loader";
import SubscriptionPaypalModal from "@/Components/Modals/SubscriptionPaypalModal";
import { useCancelMembership } from "@/Hooks/api/dashboard_api";

type benefitItem = {
  id: string;
  benefit_name: string;
  benefit_description: string;
  benefit_icon: string;
};

type pricingData = {
  id: number;
  name: string;
  description: string;
  price: string;
  interval: string;
  image: string;
  membership_type: string;
  subscription_benefit: benefitItem[];
};

interface PricingProps {
  description: string;
  button1: string;
  button2: string;
  isCancel?: boolean;
}

const Pricing = ({
  description,
  button1,
  button2,
  isCancel = false,
}: PricingProps) => {
  // Hook
  const { user } = useAuth();
  const router = useRouter();

  // States
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [isOpen, setOpen] = useState<boolean>(false);
  const [planId, setPlanId] = useState<number>(0);
  const [interval, setInterval] = useState<string>("");

  // Queries & Mutations
  const { mutate: cancelMembership, isPending } = useCancelMembership();
  const { data: pricingData, isLoading } = getPricingData(activeTab);

  return (
    <section id="membership_plan" className="py-8 md:py-20">
      <Container>
        <h2 className="section_title text-center !mb-4 md:!mb-7">
          Plans & Benefits
        </h2>

        <p className="text-center text-base sm:text-lg md:text-xl text-[#4B4A47] mb-7">
          {description}
        </p>

        {/* Tabs */}
        <div className="flex md:gap-5 p-1.5 md:p-3 rounded-xl shadow w-full md:w-[380px] mx-auto bg-primary-green mb-7 md:mb-14">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab("yearly");
            }}
            className={`px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg cursor-pointer shadow font-semibold w-full text-sm md:text-base ${
              activeTab === "yearly"
                ? "text-primary-green bg-accent-white"
                : "text-accent-white bg-transparent"
            }`}
          >
            {button1}
          </button>

          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab("monthly");
            }}
            className={`px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg cursor-pointer shadow font-semibold w-full text-sm md:text-base ${
              activeTab === "monthly"
                ? "text-primary-green bg-accent-white"
                : "text-accent-white bg-transparent"
            }`}
          >
            {button2}
          </button>
        </div>

        {/* Pricing Plan */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-10 justify-center">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <PricingSkeletonCard key={i} />
              ))
            : pricingData?.data?.map(
                (
                  {
                    id,
                    name,
                    description,
                    price,
                    interval,
                    subscription_benefit,
                    membership_type,
                    image,
                  }: pricingData,
                  idx: number
                ) => (
                  <div
                    key={id}
                    className={`border border-primary-green shadow rounded-2xl p-4 md:p-6 w-full md:w-[400px] flex flex-col justify-between ${
                      user?.membership?.status === "active" &&
                      user?.membership?.membership_type === membership_type &&
                      user?.membership?.type === interval
                        ? "bg-[#EDF3F1]"
                        : user?.membership?.status !== "active" &&
                          idx === 1 &&
                          "bg-[#EDF3F1]"
                    }`}
                  >
                    <div>
                      <figure className="size-8 md:size-12 rounded-full bg-[#B0DEDB] grid place-items-center">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SITE_URL}/${image}`}
                          alt="logo"
                          width={45}
                          height={45}
                          unoptimized
                        />
                      </figure>

                      <h3 className="py-1 md:py-3 text-xl md:text-2xl font-semibold text-secondary-black">
                        {name}
                      </h3>

                      <p className="text-secondary-gray md:mb-7 mb-4 text-sm md:text-base ">
                        {description}
                      </p>

                      <div className="flex gap-2 items-end">
                        <h2 className="text-3xl md:text-4xl font-semibold text-secondary-black">
                          ${price}
                        </h2>

                        <p className="capitalize">/ {interval}</p>
                      </div>

                      <hr className="my-5 text-gray-500" />

                      <div className="space-y-5 mb-10">
                        {subscription_benefit?.map(
                          ({
                            id,
                            benefit_name,
                            benefit_description,
                            benefit_icon,
                          }) => (
                            <div key={id} className="flex gap-2 md:gap-3">
                              <figure className="size-8 md:size-10 rounded-full bg-[#B0DEDB] grid place-items-center shrink-0">
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${benefit_icon}`}
                                  alt="image"
                                  width={24}
                                  height={24}
                                  unoptimized
                                />
                              </figure>

                              <div>
                                <h4 className="text-secondary-black text-sm md:text-base font-semibold">
                                  {benefit_name}
                                </h4>

                                <p className="text-secondary-gray text-xs md:text-[15px]">
                                  {benefit_description}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <button
                      disabled={
                        user?.membership?.status === "active" &&
                        user?.membership?.membership_type === membership_type &&
                        user?.membership?.type === interval
                      }
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!user) {
                          router.push("/auth/login");
                        } else {
                          setPlanId(id);
                          setInterval(interval);
                          setOpen(true);
                        }
                      }}
                      className={`w-full block duration-500 transition-all md:text-lg cursor-pointer py-1.5 md:py-3 border-2 border-primary-green font-semibold rounded-lg shadow-lg hover:scale-105 ${
                        idx === 0
                          ? "text-primary-green hover:bg-primary-green hover:text-accent-white"
                          : "text-accent-white hover:text-primary-green bg-primary-green hover:bg-transparent"
                      }
                      ${
                        user?.membership?.status === "active" &&
                        user?.membership?.membership_type === membership_type &&
                        user?.membership?.type === interval &&
                        "opacity-70 !cursor-not-allowed hover:!scale-100 !bg-primary-green !text-accent-white"
                      }
                        `}
                    >
                      {user?.membership?.status === "active" &&
                      user?.membership?.membership_type === membership_type &&
                      user?.membership?.type === interval
                        ? "Purchased"
                        : `Choose ${name}`}
                    </button>
                  </div>
                )
              )}
        </div>

        {/* Cancel btn */}
        {isCancel && user?.membership?.status === "active" && (
          <div className="mt-10 border border-[#274F45] rounded-lg p-6 max-w-[850px] mx-auto">
            <p className="text-[#2D2D2D] font-semibold text-2xl capitalize mb-4">
              {user?.membership?.membership_type}
            </p>
            <p className="text-[#2D2D2D] mb-6">
              Cancel or upgrade to Pro by choosing premium above. Refunds will
              not be issued for canceled memberships, however we will prorate
              the Pro membership if you are upgrading from Basic.
            </p>

            <div className="flex justify-end gap-4">
              <button
                disabled={isPending}
                onClick={() => cancelMembership()}
                className={`px-6 py-2 bg-red-500 rounded-lg shadow hover:bg-red-600 text-white font-semibold text-[16px] ${
                  isPending ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isPending ? (
                  <p className="flex gap-2 items-center justify-center">
                    <CgSpinnerTwo className="animate-spin text-xl" />
                    <span>Please wait....</span>
                  </p>
                ) : (
                  "Cancel"
                )}
              </button>
            </div>
          </div>
        )}
      </Container>

      <Modal open={isOpen} onClose={() => setOpen(false)}>
        <SubscriptionPaypalModal planId={planId} interval={interval} />
      </Modal>
    </section>
  );
};

export default Pricing;
