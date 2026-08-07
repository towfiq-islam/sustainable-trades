"use client";
import { useForm } from "react-hook-form";
import { Country, State } from "country-state-city";
import { useState } from "react";

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

const allowedCountries = Country.getAllCountries().filter(
  country => country.isoCode === "US" || country.isoCode === "CA",
);

type Props = {
  onClose: () => void;
  onSave: (values: PickupLocationFormValues) => void;
  defaultValues?: PickupLocationFormValues;
};

const AddPickupLocationModal = ({ onClose, onSave, defaultValues }: Props) => {
  const [country, setCountry] = useState<any>(null);
  const [state, setState] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PickupLocationFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = (values: PickupLocationFormValues) => {
    onSave(values);
  };

  return (
    <div>
      <h2
        id="pickup-modal-title"
        className="text-2xl font-bold text-secondary-black mb-1"
      >
        {defaultValues ? "Edit Pickup Location" : "Add Pickup Location"}
      </h2>

      <p className="text-sm text-secondary-gray mb-5">
        Add the details for this pickup location.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-black mb-1.5">
            Location Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="e.g. Main Workshop"
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none ${
              errors.location_name
                ? "border-red-500 placeholder:text-red-500"
                : "border-gray-300"
            }`}
            {...register("location_name", { required: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-black mb-1.5">
            Address <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Street address"
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none mb-2 ${
              errors.address
                ? "border-red-500 placeholder:text-red-500"
                : "border-gray-300"
            }`}
            {...register("address", { required: true })}
          />

          <input
            type="text"
            placeholder="Apt / Suite / Unit (Optional)"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none"
            {...register("apt_suite")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-black mb-1.5">
              Country <span className="text-red-500">*</span>
            </label>

            <select
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none bg-white ${
                errors.country
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-gray-300"
              }`}
              value={country || ""}
              {...register("country", { required: true })}
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
              <option value="">Select State / Province</option>
              {State.getStatesOfCountry(country).map(item => (
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
              Zip Code <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="e.g. 78701"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none ${
                errors.zip
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-gray-300"
              }`}
              {...register("zip", { required: true })}
            />
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
  );
};

export default AddPickupLocationModal;
