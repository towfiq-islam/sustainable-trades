"use client";
import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { IoLocationOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";

type PickupLocation = {
  id: number;
  location_name: string;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip_code: string;
  distance: number;
  distance_unit: string;
};

type Props = {
  name: string; // RHF field path, e.g. `vendors.16.pickup_id`
  locations: PickupLocation[];
  hasError?: boolean;
};

const PickupLocationSelect = ({ name, locations, hasError }: Props) => {
  const { register, watch, setValue, trigger } = useFormContext();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedId = watch(name);
  const selected = locations.find(loc => String(loc.id) === String(selectedId));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: number) => {
    setValue(name, String(id));
    trigger(name);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Hidden input keeps this registered with RHF for validation */}
      <input type="hidden" {...register(name, { required: true })} />

      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-left cursor-pointer ${
          hasError
            ? "border-red-500"
            : open
              ? "border-blue-500"
              : "border-gray-300"
        }`}
      >
        <span className={selected ? "text-secondary-black" : "text-gray-400"}>
          {selected ? selected.location_name : "Select a local pickup location"}
        </span>
        <FiChevronDown
          className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-72 overflow-y-auto">
          {locations.length === 0 && (
            <p className="px-4 py-3 text-sm text-secondary-gray">
              No pickup locations available.
            </p>
          )}

          {locations.map(loc => {
            const isSelected = String(loc.id) === String(selectedId);
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelect(loc.id)}
                className={`w-full flex items-center justify-between gap-3 text-left px-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer ${
                  isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <p className="font-semibold text-[15px] text-secondary-black">
                    {loc.location_name}
                  </p>
                  <p className="text-sm text-secondary-gray">
                    {loc.address}
                    {loc.unit ? `, ${loc.unit}` : ""}, {loc.city}, {loc.state}{" "}
                    {loc.zip_code}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm text-secondary-gray shrink-0">
                  <IoLocationOutline className="text-primary-green shrink-0" />
                  {loc.distance.toFixed(1)}{" "}
                  {loc.distance_unit === "miles" ? "mi" : loc.distance_unit}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PickupLocationSelect;
