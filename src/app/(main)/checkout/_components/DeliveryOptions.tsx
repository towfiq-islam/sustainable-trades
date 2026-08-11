"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import {
  CartItem,
  removeFromCart,
  setVendorFulfillment,
} from "@/redux/slices/cartSlice";
import {
  Fulfillment,
  fulfillmentDescription,
  fulfillmentLabel,
  getVendorFulfillmentStatus,
  normalizeFulfillment,
} from "@/lib/fulfillment";
import Image from "next/image";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { setBuyNowFulfillment } from "@/redux/slices/checkoutSlice";

const DeliveryOptions = ({ items }: { items: CartItem[] }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selections, setSelections] = useState<Record<number, Fulfillment>>({});
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isBuyNow = mode === "buy-now";

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
                : (undefined as unknown as Fulfillment);
        }
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

  const buildStepUrl = (step: string) => {
    const params = new URLSearchParams();
    params.set("step", step);
    if (mode) params.set("mode", mode);
    return `/checkout?${params.toString()}`;
  };

  const handleContinue = () => {
    items.forEach(vendor => {
      const fulfillment = selections[vendor.vendor_id];
      if (!fulfillment) return;

      if (isBuyNow) {
        dispatch(setBuyNowFulfillment({ fulfillment }));
      } else {
        dispatch(
          setVendorFulfillment({ vendor_id: vendor.vendor_id, fulfillment }),
        );
      }
    });
    router.push(buildStepUrl("delivery-details"));
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white">
      <div className="flex gap-20 items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-black mb-1">
            Choose Local Delivery, Local Pickup, or Shipping
          </h3>
          <p className="text-secondary-gray text-[15px] mb-6">
            Choose how you'd like to receive your order from each seller.
            Available options are determined at the listing level by each
            seller.
          </p>
        </div>

        <div className="group relative inline-block">
          <button
            type="button"
            aria-describedby="fulfillment-tooltip"
            className="text-sm font-medium underline shrink-0 text-primary-green cursor-pointer flex gap-1 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/40 rounded min-w-[230px]"
          >
            <IoMdInformationCircleOutline className="text-lg" />
            Why am I choosing separately?
          </button>

          <div
            id="fulfillment-tooltip"
            role="tooltip"
            className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-72 origin-top-right rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-lg opacity-0 invisible translate-y-1 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0"
          >
            <span className="absolute -top-1 right-4 size-2 rotate-45 border-l border-t border-gray-200 bg-white" />
            Each seller chooses which delivery options are available for each
            product they list. During checkout, you'll select one delivery
            method for each seller. If a seller's items don't share a compatible
            delivery option, you'll need to remove the conflicting item(s) or
            purchase them in a separate order.
          </div>
        </div>
      </div>

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
                  ? "border-off-green/40 bg-off-green/10"
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
                  <p className="font-semibold text-[15px] text-secondary-black">
                    Sold by {vendor.shop_name}
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
                  <div className="border border-off-green/40 bg-off-green/20 max-w-4xl rounded-lg p-3">
                    <div className="flex gap-3">
                      <div className="size-7 shrink-0 rounded-full bg-primary-green text-sm text-white flex items-center justify-center">
                        i
                      </div>

                      <p className="text-[#374151] leading-6 text-[14px]">
                        These products don't share a compatible delivery option.
                        To continue, remove one or more conflicting items or
                        purchase them in separate orders.
                      </p>
                    </div>
                  </div>

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
                    <span className="block text-[15px] font-semibold text-primary-green">
                      {fulfillmentLabel[options[0]]}
                    </span>
                    <span className="block text-sm text-secondary-gray">
                      {fulfillmentDescription[options[0]]} · This is the only
                      delivery option available for this product.
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
                            className={`block font-semibold text-[15px] ${
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
          onClick={() => router.push(mode === "buy-now" ? "/" : "/cart")}
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

export default DeliveryOptions;
