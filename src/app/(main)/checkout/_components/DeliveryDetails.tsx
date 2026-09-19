"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/store";
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
  setDeliveryUnavailableVendors,
  setVendorPickupLocation,
  setContactInfo,
} from "@/redux/slices/checkoutSlice";
import { CartItem } from "@/Types";
import Modal from "@/Components/Common/Modal";
import { IoIosInformationCircle } from "react-icons/io";
import { CiShop } from "react-icons/ci";
import { FiUser } from "react-icons/fi";

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
  const { latitude, longitude, user } = useAuth();
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [deliveryUnavailableOpen, setDeliveryUnavailableOpen] = useState(false);
  const { deliveryUnavailableVendors, contact: reduxContact } = useAppSelector(
    state => state.checkout,
  );

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

  const contactFields = ["first_name", "last_name", "email"];

  const fieldsForFulfillment = [
    `${base}.first_name`,
    `${base}.last_name`,

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
  const contactErrors = errors as any;

  // Watched values for placeholder overlay hiding
  const watchedFirstName = watch("first_name");
  const watchedLastName = watch("last_name");
  const watchedEmail = watch("email");
  const watchedVendorFirstName = watch(`${base}.first_name`);
  const watchedVendorLastName = watch(`${base}.last_name`);
  const watchedStreetAddress = watch(`${base}.street_address`);
  const watchedCity = watch(`${base}.city`);
  const watchedPostalCode = watch(`${base}.postal_code`);

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

  // Pre-fill contact & vendor recipient from logged in user or Redux state
  useEffect(() => {
    if (reduxContact?.first_name && !getValues("first_name")) {
      setValue("first_name", reduxContact.first_name);
    }
    if (reduxContact?.last_name && !getValues("last_name")) {
      setValue("last_name", reduxContact.last_name);
    }
    if (reduxContact?.email && !getValues("email")) {
      setValue("email", reduxContact.email);
    }
    if (reduxContact?.phone && !getValues("phone")) {
      setValue("phone", reduxContact.phone);
    }

    if (user) {
      if (!getValues("first_name") && user.first_name) {
        setValue("first_name", user.first_name);
      }
      if (!getValues("last_name") && user.last_name) {
        setValue("last_name", user.last_name);
      }
      if (!getValues("email") && user.email) {
        setValue("email", user.email);
      }
      if (!getValues("phone") && user.phone) {
        setValue("phone", user.phone);
      }
      if (!getValues(`${base}.first_name`) && user.first_name) {
        setValue(`${base}.first_name`, user.first_name);
      }
      if (!getValues(`${base}.last_name`) && user.last_name) {
        setValue(`${base}.last_name`, user.last_name);
      }
    }
  }, [user, reduxContact, base, setValue, getValues]);

  // Sync contact first & last name to first vendor recipient if vendor fields are empty
  useEffect(() => {
    if (isFirstVendor && watchedFirstName && !getValues(`${base}.first_name`)) {
      setValue(`${base}.first_name`, watchedFirstName);
    }
  }, [watchedFirstName, isFirstVendor, base, setValue, getValues]);

  useEffect(() => {
    if (isFirstVendor && watchedLastName && !getValues(`${base}.last_name`)) {
      setValue(`${base}.last_name`, watchedLastName);
    }
  }, [watchedLastName, isFirstVendor, base, setValue, getValues]);

  useEffect(() => {
    syncFromDom([...contactFields, ...fieldsForFulfillment]);
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
    syncFromDom([...contactFields, ...fieldsForFulfillment]);
    const contactValid = await trigger(contactFields);
    const vendorValid = await trigger(fieldsForFulfillment);
    if (!contactValid || !vendorValid) return;

    dispatch(
      setContactInfo({
        first_name: getValues("first_name") || "",
        last_name: getValues("last_name") || "",
        email: getValues("email") || "",
        phone: getValues("phone") || "",
      }),
    );

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
          dispatch(
            setDeliveryUnavailableVendors(
              err?.data?.data?.unavailable_vendors ?? [],
            ),
          );
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
    <div>
      {/* Contact Information Card */}
      <div className="border border-gray-300 rounded-xl p-6 bg-white mb-5">
        <div className="flex items-center gap-2 mb-2">
          <FiUser className="text-xl text-primary-green stroke-[2.2]" />
          <h3 className="text-lg font-semibold text-secondary-black">
            Add your contact information
          </h3>
        </div>

        <p className="text-gray-500 text-[14.5px] leading-relaxed mb-5">
          Enter the email that you want the order confirmation, receipt, and any tracking or updates to be sent to. You can have your items sent to different addresses for each shop — wherever you'd like.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                {...register("first_name", { required: true })}
                autoComplete="given-name"
                placeholder=" "
                className={`peer ${fieldClass(!!contactErrors?.first_name)}`}
              />
              <span
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden select-none ${
                  watchedFirstName ? "hidden" : ""
                }`}
              >
                First Name <span className="text-red-500">*</span>
              </span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                {...register("last_name", { required: true })}
                autoComplete="family-name"
                placeholder=" "
                className={`peer ${fieldClass(!!contactErrors?.last_name)}`}
              />
              <span
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden select-none ${
                  watchedLastName ? "hidden" : ""
                }`}
              >
                Last Name <span className="text-red-500">*</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
                autoComplete="email"
                placeholder=" "
                className={`peer ${fieldClass(!!contactErrors?.email)}`}
              />
              <span
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden select-none ${
                  watchedEmail ? "hidden" : ""
                }`}
              >
                Email Address <span className="text-red-500">*</span>
              </span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                {...register("phone")}
                autoComplete="tel"
                placeholder="Phone Number (optional)"
                className={fieldClass(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Fulfillment Card */}
      <div className="border border-gray-300 rounded-xl p-6 bg-white">
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
              : "Please provide the shipping details for this shop. You'll review everything before your order is placed."}
        </p>

        <div key={vendor.vendor_id} className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                {...register(`${base}.first_name`, { required: true })}
                autoComplete="given-name"
                placeholder=" "
                className={`peer ${fieldClass(!!vendorErrors.first_name)}`}
              />
              <span
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden select-none ${
                  watchedVendorFirstName ? "hidden" : ""
                }`}
              >
                First Name <span className="text-red-500">*</span>
              </span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                {...register(`${base}.last_name`, { required: true })}
                autoComplete="family-name"
                placeholder=" "
                className={`peer ${fieldClass(!!vendorErrors.last_name)}`}
              />
              <span
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden select-none ${
                  watchedVendorLastName ? "hidden" : ""
                }`}
              >
                Last Name <span className="text-red-500">*</span>
              </span>
            </div>
          </div>

          {needsAddress && (
            <div className="space-y-3">
              <div className="relative w-full">
                <input
                  {...register(`${base}.street_address`, { required: true })}
                  autoComplete="street-address"
                  placeholder=" "
                  className={`peer ${fieldClass(!!vendorErrors.street_address)}`}
                />
                <span
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden select-none ${
                    watchedStreetAddress ? "hidden" : ""
                  }`}
                >
                  Street Address <span className="text-red-500">*</span>
                </span>
              </div>

              <input
                {...register(`${base}.apt`)}
                autoComplete="address-line2"
                placeholder="Apartment, suite, etc. (optional)"
                className={fieldClass(false)}
              />

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <input
                    {...register(`${base}.city`, { required: true })}
                    autoComplete="address-level2"
                    placeholder=" "
                    className={`peer ${fieldClass(!!vendorErrors.city)}`}
                  />
                  <span
                    className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden select-none ${
                      watchedCity ? "hidden" : ""
                    }`}
                  >
                    City <span className="text-red-500">*</span>
                  </span>
                </div>

                <div className="relative flex-1 w-full">
                  <select
                    {...register(`${base}.state`, { required: true })}
                    value={selectedState ?? ""}
                    autoComplete="address-level1"
                    className={fieldClass(!!vendorErrors.state)}
                  >
                    <option value="">Select State *</option>
                    {usStates.map(item => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name} ({item.isoCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <input
                    {...register(`${base}.postal_code`, { required: true })}
                    autoComplete="postal-code"
                    placeholder=" "
                    className={`peer ${fieldClass(!!vendorErrors.postal_code)}`}
                  />
                  <span
                    className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden select-none ${
                      watchedPostalCode ? "hidden" : ""
                    }`}
                  >
                    Zip Code <span className="text-red-500">*</span>
                  </span>
                </div>

                <div className="relative flex-1 w-full">
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
                </div>
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

          <h3 className="text-lg font-semibold text-secondary-black mb-1.5">
            We can't deliver to this address
          </h3>
          <p className="text-secondary-gray text-sm mb-4">
            {deliveryUnavailableVendors.length > 1
              ? "These sellers don't offer local delivery to your address:"
              : "This seller doesn't offer local delivery to your address:"}
          </p>

          <div className="py-2 px-4 mb-4 text-left">
            {deliveryUnavailableVendors.map(v => (
              <div key={v.vendor_id} className="flex items-center gap-2 py-1.5">
                <CiShop className="text-primary-green"/>
                <span className="text-sm text-secondary-black">
                  {v.shop_name}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setDeliveryUnavailableOpen(false);
              router.push(buildStepUrl("delivery-options"));
            }}
            className="w-full py-3 rounded-lg bg-primary-green text-white font-medium cursor-pointer hover:scale-95 transition-all duration-300"
          >
            Choose a different delivery method
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default DeliveryDetails;
