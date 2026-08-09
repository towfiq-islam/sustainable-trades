"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { fulfillmentLabel } from "@/lib/fulfillment";
import { useState } from "react";
import { useApplyCouponMutation } from "@/redux/api/discountApi";
import { LuLoaderPinwheel } from "react-icons/lu";
import toast from "react-hot-toast";

const ReviewStep = () => {
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [vendorId, setVendorId] = useState<number | null>(null);
  const { items } = useAppSelector(state => state.cart);
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();
  const { master, vendor_orders: pricingByVendor } = useAppSelector(
    state => state.checkoutPricing,
  );

  const vendorTotals = items.map(vendor => {
    const pricing = pricingByVendor.find(p => p.vendor_id === vendor.vendor_id);
    return {
      vendor,
      tax: pricing?.tax_amount ?? 0,
      shipping: pricing?.shipping_amount ?? 0,
      delivery: pricing?.delivery_amount ?? 0,
      total: pricing?.total_amount ?? 0,
    };
  });

  const grandTotal = master?.total_amount ?? 0;

  const handleApplyCoupon = (vendor_id: number) => {
    const vendor = items.find(v => v.vendor_id === vendor_id);
    if (!vendor) return;

    const payload = {
      vendor_id,
      coupon_code: coupon,
      products: vendor.products.map(p => p.id),
    };

    applyCoupon(payload)
      .unwrap()
      .then(res => {
        toast.success(res?.message);
        setCoupon("");
      })
      .catch(err => {
        toast.error(err?.data?.message);
      });
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white">
      <h3 className="text-xl font-semibold text-secondary-black mb-3">
        Review your order
      </h3>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          // checked={formData?.subscribe_website === 1}
          // onChange={e =>
          //   setFormData((prev: any) => ({
          //     ...prev,
          //     subscribe_website: e.target.checked ? 1 : 0,
          //   }))
          // }
          className="size-4 accent-primary-green cursor-pointer"
        />
        Subscribe to Sustainable Trades newsletters
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          // checked={formData?.subscribe_shop === 1}
          // onChange={e =>
          //   setFormData((prev: any) => ({
          //     ...prev,
          //     subscribe_shop: e.target.checked ? 1 : 0,
          //   }))
          // }
          className="size-4 accent-primary-green cursor-pointer"
        />
        Subscribe to dsf newsletters
        {/* Subscribe to {shop_name} newsletters */}
      </label>

      <div className="space-y-5 mt-5 mb-6">
        {vendorTotals.map(({ vendor, tax, shipping, delivery, total }) => (
          <div
            key={vendor.vendor_id}
            className="border border-gray-300 rounded-xl p-4"
          >
            <p className="font-semibold text-[15px] text-secondary-black">
              Sold by {vendor.shop_name}
            </p>
            <p className="text-sm text-secondary-gray mb-3">
              {vendor.selectedFulfillment
                ? fulfillmentLabel[vendor.selectedFulfillment]
                : "—"}
            </p>

            {vendor.products.map(product => (
              <div
                key={product.id}
                className="flex justify-between text-sm mb-1"
              >
                <span className="text-secondary-black">
                  {product.name} x{product.quantity}
                </span>
                <span className="text-secondary-black">
                  ${(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            {/* Promo code */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
              <input
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="Promo code"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-green"
              />
              <button
                type="button"
                disabled={!coupon}
                onClick={() => {
                  setVendorId(vendor.vendor_id);
                  handleApplyCoupon(vendor.vendor_id);
                }}
                className={`px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-secondary-black cursor-pointer hover:bg-gray-50 shrink-0 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${vendorId === vendor.vendor_id && isLoading && "opacity-50 cursor-not-allowed"}`}
              >
                {vendorId === vendor.vendor_id && isLoading ? (
                  <LuLoaderPinwheel className="animate-spin text-sm" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>

            <div className="flex justify-between text-sm text-secondary-gray mt-2">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <div className="flex justify-between text-sm text-secondary-gray">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            )}
            {delivery > 0 && (
              <div className="flex justify-between text-sm text-secondary-gray">
                <span>Delivery</span>
                <span>${delivery.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold text-secondary-black mt-2 pt-2 border-t border-gray-200">
              <span>Vendor total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-lg font-bold text-secondary-black mb-6 pt-3 border-t border-gray-300">
        <span>Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>

      <div className="flex gap-3 justify-between">
        <button
          type="button"
          onClick={() => router.push("/checkout?step=delivery-details")}
          className="px-6 py-3 rounded-lg border border-gray-300 font-semibold text-secondary-black cursor-pointer hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => router.push("/checkout?step=payment")}
          className="px-6 py-3 rounded-lg bg-primary-green text-white font-semibold cursor-pointer hover:scale-95 transition-all duration-300"
        >
          Confirm and pay
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
