"use client";
import { useForm } from "react-hook-form";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import { getLatLng } from "@/lib/getLatLng";
import { useAddDeliveryOriginMutation } from "@/redux/api/vendorApi";
import { DeliveryOrigin } from "../../../../../Types/LocalDelivery";

const US_COUNTRY_CODE = "US";
const usStates = State.getStatesOfCountry(US_COUNTRY_CODE);

export type DeliveryOriginFormValues = {
  address: string;
  unit: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

const DEFAULT_VALUES: DeliveryOriginFormValues = {
  address: "",
  unit: "",
  city: "",
  state: "",
  zip_code: "",
  country: US_COUNTRY_CODE,
};

interface EditOriginModalProps {
  origin: DeliveryOrigin | null;
  onClose: () => void;
}

function toFormValues(
  origin?: DeliveryOrigin | null,
): DeliveryOriginFormValues {
  if (!origin) return DEFAULT_VALUES;

  return {
    address: origin.street ?? "",
    unit: origin.apartment ?? "",
    city: origin.city ?? "",
    state: origin.state ?? "",
    zip_code: origin.zip ?? "",
    country: US_COUNTRY_CODE,
  };
}

export function EditOriginModal({ origin, onClose }: EditOriginModalProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [state, setState] = useState<string>(origin?.state || "");
  const [addDeliveryOrigin, { isLoading: isSaving }] =
    useAddDeliveryOriginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DeliveryOriginFormValues>({
    defaultValues: toFormValues(origin),
  });

  useEffect(() => {
    reset(toFormValues(origin));
    setState(origin?.state || "");
  }, [origin, reset]);

  const onSubmit = async (values: DeliveryOriginFormValues) => {
    setIsGeocoding(true);

    const stateName =
      usStates.find(s => s.isoCode === values.state)?.name ?? values.state;

    const fullAddress = [
      values.address,
      values.unit,
      values.city,
      stateName,
      values.zip_code,
      "United States",
    ]
      .filter(Boolean)
      .join(", ");

    const { lat, lng } = await getLatLng(fullAddress);
    setIsGeocoding(false);

    if (lat === null || lng === null) {
      toast.error(
        "Couldn't verify this address's map location — the origin will still be saved, but you may want to double check the address.",
      );
    }

    const formData = new FormData();
    formData.append("address", values.address);
    formData.append("latitude", lat !== null ? lat.toString() : "0");
    formData.append("longitude", lng !== null ? lng.toString() : "0");
    formData.append("unit", values.unit);
    formData.append("city", values.city);
    formData.append("zip_code", values.zip_code);
    formData.append("state", values.state);
    formData.append("country", US_COUNTRY_CODE);

    try {
      const res = await addDeliveryOrigin(formData).unwrap();
      toast.success(res?.message ?? "Delivery origin saved");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div>
      <h2
        id="delivery-origin-modal-title"
        className="text-2xl font-semibold text-secondary-black mb-1"
      >
        {origin ? "Edit Delivery Origin" : "Add Delivery Origin"}
      </h2>

      <p className="text-sm text-secondary-gray mb-5">
        This is your home base and the starting point for calculating delivery
        and fees.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-black mb-1.5">
            Address <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Street Address"
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none mb-2 ${
              errors.address
                ? "border-red-500 placeholder:text-red-500"
                : "border-gray-300"
            }`}
            {...register("address", { required: true })}
          />

          <input
            type="text"
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none"
            {...register("unit")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-black mb-1.5">
              City <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="e.g. Austin"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none ${
                errors.city
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-gray-300"
              }`}
              {...register("city", { required: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-black mb-1.5">
              State <span className="text-red-500">*</span>
            </label>

            <select
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none bg-white ${
                errors.state
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-gray-300"
              }`}
              {...register("state", { required: true })}
              value={state}
              onChange={e => {
                const selectedState = e.target.value;
                setState(selectedState);
                setValue("state", selectedState, {
                  shouldValidate: true,
                });
              }}
            >
              <option value="">Select State</option>
              {usStates.map(item => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name} ({item.isoCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-black mb-1.5">
              ZIP Code <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="e.g. 78701"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none ${
                errors.zip_code
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-gray-300"
              }`}
              {...register("zip_code", { required: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-black mb-1.5">
              Country
            </label>

            <input
              type="text"
              value="United States"
              disabled
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <input
              type="hidden"
              {...register("country")}
              value={US_COUNTRY_CODE}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving || isGeocoding}
          className="w-full rounded-lg bg-primary-green py-3 text-sm font-semibold text-white transition-transform hover:scale-[0.98] duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGeocoding
            ? "Verifying address..."
            : isSaving
              ? "Saving..."
              : "Save Address"}
        </button>

        <div className="flex items-start gap-3 border border-off-green/30 bg-off-green/30 rounded-lg px-3 py-3.5">
          <span className="shrink-0 bg-off-green/60 size-10 rounded-full grid place-items-center">
            <FiMapPin className="size-4" />
          </span>
          <div>
            <h4 className="text-[15px] font-semibold">Important</h4>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              Accurate delivery origin is essential for correct delivery fee
              calculations based on distance.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
