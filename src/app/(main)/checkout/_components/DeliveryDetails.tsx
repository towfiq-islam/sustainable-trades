"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "@/redux/store";
import { fulfillmentLabel } from "@/lib/fulfillment";
import VendorProgressBar from "./VendorProgressBar";
import { Country, State } from "country-state-city";
const allowedCountries = Country.getAllCountries().filter(
  country => country.isoCode === "US" || country.isoCode === "CA",
);

const DeliveryDetails = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);
  const { register } = useFormContext();
  const [vendorIndex, setVendorIndex] = useState(0);
  const [country, setCountry] = useState<any>(null);
  const [state, setState] = useState<any>(null);

  const vendor = items[vendorIndex];
  if (!vendor) return null;

  const fulfillment = vendor.selectedFulfillment;
  const isLastVendor = vendorIndex === items.length - 1;
  const isFirstVendor = vendorIndex === 0;
  const base = `vendors.${vendor.vendor_id}`;

  const handleBack = () => {
    if (isFirstVendor) router.push("/checkout?step=delivery-options");
    else setVendorIndex(i => i - 1);
  };

  const handleNext = () => {
    if (isLastVendor) router.push("/checkout?step=review-order");
    else {
      setVendorIndex(i => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white">
      <VendorProgressBar current={vendorIndex + 1} total={items.length} />

      <h3 className="text-xl font-semibold text-secondary-black mb-5">
        {fulfillment ? fulfillmentLabel[fulfillment] : "Fulfillment"} —{" "}
        {vendor.shop_name}
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex gap-4 items-center">
          <input
            {...register(`${base}.name`)}
            placeholder="First Name"
            className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
          />
          <input
            {...register(`${base}.name`)}
            placeholder="Last Name"
            className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
          />
        </div>

        <div className="flex gap-4 items-center">
          <input
            {...register(`${base}.phone`)}
            placeholder="Phone"
            className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
          />
          <input
            {...register(`${base}.email`)}
            placeholder="Email"
            className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
          />
        </div>

        {(fulfillment === "delivery" || fulfillment === "shipping") && (
          <div className="space-y-3">
            <textarea
              {...register(`${base}.address`)}
              rows={3}
              placeholder={
                fulfillment === "shipping"
                  ? "Shipping address"
                  : "Delivery address"
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
            ></textarea>

            <input
              {...register(`${base}.apt`)}
              placeholder="Apartment, suite, etc. (optional)"
              className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
            />

            <div className="flex gap-4 items-center">
              <input
                {...register(`${base}.city`)}
                placeholder="City"
                className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
              />

              <input
                {...register(`${base}.zip`)}
                placeholder="Zip Code"
                className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
              />
            </div>

            <div className="flex gap-4 items-center">
              <select
                value={country || ""}
                {...register("country", { required: true })}
                className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
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

              <select
                {...register("state", { required: true })}
                className={`flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green`}
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
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name} ({item.isoCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {fulfillment === "pickup" && (
          <select
            {...register(`${base}.pickupLocation`)}
            className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
          >
            <option value="">Select a pickup location</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        )}
      </div>

      <div className="flex gap-3 justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-3 rounded-lg border border-gray-300 font-semibold text-secondary-black cursor-pointer hover:bg-gray-50"
        >
          {isFirstVendor ? "Back" : "Back"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 rounded-lg bg-primary-green text-white font-semibold cursor-pointer hover:scale-95 transition-all duration-300"
        >
          {isLastVendor ? "Review order" : "Next vendor"}
        </button>
      </div>
    </div>
  );
};

export default DeliveryDetails;
