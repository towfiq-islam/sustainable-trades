"use client";
import { useState } from "react";
import { State } from "country-state-city";
import { FiMapPin } from "react-icons/fi";
import { DeliveryOrigin, US_STATES } from "./LocalDelivery";
import { Field, inputClass } from "./AddRangeModalProps";
import toast from "react-hot-toast";
import { getLatLng } from "@/lib/getLatLng";
const US_COUNTRY_CODE = "US";
const usStates = State.getStatesOfCountry(US_COUNTRY_CODE);

interface EditOriginModalProps {
  origin: DeliveryOrigin;
  onClose: () => void;
  onSave: (origin: DeliveryOrigin) => void;
  defaultValues?: any;
}

export function EditOriginModal({
  origin,
  onClose,
  onSave,
  defaultValues,
}: EditOriginModalProps) {
  const [form, setForm] = useState<DeliveryOrigin>(origin);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DeliveryOrigin, string>>
  >({});

  function update<K extends keyof DeliveryOrigin>(
    key: K,
    value: DeliveryOrigin[K],
  ) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    const nextErrors: Partial<Record<keyof DeliveryOrigin, string>> = {};
    if (!form.street.trim()) nextErrors.street = "Street address is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.state.trim()) nextErrors.state = "State is required";
    if (!form.zip.trim()) nextErrors.zip = "ZIP code is required";
    if (!form.country.trim()) nextErrors.country = "Country is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave(form);
  }

  return (
    <div>
      <h2
        id="pickup-modal-title"
        className="text-2xl font-semibold text-secondary-black mb-1"
      >
        {defaultValues ? "Edit Delivery Origin" : "Add Delivery Origin"}
      </h2>

      <p className="text-sm text-secondary-gray mb-5">
        This is your home base and the starting point for calculating delivery
        and fees.
      </p>

      <div className="mt-5 space-y-4">
        <Field label="Address" required error={errors.street}>
          <input
            type="text"
            placeholder="Street Address"
            value={form.street}
            onChange={e => update("street", e.target.value)}
            className={inputClass(!!errors.street)}
          />
        </Field>

        <input
          type="text"
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={form.apartment ?? ""}
          onChange={e => update("apartment", e.target.value)}
          className={inputClass(false)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field label="City" required error={errors.city}>
            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={e => update("city", e.target.value)}
              className={inputClass(!!errors.city)}
            />
          </Field>

          <Field label="State" required error={errors.state}>
            <select
              value={form.state}
              onChange={e => update("state", e.target.value)}
              className={inputClass(!!errors.state)}
            >
              <option value="">Select State</option>
              {US_STATES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="ZIP Code" required error={errors.zip}>
            <input
              type="text"
              placeholder="ZIP Code"
              value={form.zip}
              onChange={e => update("zip", e.target.value)}
              className={inputClass(!!errors.zip)}
            />
          </Field>

          <Field label="Country" required error={errors.country}>
            <select
              value={form.country}
              onChange={e => update("country", e.target.value)}
              className={inputClass(!!errors.country)}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
            </select>
          </Field>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Save Address
        </button>

        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
          <span className="mt-0.5 text-emerald-800">
            <FiMapPin className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">
              Important
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              Accurate delivery origin is essential for correct delivery fee
              calculations based on distance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
