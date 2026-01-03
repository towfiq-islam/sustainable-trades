"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTaxes } from "@/Hooks/api/dashboard_api";

type TaxForm = {
  country: string;
  state: string;
  rate: string;
};

export default function TaxRatePage() {
  const { mutate, isPending } = useTaxes();
  const [chargeOnServices, setChargeOnServices] = useState(true);
  const [chargeOnShipping, setChargeOnShipping] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaxForm>();

  const onSubmit = (data: TaxForm) => {
    const payload = {
      country: data.country,
      state: data.state,
      rate: data.rate,
      is_digital_products: chargeOnServices ? 1 : 0,
      is_shipping: chargeOnShipping ? 1 : 0,
    };

    mutate(payload, {
      onSuccess: (res: any) => {
        if (res?.success) {
          reset();
          setChargeOnServices(true);
          setChargeOnShipping(false);
        }
      },
    });
  };

  return (
    <main className="h-fit mx-auto flex justify-center">
      <div className="w-full md:max-w-md mx-auto mt-10 bg-[#FFFCF9] shadow-2xl rounded-[20px] p-4 md:p-8 border border-gray-200">
        {/* Header */}
        <div>
          <h2 className="text-[20px] md:text-[24px] font-bold text-[#000000]">
            Add Tax Rate
          </h2>
          <p className="text-[12px] md:text-[14px] text-[#67645F] mt-2 leading-relaxed">
            The sales tax rate manually entered here will only apply at checkout
            when both 'Arrange Local Pickup' and 'Pay with Cash' are selected by
            the buyer.
          </p>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 md:space-y-5 mt-3 md:mt-6"
        >
          {/* Country */}
          <div className="space-y-2">
            <label className="text-[16px] md:text-[20px] font-semibold text-[#13141D] block mb-2">
              Country *
            </label>
            <input
              type="text"
              {...register("country", { required: "Country is required" })}
              className="w-full px-4 py-1.5 md:py-3 bg-white border-2 border-[#67645F]
              cursor-pointer rounded-[8px] focus:outline-none focus:border-[#67645F]
              text-[16px] text-[#67645F]"
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="text-[16px] md:text-[20px] font-semibold text-[#13141D] block mb-2">
              State *
            </label>
            <input
              type="text"
              {...register("state", { required: "State is required" })}
              className="w-full px-4 py-1.5 md:py-3 bg-white border-2 border-[#67645F]
              cursor-pointer rounded-[8px] focus:outline-none focus:border-[#67645F]
              text-[16px] text-[#67645F]"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>

          {/* Tax */}
          <div className="space-y-2">
            <label className="text-[16px] md:text-[20px] font-semibold text-[#13141D] block mb-2">
              Local Sales Tax Rate
            </label>

            <div className="flex items-center border-b-2 pb-1 border-[#A7A39C]">
              <input
                type="number"
                {...register("rate", {
                  required: "Tax rate is required",
                  min: { value: 0, message: "Rate must be positive" },
                })}
                placeholder="0"
                className="flex-1 text-[16px] font-semibold text-[#13141D]
                bg-transparent border-none outline-none"
              />
              <span className="text-[16px] font-semibold text-[#13141D]">
                %
              </span>
            </div>
            {errors.rate && (
              <p className="text-red-500 text-sm">{errors.rate.message}</p>
            )}
          </div>

          <div className="space-y-6">
            {/* Digital Products */}
            <div className="flex items-center justify-between border-b md:pb-5 border-[#A7A39C]">
              <div className="flex-1 pr-4">
                <label className="text-[16px] md:text-[20px] font-semibold text-[#000]">
                  Charge taxes on services and <br /> digital products
                </label>
              </div>

              <button
                type="button"
                onClick={() => setChargeOnServices(!chargeOnServices)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors
                ${chargeOnServices ? "bg-primary-green" : "bg-[#D1D5DB]"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${chargeOnServices ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between pt-2 pb-2">
              <div className="flex-1 pr-4">
                <label className="text-[16px] md:text-[20px] font-semibold text-[#000]">
                  Charge taxes on shipping
                </label>
              </div>

              <button
                type="button"
                onClick={() => setChargeOnShipping(!chargeOnShipping)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors
                ${chargeOnShipping ? "bg-primary-green" : "bg-[#D1D5DB]"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${chargeOnShipping ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary-green text-[#FEFEFE]
              font-semibold py-2 md:py-4 rounded-[8px] duration-500 ease-in-out
              text-[16px] md:text-[20px] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save Tax Rate"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
