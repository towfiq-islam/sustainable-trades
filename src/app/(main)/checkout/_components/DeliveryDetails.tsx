"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "@/redux/store";
import { fulfillmentLabel } from "@/lib/fulfillment";
import VendorProgressBar from "./VendorProgressBar";
import { Country, State } from "country-state-city";

const allowedCountries = Country.getAllCountries().filter(
  country => country.isoCode === "US" || country.isoCode === "CA",
);

const fieldClass = (hasError: boolean) =>
  `flex-1 w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-green ${
    hasError
      ? "border-red-500 placeholder:text-red-500"
      : "border-gray-300 placeholder:text-gray-400"
  }`;

const DeliveryDetails = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);
  const {
    register,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [vendorIndex, setVendorIndex] = useState(0);

  const vendor = items[vendorIndex];
  if (!vendor) return null;
  const fulfillment = vendor.selectedFulfillment;
  const isLastVendor = vendorIndex === items.length - 1;
  const isFirstVendor = vendorIndex === 0;
  const base = `vendors.${vendor.vendor_id}`;
  const needsAddress = fulfillment === "delivery" || fulfillment === "shipping";
  const isPickup = fulfillment === "pickup";

  const fieldsForFulfillment = [
    `${base}.first_name`,
    `${base}.last_name`,
    `${base}.email`,
    `${base}.phone`,
    ...(needsAddress
      ? [
          `${base}.street_address`,
          `${base}.city`,
          `${base}.postal_code`,
          `${base}.state`,
          `${base}.country`,
        ]
      : []),
    ...(isPickup ? [`${base}.pickupLocation`] : []),
  ];

  const selectedCountry = watch(`${base}.country`);
  // Namespaced per vendor so vendor A's errors never light up vendor B's fields.
  const vendorErrors = (errors as any)?.vendors?.[vendor.vendor_id] ?? {};

  // Browser autofill (Google saved data / autosuggest) writes values straight
  // into the DOM and does not always fire the events react-hook-form listens
  // to, so RHF's internal state stays empty and validation keeps failing.
  // Pull the live DOM values back into the form before validating.
  const syncFromDom = (fields: string[]) => {
    fields.forEach(field => {
      const el = document.querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >(`[name="${field}"]`);
      if (el && !el.disabled && el.value !== getValues(field)) {
        setValue(field, el.value);
      }
    });
  };

  // Chrome may autofill right after mount or right after a dropdown pick, so
  // keep the form state in sync (this also unlocks the state/province select
  // when the browser autofills the country).
  useEffect(() => {
    syncFromDom(fieldsForFulfillment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, needsAddress, isPickup]);

  const handleBack = () => {
    if (isFirstVendor) router.push("/checkout?step=delivery-options");
    else setVendorIndex(i => i - 1);
  };

  const handleNext = async () => {
    syncFromDom(fieldsForFulfillment);

    const valid = await trigger(fieldsForFulfillment);
    if (!valid) return;

    const values = getValues(base);
    console.log({
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      street_address: values.street_address,
      apt: values.apt,
      postal_code: values.postal_code,
      city: values.city,
      state: values.state,
      country: values.country,
    });

    if (isLastVendor) router.push("/checkout?step=review-order");
    else {
      setVendorIndex(i => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white">
      <VendorProgressBar current={vendorIndex + 1} total={items.length} />

      <h3 className="text-lg font-semibold text-secondary-black mb-1 flex gap-3 items-center">
        Sold by {vendor.shop_name}
        <p className="size-2 rounded-full bg-primary-green" />
        Delivery Method:{" "}
        {fulfillment ? fulfillmentLabel[fulfillment] : "Fulfillment"}
      </h3>

      <p className="text-gray-500 text-[15px] mb-5 max-w-lg">
        Please provide the shipping details for this seller. You'll review
        everything before your order is placed.
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex gap-4 items-center">
          <input
            {...register(`${base}.first_name`, { required: true })}
            autoComplete="given-name"
            placeholder="First Name"
            className={fieldClass(!!vendorErrors.first_name)}
          />
          <input
            {...register(`${base}.last_name`, { required: true })}
            autoComplete="family-name"
            placeholder="Last Name"
            className={fieldClass(!!vendorErrors.last_name)}
          />
        </div>

        <div className="flex gap-4 items-center">
          <input
            {...register(`${base}.phone`, { required: true })}
            autoComplete="tel"
            placeholder="Phone"
            className={fieldClass(!!vendorErrors.phone)}
          />
          <input
            {...register(`${base}.email`, {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
            autoComplete="email"
            placeholder="Email"
            className={fieldClass(!!vendorErrors.email)}
          />
        </div>

        {needsAddress && (
          <div className="space-y-3">
            <input
              {...register(`${base}.street_address`, { required: true })}
              autoComplete="street-address"
              placeholder="Street Address"
              className={fieldClass(!!vendorErrors.street_address)}
            />

            <input
              {...register(`${base}.apt`)}
              autoComplete="address-line2"
              placeholder="Apartment, suite, etc. (optional)"
              className={fieldClass(false)}
            />

            <div className="flex gap-4 items-center">
              <input
                {...register(`${base}.city`, { required: true })}
                autoComplete="address-level2"
                placeholder="City"
                className={fieldClass(!!vendorErrors.city)}
              />
              <input
                {...register(`${base}.postal_code`, { required: true })}
                autoComplete="postal-code"
                placeholder="Zip Code"
                className={fieldClass(!!vendorErrors.postal_code)}
              />
            </div>

            <div className="flex gap-4 items-center">
              <select
                {...register(`${base}.country`, {
                  required: true,
                  onChange: () => setValue(`${base}.state`, ""),
                })}
                autoComplete="country"
                className={fieldClass(!!vendorErrors.country)}
              >
                <option value="">Select Country</option>
                {allowedCountries.map(c => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                {...register(`${base}.state`, { required: true })}
                autoComplete="address-level1"
                className={fieldClass(!!vendorErrors.state)}
                disabled={!selectedCountry}
              >
                <option value="">Select State / Province</option>
                {State.getStatesOfCountry(selectedCountry).map(item => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name} ({item.isoCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {isPickup && (
          <select
            {...register(`${base}.pickupLocation`, { required: true })}
            className={fieldClass(!!vendorErrors.pickupLocation)}
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
          Back
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
