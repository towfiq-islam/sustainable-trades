"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";
import { DeliveryRange } from "@/Types/LocalDelivery";
import {
  useAddDeliveryRangeMutation,
  useEditDeliveryRangeMutation,
} from "@/redux/api/vendorApi";

interface AddRangeModalProps {
  initialRange: DeliveryRange | null;
  onClose: () => void;
}

export type DeliveryRangeFormValues = {
  minMiles: string;
  maxMiles: string;
  fee: string;
};

const DEFAULT_VALUES: DeliveryRangeFormValues = {
  minMiles: "",
  maxMiles: "",
  fee: "",
};

function toFormValues(range?: DeliveryRange | null): DeliveryRangeFormValues {
  if (!range) return DEFAULT_VALUES;

  return {
    minMiles: String(range.minMiles),
    maxMiles: String(range.maxMiles),
    fee: String(range.fee),
  };
}

export function AddRangeModal({ initialRange, onClose }: AddRangeModalProps) {
  const [addDeliveryRange, { isLoading: isAdding }] =
    useAddDeliveryRangeMutation();
  const [editDeliveryRange, { isLoading: isEditing }] =
    useEditDeliveryRangeMutation();

  const isSaving = isAdding || isEditing;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DeliveryRangeFormValues>({
    defaultValues: toFormValues(initialRange),
  });

  useEffect(() => {
    reset(toFormValues(initialRange));
  }, [initialRange, reset]);

  const onSubmit = async (values: DeliveryRangeFormValues) => {
    const min = Number(values.minMiles);
    const max = Number(values.maxMiles);
    const feeValue = Number(values.fee || 0);

    const payload = {
      min_distance: min,
      max_distance: max,
      delivery_fee: feeValue.toFixed(2),
    };

    try {
      const res = initialRange
        ? await editDeliveryRange({
            id: initialRange.id,
            data: payload,
          }).unwrap()
        : await addDeliveryRange(payload).unwrap();

      toast.success(
        res?.message ??
          (initialRange ? "Delivery range updated" : "Delivery range added"),
      );
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-wide text-secondary-black mb-3 flex items-start justify-between border-b border-neutral-200 pb-2">
        {initialRange ? "Edit Delivery Range" : "Add Delivery Range"}
      </h2>

      <p className="text-[15px] leading-relaxed text-neutral-600">
        Set a delivery fee for a specific distance range from your delivery
        origin. You can create as many ranges as you need.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-5 space-y-4"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-900">
            Distance Range <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Min Distance (miles)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 0"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none ${
                  errors.minMiles
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-gray-300"
                }`}
                {...register("minMiles", { required: true })}
              />
            </div>

            <span className="mt-5 text-neutral-400">–</span>

            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Max Distance (miles)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 10"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none ${
                  errors.maxMiles
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-gray-300"
                }`}
                {...register("maxMiles", { required: true })}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-black mb-1.5">
            Delivery Fee <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              $
            </span>
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              className={`w-full border rounded-lg pl-7 pr-3.5 py-2.5 text-sm outline-none ${
                errors.fee
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-gray-300"
              }`}
              {...register("fee", { required: true })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-lg bg-primary-green py-3 text-sm font-semibold text-white transition-transform hover:scale-[0.98] duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Range"}
        </button>

        <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-4">
          <span className="mt-0.5 text-primary-green">
            <HiOutlineLightBulb className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">
              How it works
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              Set a delivery fee for each distance range from your delivery
              origin. The correct fee will be applied at checkout based on the
              distance to the shopper&apos;s address.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-4">
          <span className="mt-0.5 text-primary-green">
            <FiInfo className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">
              Please Note
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              If the delivery address is outside your maximum distance, the
              customer will be redirected to choose a different fulfillment
              option.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
