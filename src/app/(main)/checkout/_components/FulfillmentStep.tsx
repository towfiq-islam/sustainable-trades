"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { removeFromCart, setVendorFulfillment } from "@/redux/slices/cartSlice";
import {
  Fulfillment,
  fulfillmentDescription,
  fulfillmentLabel,
  getVendorFulfillmentStatus,
  normalizeFulfillment,
} from "@/lib/fulfillment";
import Image from "next/image";

const FulfillmentStep = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.cart);
  const [selections, setSelections] = useState<Record<number, Fulfillment>>({});

  // Keep selections in sync whenever the cart changes (e.g. a product is
  // removed from a blocked vendor, flipping it to "auto" or "choose").
  // Preserves any choice the user already made; only fills in the gaps.
  useEffect(() => {
    setSelections(prev => {
      const next: Record<number, Fulfillment> = {};

      items.forEach(vendor => {
        const { status, options } = getVendorFulfillmentStatus(vendor.products);

        if (status === "auto") {
          next[vendor.vendor_id] = options[0];
        } else if (status === "choose") {
          const existing = prev[vendor.vendor_id];
          next[vendor.vendor_id] =
            existing && options.includes(existing)
              ? existing
              : vendor.selectedFulfillment &&
                  options.includes(vendor.selectedFulfillment)
                ? vendor.selectedFulfillment
                : (undefined as unknown as Fulfillment); // stays unresolved until user picks
        }
        // status === "blocked" -> intentionally omitted from `next`,
        // so a removed vendor or unresolved blocked vendor never counts as resolved
      });

      return next;
    });
  }, [items]);

  const handleSelect = (vendor_id: number, fulfillment: Fulfillment) => {
    setSelections(prev => ({ ...prev, [vendor_id]: fulfillment }));
  };

  const handleRemoveProduct = (vendor_id: number, product_id: number) => {
    dispatch(removeFromCart({ vendor_id, product_id }));
  };

  const blockedVendors = items.filter(
    vendor => getVendorFulfillmentStatus(vendor.products).status === "blocked",
  );

  const allResolved = items.every(
    vendor => selections[vendor.vendor_id] !== undefined,
  );

  const handleContinue = () => {
    items.forEach(vendor => {
      const fulfillment = selections[vendor.vendor_id];
      if (fulfillment) {
        dispatch(
          setVendorFulfillment({ vendor_id: vendor.vendor_id, fulfillment }),
        );
      }
    });
    router.push("/checkout?step=details");
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-secondary-black mb-1">
        Choose fulfillment
      </h3>
      <p className="text-secondary-gray mb-6">
        Select a method for each seller
      </p>

      <div className="space-y-4 mb-6">
        {items.map(vendor => {
          const { status, options } = getVendorFulfillmentStatus(
            vendor.products,
          );
          const selected = selections[vendor.vendor_id];

          return (
            <div
              key={vendor.vendor_id}
              className={`border rounded-xl p-4 ${
                status === "blocked"
                  ? "border-accent-red/40 bg-accent-red/5"
                  : "border-gray-200"
              }`}
            >
              {/* Vendor header */}
              <div className="flex items-center gap-3 mb-4">
                <figure className="size-10 rounded-full border border-gray-200 relative shrink-0 bg-gray-100 overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${vendor.shop_image}`}
                    alt={vendor?.shop_name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </figure>
                <div>
                  <p className="font-semibold text-secondary-black">
                    {vendor.shop_name}
                  </p>
                  <p className="text-sm text-secondary-gray">
                    {vendor.products.length} product
                    {vendor.products.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Blocked: No common method */}
              {status === "blocked" && (
                <div className="space-y-3">
                  <p className="text-sm text-accent-red font-medium">
                    These products don't share a common fulfillment method.
                    Remove one to continue, or place separate orders.
                  </p>

                  <div className="space-y-2">
                    {vendor.products.map(product => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between text-sm border border-gray-200 rounded-lg px-3 py-2"
                      >
                        <span className="text-secondary-black">
                          {product.name}
                          <span className="text-secondary-gray ml-2">
                            (
                            {normalizeFulfillment(product.fulfillment)
                              .map(f => fulfillmentLabel[f])
                              .join(", ")}
                            )
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveProduct(vendor.vendor_id, product.id)
                          }
                          className="text-primary-green font-semibold cursor-pointer hover:underline shrink-0 ml-3"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto: exactly one common method, no choice needed */}
              {status === "auto" && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-off-green/70 bg-off-green/40">
                  <span className="size-5 rounded-full border-2 border-primary-green grid place-items-center shrink-0">
                    <span className="size-2.5 rounded-full bg-primary-green" />
                  </span>
                  <span>
                    <span className="block font-semibold text-primary-green">
                      {fulfillmentLabel[options[0]]}
                    </span>
                    <span className="block text-sm text-secondary-gray">
                      {fulfillmentDescription[options[0]]} · only option
                      available for all items from this seller
                    </span>
                  </span>
                </div>
              )}

              {/* Choose: multiple common methods */}
              {status === "choose" && (
                <div className="space-y-3">
                  {options.map(option => {
                    const isSelected = selected === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelect(vendor.vendor_id, option)}
                        className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-off-green/40 border-off-green/70"
                            : "border-gray-200 hover:border-off-green hover:bg-off-green/20"
                        }`}
                      >
                        <span
                          className={`size-5 rounded-full border-2 grid place-items-center shrink-0 ${
                            isSelected
                              ? "border-primary-green"
                              : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <span className="size-2.5 rounded-full bg-primary-green" />
                          )}
                        </span>
                        <span>
                          <span
                            className={`block font-semibold ${
                              isSelected
                                ? "text-primary-green"
                                : "text-secondary-black"
                            }`}
                          >
                            {fulfillmentLabel[option]}
                          </span>
                          <span className="block text-sm text-secondary-gray">
                            {fulfillmentDescription[option]}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-between">
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="px-6 py-3 rounded-lg border border-gray-300 font-semibold text-secondary-black cursor-pointer hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          disabled={!allResolved || blockedVendors.length > 0}
          onClick={handleContinue}
          className="px-6 py-3 rounded-lg bg-primary-green text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:scale-95 transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default FulfillmentStep;
