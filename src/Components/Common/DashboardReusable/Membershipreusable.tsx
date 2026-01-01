"use client";
import React, { useState, useEffect } from "react";
import PauseMembershipModal from "@/Components/Modals/PauseMembershipModal";
import useAuth from "@/Hooks/useAuth";
import { useMembershipget } from "@/Hooks/api/dashboard_api";

interface MembershipReusableProps {
  membershipType: "Basic" | "Pro" | "Shopper";
}

const Membershipreusable: React.FC<MembershipReusableProps> = ({
  membershipType,
}) => {
  const tabs = ["Yearly (Save 38%)", "Monthly"];
  const [isactive, setIsactive] = useState<string>("Yearly (Save 38%)");
  const [pauseOpen, setPauseOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const { data: membership } = useMembershipget();

  const [currentMembershipType, setCurrentMembershipType] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (user?.membership?.membership_type) {
      setCurrentMembershipType(user.membership.membership_type.toLowerCase());
    }
  }, [user]);

  const selectedMembershipType = currentMembershipType || "basic";

  const membershipMessages: Record<
    MembershipReusableProps["membershipType"],
    string
  > = {
    Basic: "You currently have a Basic membership.",
    Pro: "You currently have a Pro membership.",
    Shopper: "You currently have a Shopper membership.",
  };

  return (
    <div>
      {/* Header and Tabs */}
      <div className="flex gap-3.5 md:gap-0 flex-col md:flex-row justify-between items-center">
        <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000]">
          Membership Details
        </h2>
        <div className="flex gap-x-2 items-center border border-[#A7A39C] rounded-[8px]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setIsactive(tab)}
              className={`p-2 md:p-4 text-[12px] md:text-[16px] font-normal rounded-md transition cursor-pointer ${
                tab === isactive
                  ? "text-white bg-black"
                  : "text-black bg-transparent hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Membership Cards */}
      <div className="mt-10 md:mt-20">
        <div className="flex gap-10 justify-center flex-wrap">
          {membership?.data?.map((item: any) => {
            const isSelected =
              item.membership_type?.toLowerCase() === selectedMembershipType;

            return (
              <div
                key={item.id}
                className={`border border-primary-green shadow rounded-2xl p-6 w-full lg:w-[400px] flex flex-col justify-between relative ${
                  isSelected
                    ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50"
                    : ""
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Current
                  </div>
                )}

                <div>
                  {/* ✅ Show backend image */}
                  <figure className="size-16 mb-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </figure>

                  <h3 className="py-1.5 md:py-3 text-xl md:text-2xl font-semibold text-secondary-black">
                    {item.name}
                  </h3>
                  <p className="text-secondary-gray text-[13px] md:text-base mb-3.5 md:mb-7">
                    {item.description}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-semibold text-secondary-black">
                    ${item.price}
                  </h2>
                  <hr className="my-2.5 md:my-5 text-gray-500" />

                  {/* ✅ Subscription Benefits */}
                  <div className="space-y-5 mb-5 md:mb-10">
                    {item.subscription_benefit?.length ? (
                      item.subscription_benefit.map((benefit: any) => (
                        <div
                          key={benefit.id}
                          className="flex gap-3 items-center mb-3"
                        >
                          <div className="size-10 rounded-full bg-[#B0DEDB] grid place-items-center">
                            {benefit.benefit_icon ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${benefit.benefit_icon}`}
                                alt=""
                                className="w-6 h-6"
                              />
                            ) : (
                              <span>🌿</span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-secondary-black font-semibold">
                              {benefit.benefit_name || "Feature"}
                            </h4>
                            <p className="text-secondary-gray text-[15px]">
                              {benefit.benefit_description ||
                                "No description available"}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No benefits listed.
                      </p>
                    )}
                  </div>
                </div>

                {/* ✅ Button */}
                <button
                  disabled={isSelected}
                  className={`w-full block duration-500 transition-all text-base md:text-lg cursor-pointer py-1.5 md:py-3 border-2 border-primary-green font-semibold rounded-lg shadow-lg hover:scale-105 ${
                    isSelected
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "text-accent-white bg-primary-green hover:text-primary-green hover:bg-transparent"
                  }`}
                >
                  {isSelected ? "Current Plan" : "Choose Plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Membership Status + Pause */}
      <div className="mt-10 border border-[#274F45] rounded-lg p-6 max-w-[850px] mx-auto">
        <p className="text-[#2D2D2D] font-semibold text-[20px] mb-4">pro</p>
        <p className="text-[#2D2D2D] text-sm mb-6">
          Cancel or upgrade to Pro by choosing premium above. Refunds will not
          be issued for canceled memberships, however we will prorate the Pro
          membership if you are upgrading from Basic.
        </p>

        <div className="flex justify-end gap-4">
          <button className="px-6 py-2 bg-yellow-500 cursor-pointer rounded-lg shadow hover:bg-yellow-600 text-[#2D2D2D] font-semibold text-[16px]">
            Pause Membership
          </button>
          <button className="px-6 py-2 bg-red-500 cursor-pointer rounded-lg shadow hover:bg-red-600 text-[#2D2D2D] font-semibold text-[16px]">
            Cancel
          </button>
        </div>
      </div>

      {/* Pause Modal */}
      <PauseMembershipModal
        isOpen={pauseOpen}
        onClose={() => setPauseOpen(false)}
        onConfirm={(duration: number) => {
          console.log(`Paused ${membershipType} for ${duration} months`);
          setPauseOpen(false);
        }}
        membershipType={membershipType}
      />
    </div>
  );
};

export default Membershipreusable;
