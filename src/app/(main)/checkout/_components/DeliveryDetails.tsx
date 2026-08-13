"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppDispatch } from "@/redux/store";
import { fulfillmentLabel } from "@/lib/fulfillment";
import VendorProgressBar from "./VendorProgressBar";
import { State } from "country-state-city";
import { useGetAllPickupLocationsQuery } from "@/redux/api/vendorApi";
import useAuth from "@/Hooks/useAuth";
import PickupLocationSelect from "./PickupLocationSelect";
import { buildVendorOrdersPayload, VendorFormValues } from "@/lib/checkout";
import { useGetShippingTaxMutation } from "@/redux/api/taxApi";
import toast from "react-hot-toast";
import { getLatLng } from "@/lib/getLatLng";
import {
  setCheckoutPricing,
  setVendorPickupLocation,
} from "@/redux/slices/checkoutSlice";
import { CartItem } from "@/redux/slices/cartSlice";
import Modal from "@/Components/Common/Modal";
import { IoIosInformationCircle } from "react-icons/io";

const US_COUNTRY_CODE = "US";
const usStates = State.getStatesOfCountry(US_COUNTRY_CODE);

const fieldClass = (hasError: boolean) =>
  `flex-1 w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-green ${
    hasError
      ? "border-red-500 placeholder:text-red-500"
      : "border-gray-300 placeholder:text-gray-400"
  }`;

const DeliveryDetails = ({ items }: { items: CartItem[] }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { latitude, longitude } = useAuth();
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [deliveryUnavailableOpen, setDeliveryUnavailableOpen] = useState(false);

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

  const [calculateTaxAndShippingCost, { isLoading }] =
    useGetShippingTaxMutation();
  const { data: allPickupLocations } = useGetAllPickupLocationsQuery(
    {
      vendor_id: vendor.vendor_id,
      latitude,
      longitude,
    },
    { skip: !isPickup || !vendor.vendor_id },
  );

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
        ]
      : []),

    ...(isPickup ? [`${base}.pickup_id`] : []),
  ];

  const selectedState = watch(`${base}.state`);
  const vendorErrors = (errors as any)?.vendors?.[vendor.vendor_id] ?? {};
  const syncFromDom = (fields: string[]) => {
    fields.forEach(field => {
      const el = document.querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >(`[name="${field}"]`);
      if (el && !el.disabled && el.value && el.value !== getValues(field)) {
        setValue(field, el.value);
      }
    });
  };

  const watchedAddressFields = watch([
    `${base}.street_address`,
    `${base}.apt`,
    `${base}.city`,
    `${base}.state`,
    `${base}.postal_code`,
  ]);

  useEffect(() => {
    setValue(`${base}.latitude`, undefined);
    setValue(`${base}.longitude`, undefined);
  }, watchedAddressFields);

  useEffect(() => {
    syncFromDom(fieldsForFulfillment);
    if (needsAddress && !getValues(`${base}.country`)) {
      setValue(`${base}.country`, US_COUNTRY_CODE);
    }
  }, [base, needsAddress, isPickup]);

  const buildStepUrl = (step: string) => {
    const params = new URLSearchParams();
    params.set("step", step);
    if (mode) params.set("mode", mode);
    return `/checkout?${params.toString()}`;
  };

  const handleBack = () => {
    if (isFirstVendor) router.push(buildStepUrl("delivery-options"));
    else setVendorIndex(i => i - 1);
  };
  const handleNext = async () => {
    if (isGeocoding || isLoading) return;
    syncFromDom(fieldsForFulfillment);
    const valid = await trigger(fieldsForFulfillment);
    if (!valid) return;
    const values = getValues(base);

    if (isLastVendor) {
      setIsGeocoding(true);
      try {
        await Promise.all(
          items.map(async v => {
            const vendorNeedsAddress =
              v.selectedFulfillment === "delivery" ||
              v.selectedFulfillment === "shipping";
            if (!vendorNeedsAddress) return;

            const vBase = `vendors.${v.vendor_id}`;
            const vValues = getValues(vBase);
            if (vValues?.latitude && vValues?.longitude) return;

            const fullAddress = [
              vValues?.street_address,
              vValues?.apt,
              vValues?.city,
              vValues?.state,
              vValues?.postal_code,
              "United States",
            ]
              .filter(Boolean)
              .join(", ");

            if (!fullAddress) return;

            const { lat, lng } = await getLatLng(fullAddress);
            if (lat !== null) setValue(`${vBase}.latitude`, lat);
            if (lng !== null) setValue(`${vBase}.longitude`, lng);
          }),
        );

        const { vendors: formValues } = getValues() as {
          vendors: VendorFormValues;
        };
        const payload = buildVendorOrdersPayload(items, formValues);
        const res = await calculateTaxAndShippingCost(payload).unwrap();

        if (res?.success) {
          dispatch(setCheckoutPricing(res.data));
          toast.success(res?.message);
          router.push(buildStepUrl("review-order"));
        }
      } catch (err: any) {
        if (
          err?.data?.message ===
          "Local delivery is not available for this address."
        ) {
          setDeliveryUnavailableOpen(true);
        } else {
          toast.error(
            err?.data?.message ?? "Something went wrong. Please try again.",
          );
        }
      } finally {
        setIsGeocoding(false);
      }
    } else {
      const nextVendor = items[vendorIndex + 1];
      const nextBase = `vendors.${nextVendor.vendor_id}`;
      const nextNeedsAddress =
        nextVendor.selectedFulfillment === "delivery" ||
        nextVendor.selectedFulfillment === "shipping";

      const fieldsToCopy = [
        "first_name",
        "last_name",
        "email",
        "phone",
        ...(nextNeedsAddress
          ? ["street_address", "apt", "postal_code", "city", "state", "country"]
          : []),
      ];

      fieldsToCopy.forEach(field => {
        const value = values[field];
        if (!value) return;
        if (getValues(`${nextBase}.${field}`)) return;
        if (field === "state") {
          if (!values.country) return;
          const validStates = State.getStatesOfCountry(values.country);
          if (!validStates.some(s => s.isoCode === value)) return;
        }
        setValue(`${nextBase}.${field}`, value);
      });

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
        {fulfillment === "pickup"
          ? "Please select your pickup location below. You'll review everything before your order is placed."
          : fulfillment === "delivery"
            ? "Please enter your address for delivery. You'll review everything before your order is placed."
            : " Please provide the shipping details for this seller. You'll review everything before your order is placed."}
      </p>

      <div key={vendor.vendor_id} className="space-y-4 mb-6">
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
              <select
                {...register(`${base}.state`, { required: true })}
                value={selectedState ?? ""}
                autoComplete="address-level1"
                className={fieldClass(!!vendorErrors.state)}
              >
                <option value="">Select State</option>
                {usStates.map(item => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name} ({item.isoCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 items-center">
              <input
                {...register(`${base}.postal_code`, { required: true })}
                autoComplete="postal-code"
                placeholder="Zip Code"
                className={fieldClass(!!vendorErrors.postal_code)}
              />

              <input
                type="text"
                value="United States"
                disabled
                readOnly
                autoComplete="country"
                className={
                  fieldClass(false) +
                  " bg-gray-100 text-gray-500 cursor-not-allowed"
                }
              />
              <input
                type="hidden"
                {...register(`${base}.country`)}
                value={US_COUNTRY_CODE}
              />
            </div>
          </div>
        )}

        {isPickup && (
          <div>
            <label className="block text-sm font-semibold text-secondary-black mb-2">
              Local pickup options <span className="text-accent-red">*</span>
            </label>

            <PickupLocationSelect
              name={`${base}.pickup_id`}
              locations={allPickupLocations?.data ?? []}
              hasError={!!vendorErrors.pickup_id}
              onLocationSelect={location =>
                dispatch(
                  setVendorPickupLocation({
                    vendor_id: vendor.vendor_id,
                    location,
                  }),
                )
              }
            />
          </div>
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
          disabled={isLoading || isGeocoding}
          className="px-6 py-3 rounded-lg bg-primary-green text-white font-medium cursor-pointer enabled:hover:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:animate-pulse disabled:opacity-60"
        >
          {isLastVendor ? "Review order" : "Next vendor"}
        </button>
      </div>

      <Modal
        open={deliveryUnavailableOpen}
        onClose={() => setDeliveryUnavailableOpen(false)}
        className="max-w-sm text-center"
      >
        <div className="size-16 rounded-full bg-accent-red/10 grid place-items-center mx-auto mb-4">
          <IoIosInformationCircle className="text-accent-red text-4xl" />
        </div>

        <h3 className="text-xl font-semibold text-secondary-black mb-2">
          We can't deliver to this address
        </h3>
        <p className="text-secondary-gray text-sm mb-6">
          Your address falls outside the range of this shop's local delivery
          service.
        </p>

        <button
          type="button"
          onClick={() => {
            setDeliveryUnavailableOpen(false);
            router.push(buildStepUrl("delivery-options"));
          }}
          className="w-full py-3 rounded-lg bg-primary-green text-white font-medium cursor-pointer hover:scale-95 transition-all duration-300"
        >
          Go back to shipping options
        </button>
      </Modal>
    </div>
  );
};

export default DeliveryDetails;
