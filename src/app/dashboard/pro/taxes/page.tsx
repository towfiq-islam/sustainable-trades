"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Country, State } from "country-state-city";
import {
  getSalesTaxData,
  useAddSalesTax,
  useTaxes,
} from "@/Hooks/api/dashboard_api";
import Link from "next/link";
import useAuth from "@/Hooks/useAuth";

const allowedCountries = Country.getAllCountries().filter(
  country => country.isoCode === "US" || country.isoCode === "CA",
);

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
  const { user } = useAuth();
  console.log(user);
  const [apiKey, setApiKey] = useState(
    user?.shop_info?.ziptax_api_key ? user?.shop_info?.ziptax_api_key : "",
  );
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "automatic">("manual");
  const { mutate, isPending } = useTaxes();
  const { mutate: addSalesTaxMutate, isPending: isAddingSalesTax } =
    useAddSalesTax();
  const [country, setCountry] = useState<any>(null);
  const [state, setState] = useState<any>(null);
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
    setValue,
    formState: { errors },
  } = useForm<TaxForm>();

  const onSubmit = (data: TaxForm) => {
    const countryName = Country.getCountryByCode(country)?.name || "";

    const payload = {
      country: countryName,
      state: state,
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

      <p className="text-center text-base sm:text-lg max-w-3xl mx-auto text-secondary-gray mb-7">
        Choose how you'd like to calculate sales tax for your business. Set up a
        single local sales tax rate for local pickup orders, or connect ZipTax
        to automatically calculate sales tax based on your customer's address or
        pickup location at checkout.
      </p>

      <div className="flex  p-1.5 md:p-3 rounded-xl shadow w-full md:w-[500px] mx-auto bg-primary-green mb-7 md:mb-10">
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg cursor-pointer shadow font-semibold w-full text-sm md:text-base ${
            activeTab === "manual"
              ? "text-primary-green bg-accent-white"
              : "text-accent-white bg-transparent"
          }`}
        >
          Local Sales Tax
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
          Automatic Tax (ZipTax)
        </button>
      </div>

      {activeTab === "manual" ? (
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_0.9fr] gap-6">
            {/* Left Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm relative">
              {/* Active Status */}
              {user?.shop_info?.tax_provider === "manual" && (
                <p className="absolute right-3 top-3 rounded-full px-3.5 py-1 text-sm text-white bg-accent-red">
                  Active
                </p>
              )}

              <h2 className="text-2xl font-bold text-secondary-black">
                Add Local Tax Rate
              </h2>

              <p className="text-[#67645F] mt-2 mb-8">
                The local tax rate you enter here will be applied to every order
                at checkout.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Country */}
                <div>
                  <label className="block font-semibold text-secondary-black mb-2">
                    Country *
                  </label>

                  <select
                    {...register("country", {
                      required: "Country is required",
                    })}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg"
                    onChange={e => {
                      const selectedCountry = e.target.value;

                      setCountry(selectedCountry);
                      setState("");

                      setValue("country", selectedCountry, {
                        shouldValidate: true,
                      });

                      setValue("state", "");
                    }}
                  >
                    <option value="">Select Country</option>

                    {allowedCountries.map(country => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>

                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block font-semibold text-secondary-black mb-2">
                    State / Province *
                  </label>

                  <select
                    {...register("state", {
                      required: "State is required",
                    })}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg"
                    value={state}
                    onChange={e => {
                      const selectedState = e.target.value;

                      setState(selectedState);

                      setValue("state", selectedState, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <option value="">Select State / Province</option>

                    {State.getStatesOfCountry(country).map(item => (
                      <option key={item.isoCode} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* Tax Rate */}
                <div>
                  <label className="block font-semibold text-secondary-black mb-2">
                    Local Sales Tax Rate *
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...register("rate", {
                        required: "Tax rate is required",
                      })}
                      className="w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold">
                      %
                    </span>
                  </div>

                  {errors.rate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rate.message}
                    </p>
                  )}
                </div>

                {/* Digital Products */}
                <div className="flex items-center justify-between border-t pt-5">
                  <span className="font-semibold text-secondary-black">
                    Charge taxes on services and digital products
                  </span>

                  <button
                    type="button"
                    onClick={() => setChargeOnServices(!chargeOnServices)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      chargeOnServices ? "bg-primary-green" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        chargeOnServices ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between border-t pt-5">
                  <span className="font-semibold text-secondary-black">
                    Charge taxes on shipping
                  </span>

                  <button
                    type="button"
                    onClick={() => setChargeOnShipping(!chargeOnShipping)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      chargeOnShipping ? "bg-primary-green" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        chargeOnShipping ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary-green text-white h-12 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Local Tax Rate"}
                </button>
              </form>
            </div>

            {/* Right Info Panel */}
            <div className="bg-[#F9FCF9] border border-primary-green/20 rounded-2xl p-6">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center font-bold">
                      i
                    </div>

                    <h3 className="font-bold text-lg">About Local Tax Rate</h3>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    This option is ideal for sellers with a single physical
                    location who only offer local pickup and all their products
                    are taxed the same way.
                  </p>

                  <p className="text-gray-600 mt-3">
                    You set one sales tax rate that will be applied to every
                    order at checkout.
                  </p>
                </div>

                <hr />

                <div>
                  <h4 className="font-semibold text-lg mb-2">How it works</h4>

                  <p className="text-gray-600">
                    The tax rate you enter here will be applied to all orders.
                  </p>
                </div>

                <hr />

                <div>
                  <h4 className="font-semibold text-lg mb-2">Keep in mind</h4>

                  <p className="text-gray-600">
                    You are responsible for collecting and remitting sales tax
                    according to your local, state, and federal obligations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-6 bg-[#F4F9FF] border border-[#D7E8FF] rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h4 className="font-semibold text-secondary-black">
                Need to calculate sales tax based on your customer's address or
                pickup location?
              </h4>

              <p className="text-gray-600 text-sm mt-1">
                Switch to Automatic Tax (ZipTax) to connect your shop to ZipTax.
              </p>
            </div>

            <Link
              target="_blank"
              href="https://www.zip.tax"
              className="text-primary-green font-semibold underline"
            >
              Learn more about ZipTax
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Info Card */}
          <div className="border border-primary-green/30 rounded-2xl bg-[#FAFFFB] px-5 py-6 relative">
            {/* Active Status */}
            {user?.shop_info?.tax_provider === "ziptax" && (
              <p className="absolute right-3 top-3 rounded-full px-3.5 py-1 text-sm text-white bg-accent-red">
                Active
              </p>
            )}

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center text-white font-bold">
                i
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-secondary-black">
                  Automatic Sales Tax with ZipTax
                </h3>

                <p className="mt-2 text-gray-600">
                  Connect your shop to ZipTax to automatically calculate sales
                  tax during checkout.
                </p>

                <p className="text-gray-600">
                  ZipTax will return the appropriate rate based on the
                  customer's address or pickup location.
                </p>

                <div className="mt-4 space-y-2 text-gray-700">
                  <p className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked
                      className="accent-primary-green size-4"
                    />
                    <span>
                      <b>Free plan:</b> address-level sales tax calculation
                      (generic rate for the address).
                    </span>
                  </p>

                  <p className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked
                      className="accent-primary-green size-4"
                    />
                    <span>
                      <strong>Pro plan:</strong> product-level accuracy using
                      taxability codes (TICs) passed from Sustainable Trades,
                      higher request limits, and scalable for business growth.
                    </span>
                  </p>

                  <p className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked
                      className="accent-primary-green size-4"
                    />
                    <span>
                      <strong>You're in control:</strong> enable only the states
                      where you are required to collect sales tax.
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-8 mt-6">
                  <Link
                    target="_blank"
                    href="https://www.zip.tax/pricing"
                    className="text-primary-green font-medium underline"
                  >
                    Create a ZipTax Account
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowVideoModal(true)}
                    className="text-primary-green font-medium underline cursor-pointer"
                  >
                    Watch: How To Connect ZipTax
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left */}
              <div className="col-span-2">
                <label className="block font-semibold text-lg mb-2">
                  ZipTax API Key
                </label>

                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter ZipTax API Key"
                  className="w-full h-12 px-4 border rounded-lg"
                />

                <p className="text-sm text-gray-500 mt-2">
                  🔒 Your API key is secure and encrypted.
                </p>
              </div>

              {/* Right */}
              <div className="border border-primary-green/30 bg-[#FAFFFB] rounded-xl p-4">
                <h4 className="font-semibold text-lg mb-2">💡 How it works</h4>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Once connected, ZipTax will calculate the correct sales tax
                  rate based on the customer's shipping or pickup address at
                  checkout.
                </p>
              </div>
            </div>

            <div className="border-t my-6" />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-xl">
                  States Where I Collect Sales Tax
                </h3>

                <span className="text-gray-400">ⓘ</span>
              </div>

              <p className="text-gray-500 text-sm mb-6">
                Enable the states where you have sales tax collection
                obligations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4">
                {states.map((state: stateItem) => (
                  <div
                    key={state.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[15px] text-gray-700">
                      {state.name} ({state.code})
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStateToggle(state.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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

              {/* Reminder */}
              <div className="mt-6 border border-orange-200 bg-orange-50 rounded-xl p-4">
                <p className="text-orange-700 text-sm">
                  ⚠️ <strong>Reminder:</strong> Only enable states where you are
                  required to collect and remit sales tax.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isAddingSalesTax || !apiKey}
            onClick={handleSaveAutomaticTax}
            className="bg-primary-green text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAddingSalesTax ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {showVideoModal && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-2xl bg-white overflow-hidden"
          >
            {/* Video */}
            <div className="">
              <video controls autoPlay className="w-full rounded-lg">
                <source src="/videos/guide.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
