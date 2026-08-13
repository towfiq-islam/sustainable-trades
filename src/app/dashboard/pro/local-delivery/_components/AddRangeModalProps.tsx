"use client";
import { useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { FiInfo } from "react-icons/fi";
import { DeliveryRange } from "./LocalDelivery";
import {
  useAddDeliveryRangeMutation,
  useEditDeliveryRangeMutation,
} from "@/redux/api/vendorApi";

interface AddRangeModalProps {
  initialRange: DeliveryRange | null;
  onClose: () => void;
  onSave: (range: Omit<DeliveryRange, "id">) => void;
}

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-neutral-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function inputClass(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm text-neutral-900",
    "placeholder:text-neutral-400 focus:outline-none focus:ring-2",
    hasError
      ? "border-red-400 focus:ring-red-200"
      : "border-neutral-300 focus:border-emerald-700 focus:ring-emerald-100",
  ].join(" ");
}

export function AddRangeModal({
  initialRange,
  onClose,
  onSave,
}: AddRangeModalProps) {
  const [addDeliveryRange, { isLoading: isAdding }] =
    useAddDeliveryRangeMutation();
  const [editDeliveryRange, { isLoading: isEditing }] =
    useEditDeliveryRangeMutation();
  const [minMiles, setMinMiles] = useState(
    initialRange ? String(initialRange.minMiles) : "",
  );
  const [maxMiles, setMaxMiles] = useState(
    initialRange ? String(initialRange.maxMiles) : "",
  );
  const [fee, setFee] = useState(initialRange ? String(initialRange.fee) : "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    const min = Number(minMiles);
    const max = Number(maxMiles);
    const feeValue = Number(fee || 0);

    if (
      minMiles === "" ||
      maxMiles === "" ||
      Number.isNaN(min) ||
      Number.isNaN(max)
    ) {
      setError("Please enter both a minimum and maximum distance.");
      return;
    }
    if (max <= min) {
      setError("Max distance must be greater than min distance.");
      return;
    }
    if (Number.isNaN(feeValue) || feeValue < 0) {
      setError("Please enter a valid delivery fee.");
      return;
    }

    setError(null);
    onSave({ minMiles: min, maxMiles: max, fee: feeValue });
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-wide text-neutral-900 mb-5 flex items-start justify-between border-b border-neutral-200 pb-4">
        ADD DELIVERY RANGE
      </h2>

      <p className="text-[15px] leading-relaxed text-neutral-600">
        Set a delivery fee for a specific distance range from your delivery
        origin. You can create as many ranges as you need.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <span className="mb-2 block text-sm font-semibold text-neutral-900">
            Distance Range <span className="text-red-500">*</span>
          </span>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Min Distance (miles)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g., 0"
                value={minMiles}
                onChange={e => setMinMiles(e.target.value)}
                className={inputClass(!!error)}
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
                placeholder="e.g., 10"
                value={maxMiles}
                onChange={e => setMaxMiles(e.target.value)}
                className={inputClass(!!error)}
              />
            </div>
          </div>
        </div>

        <Field label="Delivery Fee" required>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              $
            </span>
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={fee}
              onChange={e => setFee(e.target.value)}
              className={`${inputClass(false)} pl-7`}
            />
          </div>
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Save Range
        </button>

        <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-4">
          <span className="mt-0.5 text-emerald-800">
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
          <span className="mt-0.5 text-emerald-800">
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
      </div>
    </div>
  );
}
