"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "@/redux/store";
import { fulfillmentLabel } from "@/lib/fulfillment";
import VendorProgressBar from "./VendorProgressBar";

const VendorDetailsStep = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);
  const { register } = useFormContext();
  const [vendorIndex, setVendorIndex] = useState(0);

  const vendor = items[vendorIndex];
  if (!vendor) return null;

  const fulfillment = vendor.selectedFulfillment;
  const isLastVendor = vendorIndex === items.length - 1;
  const isFirstVendor = vendorIndex === 0;
  const base = `vendors.${vendor.vendor_id}`;

  const handleBack = () => {
    if (isFirstVendor) router.push("/cart");
    else setVendorIndex(i => i - 1);
  };

  const handleNext = () => {
    if (isLastVendor) router.push("/checkout?step=review");
    else setVendorIndex(i => i + 1);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white">
      <VendorProgressBar current={vendorIndex + 1} total={items.length} />

      <h3 className="text-xl font-semibold text-secondary-black mb-5">
        {fulfillment ? fulfillmentLabel[fulfillment] : "Fulfillment"} —{" "}
        {vendor.shop_name}
      </h3>

      <div className="space-y-4 mb-6">
        <input
          {...register(`${base}.name`)}
          placeholder="Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
        />
        <input
          {...register(`${base}.phone`)}
          placeholder="Phone"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
        />

        {(fulfillment === "delivery" || fulfillment === "shipping") && (
          <input
            {...register(`${base}.address`)}
            placeholder={
              fulfillment === "shipping"
                ? "Shipping address"
                : "Delivery address"
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green"
          />
        )}

        {fulfillment === "delivery" && (
          <textarea
            {...register(`${base}.instructions`)}
            placeholder="Delivery instructions"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green resize-none"
          />
        )}

        {fulfillment === "pickup" && (
          <textarea
            {...register(`${base}.instructions`)}
            placeholder="Pickup notes (optional)"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary-green resize-none"
          />
        )}
      </div>

      <div className="flex gap-3 justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-3 rounded-lg border border-gray-300 font-semibold text-secondary-black cursor-pointer hover:bg-gray-50"
        >
          {isFirstVendor ? "Back to cart" : "Back"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 rounded-lg bg-primary-green text-white font-semibold cursor-pointer hover:scale-95 transition-all duration-300"
        >
          {isLastVendor ? "Review order" : "Next vendor"}
        </button>
      </div>
    </div>
  );
};

export default VendorDetailsStep;
