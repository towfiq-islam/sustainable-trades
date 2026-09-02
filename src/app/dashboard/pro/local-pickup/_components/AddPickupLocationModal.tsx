"use client";
import { useForm } from "react-hook-form";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import {
  useAddPickupLocationMutation,
  useEditPickupLocationMutation,
} from "@/redux/api/vendorApi";
import toast from "react-hot-toast";
import { getLatLng } from "@/lib/getLatLng";
import { PickupLocationFormValues } from "@/Types";
const US_COUNTRY_CODE = "US";
const usStates = State.getStatesOfCountry(US_COUNTRY_CODE);

const DEFAULT_VALUES: PickupLocationFormValues = {
  location_name: "",
  address: "",
  unit: "",
  city: "",
  state: "",
  zip_code: "",
  country: US_COUNTRY_CODE,
  is_active: true,
};

type Props = {
  editingLocation: any;
  onClose: () => void;
  defaultValues?: PickupLocationFormValues;
};

const AddPickupLocationModal = ({
  onClose,
  defaultValues,
  editingLocation,
}: Props) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [state, setState] = useState<any>(defaultValues?.state || "");

  const [addPickupLocation, { isLoading: isAdding }] =
    useAddPickupLocationMutation();
  const [editPickupLocation, { isLoading: isEditing }] =
    useEditPickupLocationMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PickupLocationFormValues>({
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  });

  const onSubmit = async (values: PickupLocationFormValues) => {
    setIsGeocoding(true);

    const stateName =
      usStates.find(s => s.isoCode === values.state)?.name ?? values.state;

    const fullAddress = [
      values?.address,
      values?.unit,
      values?.city,
      stateName,
      values?.zip_code,
      "United States",
    ]
      .filter(Boolean)
      .join(", ");

    const { lat, lng } = await getLatLng(fullAddress);
    setIsGeocoding(false);

    if (lat === null || lng === null) {
      toast.error(
        "Couldn't verify this address's map location — the location will still be saved, but you may want to double check the address.",
      );
    }

    const formData = new FormData();
    formData.append("location_name", values?.location_name);
    formData.append("address", values?.address);
    formData.append("latitude", lat !== null ? lat.toString() : "0");
    formData.append("longitude", lng !== null ? lng.toString() : "0");
    formData.append("unit", values.unit);
    formData.append("city", values.city);
    formData.append("zip_code", values.zip_code);
    formData.append("state", values.state);
    formData.append("country", US_COUNTRY_CODE);
    formData.append("is_active", values?.is_active ? "1" : "0");

    try {
      if (editingLocation) {
        const res = await editPickupLocation({
          id: editingLocation?.id,
          data: formData,
        }).unwrap();
        toast.success(res?.message);
      } else {
        const res = await addPickupLocation(formData).unwrap();
        toast.success(res?.message);
      }

      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  useEffect(() => {
    reset({
      ...(defaultValues ?? DEFAULT_VALUES),
      country: US_COUNTRY_CODE,
      is_active: Boolean(
        typeof defaultValues?.is_active === "string"
          ? defaultValues.is_active === "1" ||
              defaultValues.is_active === "true"
          : (defaultValues?.is_active ?? true),
      ),
    });
    setState(defaultValues?.state || "");
  }, [defaultValues, reset]);

  return (
    <div>
      <h2
        id="pickup-modal-title"
        className="text-2xl font-semibold text-secondary-black mb-1"
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
              Zip Code <span className="text-red-500">*</span>
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

        <label className="flex items-center gap-2 text-sm text-secondary-black">
          <input
            type="checkbox"
            className="size-4 accent-primary-green"
            {...register("is_active")}
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
            disabled={isEditing || isAdding || isGeocoding}
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
