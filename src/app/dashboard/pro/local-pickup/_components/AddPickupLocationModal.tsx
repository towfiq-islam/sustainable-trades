// app/dashboard/local-pickup/_components/AddPickupLocationModal.tsx
"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiHelpCircle } from "react-icons/fi";

export type PickupLocationFormValues = {
  location_name: string;
  address: string;
  apt_suite: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const DEFAULT_VALUES: PickupLocationFormValues = {
  location_name: "",
  address: "",
  apt_suite: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const US_STATES = ["TX", "CA", "NY", "FL", "WA"]; // wire up to your real list
const COUNTRIES = ["United States", "Canada", "United Kingdom"];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: PickupLocationFormValues) => void;
  defaultValues?: PickupLocationFormValues;
};

const AddPickupLocationModal = ({
  isOpen,
  onClose,
  onSave,
  defaultValues,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PickupLocationFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  // Re-hydrate the form whenever the modal opens, for either a fresh
  // "Add" (defaultValues undefined -> blank form) or an "Edit"
  // (defaultValues populated -> pre-filled form).
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues ?? DEFAULT_VALUES);
    }
  }, [isOpen, defaultValues, reset]);

  if (!isOpen) return null;

  const onSubmit = (values: PickupLocationFormValues) => {
    onSave(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pickup-modal-title"
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-1">
          <h2
            id="pickup-modal-title"
            className="text-2xl font-bold text-secondary-black"
          >
            {defaultValues ? "Edit Pickup Location" : "Add Pickup Location"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-secondary-gray hover:text-secondary-black cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <p className="text-sm text-secondary-gray mb-5">
          Add the details for this pickup location.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-secondary-black mb-1.5">
              Location Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Main Workshop"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary-green ${
                errors.location_name ? "border-red-400" : "border-gray-300"
              }`}
              {...register("location_name", {
                required: "Location name is required",
                maxLength: {
                  value: 80,
                  message: "Keep it under 80 characters",
                },
              })}
            />
            {errors.location_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.location_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-black mb-1.5">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Street address"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary-green mb-2 ${
                errors.address ? "border-red-400" : "border-gray-300"
              }`}
              {...register("address", {
                required: "Street address is required",
              })}
            />
            {errors.address && (
              <p className="text-xs text-red-500 mb-2">
                {errors.address.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Apt / Suite / Unit (Optional)"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary-green"
              {...register("apt_suite")}
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
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary-green ${
                  errors.city ? "border-red-400" : "border-gray-300"
                }`}
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-black mb-1.5">
                State / Province <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue=""
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary-green bg-white ${
                  errors.state ? "border-red-400" : "border-gray-300"
                }`}
                {...register("state", {
                  required: "State / province is required",
                })}
              >
                <option value="" disabled>
                  Select state / province
                </option>
                {US_STATES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-black mb-1.5">
                Zip / Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 78701"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary-green ${
                  errors.zip ? "border-red-400" : "border-gray-300"
                }`}
                {...register("zip", {
                  required: "Zip / postal code is required",
                  pattern: {
                    value: /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/,
                    message: "Enter a valid zip / postal code",
                  },
                })}
              />
              {errors.zip && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.zip.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-black mb-1.5">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue=""
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary-green bg-white ${
                  errors.country ? "border-red-400" : "border-gray-300"
                }`}
                {...register("country", { required: "Country is required" })}
              >
                <option value="" disabled>
                  Select country
                </option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-secondary-black">
            <input
              type="checkbox"
              defaultChecked
              className="size-4 accent-primary-green"
              {...register("is_active" as never)}
            />
            This location is active and available for pickup
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-3 font-semibold text-secondary-black hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary-green text-white rounded-lg py-3 font-semibold hover:bg-primary-green/90 disabled:opacity-60 cursor-pointer"
            >
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPickupLocationModal;
