"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getSalesTaxData,
  useAddSalesTax,
  useTaxes,
} from "@/Hooks/api/dashboard_api";

type stateItem = {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
};

type TaxForm = {
  country: string;
  state: string;
  rate: string;
};

export default function TaxRatePage() {
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState<"manual" | "automatic">("manual");
  const { mutate, isPending } = useTaxes();
  const { mutate: addSalesTaxMutate, isPending: isAddingSalesTax } =
    useAddSalesTax();
  const { data: taxData } = getSalesTaxData();
  const [chargeOnServices, setChargeOnServices] = useState(true);
  const [chargeOnShipping, setChargeOnShipping] = useState(false);
  const [states, setStates] = useState(taxData?.data?.states || []);

  const handleStateToggle = (id: number) => {
    setStates((prev: any[]) =>
      prev.map(state =>
        state.id === id ? { ...state, enabled: !state.enabled } : state,
      ),
    );
  };

  const handleSaveAutomaticTax = () => {
    const payload = {
      tax_provider: "ziptax",
      ziptax_api_key: apiKey,
      states: states.map((state: stateItem) => ({
        id: state.id,
        enabled: state.enabled,
      })),
    };

    addSalesTaxMutate(payload);
  };

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

  useEffect(() => {
    if (taxData?.data?.states) {
      setStates(taxData.data.states);
    }
  }, [taxData]);

  return (
    <section>
      <h2 className="section_title text-center !mb-4 md:!mb-7">Sales Tax</h2>

      <p className="text-center text-base sm:text-lg max-w-3xl mx-auto text-[#4B4A47] mb-7">
        Set up your sales tax rates for different regions. You can choose to
        charge taxes on services, digital products, and shipping to ensure
        compliance with local tax regulations.
      </p>

      <div className="flex md:gap-5 p-1.5 md:p-3 rounded-xl shadow w-full md:w-[380px] mx-auto bg-primary-green mb-7 md:mb-10">
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg cursor-pointer shadow font-semibold w-full text-sm md:text-base ${
            activeTab === "manual"
              ? "text-primary-green bg-accent-white"
              : "text-accent-white bg-transparent"
          }`}
        >
          Manual Tax
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("automatic")}
          className={`px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg cursor-pointer shadow font-semibold w-full text-sm md:text-base ${
            activeTab === "automatic"
              ? "text-primary-green bg-accent-white"
              : "text-accent-white bg-transparent"
          }`}
        >
          Automatic Tax
        </button>
      </div>

      {activeTab === "manual" ? (
        <div className="max-w-full md:max-w-xl mx-auto mt-10 bg-[#FFFCF9] shadow-lg rounded-[20px] p-4 md:p-8 border border-gray-200">
          {/* Header */}
          <div>
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#000000]">
              Add Tax Rate
            </h2>
            <p className="text-[12px] md:text-[14px] text-[#67645F] mt-2 leading-relaxed">
              The sales tax rate manually entered here will only apply at
              checkout when both 'Arrange Local Pickup' and 'Pay with Cash' are
              selected by the buyer.
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
      ) : (
        <div className="space-y-5 max-w-full md:max-w-xl mx-auto mt-10 bg-[#FFFCF9] shadow-lg rounded-[20px] p-4 md:p-8 border border-gray-200">
          <div>
            <label className="block font-semibold mb-2">ZipTax API Key</label>

            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Enter ZipTax API Key"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3">Enable States</h3>

            <div className="max-h-[400px] overflow-y-auto grid grid-cols-2 pe-4 gap-y-5 gap-x-16">
              {states.map((state: stateItem) => (
                <div
                  key={state.id}
                  className="flex items-center justify-between"
                >
                  <span>
                    {state.name} ({state.code})
                  </span>

                  <button
                    type="button"
                    onClick={() => handleStateToggle(state.id)}
                    className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                      state.enabled ? "bg-primary-green" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        state.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={isAddingSalesTax || !apiKey}
            onClick={handleSaveAutomaticTax}
            className="w-full bg-primary-green cursor-pointer font-semibold text-white py-3 rounded-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAddingSalesTax ? "Saving..." : "Save Automatic Tax"}
          </button>
        </div>
      )}
    </section>
  );
}
