"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fulfillmentLabel } from "@/lib/fulfillment";
import { formatDiscountLabel, VendorFormFields } from "@/lib/checkout";
import { useState } from "react";
import { useApplyCouponMutation } from "@/redux/api/discountApi";
import { LuLoaderPinwheel } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import {
  setSubscribeWebsite,
  setTermsAndCondition,
  setVendorCoupon,
  setVendorSubscribeShop,
} from "@/redux/slices/checkoutSlice";
import { CartItem } from "@/redux/slices/cartSlice";

const ReviewStep = ({ items }: { items: CartItem[] }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { getValues } = useFormContext();
  const [couponInputs, setCouponInputs] = useState<Record<number, string>>({});
  const [applyingVendorId, setApplyingVendorId] = useState<number | null>(null);
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();
  const {
    master,
    vendor_orders: pricingByVendor,
    subscribe_website,
    terms_and_condition,
    vendors: vendorExtras,
  } = useAppSelector(state => state.checkout);

  const vendorTotals = items.map(vendor => {
    const pricing = pricingByVendor.find(p => p.vendor_id === vendor.vendor_id);
    const formFields: VendorFormFields =
      getValues(`vendors.${vendor.vendor_id}`) ?? {};
    const extras = vendorExtras[vendor.vendor_id];
    const discount = extras?.discount_amount ?? 0;
    const baseTotal = pricing?.total_amount ?? 0;
    const subtotal = vendor.products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );

    return {
      vendor,
      subtotal,
      tax: pricing?.tax_amount ?? 0,
      shipping: pricing?.shipping_amount ?? 0,
      delivery: pricing?.delivery_amount ?? 0,
      discount,
      discountType: extras?.discount_type,
      discountValue: extras?.discount_value,
      total: Math.max(baseTotal - discount, 0),
      formFields,
    };
  });

  const totalDiscount = Object.values(vendorExtras).reduce(
    (sum, v) => sum + (v?.discount_amount ?? 0),
    0,
  );

  const grandTotal = Math.max((master?.total_amount ?? 0) - totalDiscount, 0);

  const handleApplyCoupon = (vendor_id: number) => {
    const vendor = items.find(v => v.vendor_id === vendor_id);
    if (!vendor) return;

    const code = couponInputs[vendor_id];
    if (!code) return;

    setApplyingVendorId(vendor_id);

    const payload = {
      vendor_id,
      coupon_code: code,
      products: vendor.products.map(p => p.id),
    };

    applyCoupon(payload)
      .unwrap()
      .then(res => {
        toast.success(res?.message);
        dispatch(
          setVendorCoupon({
            vendor_id,
            coupon_code: res?.data?.coupon_code ?? code,
            discount_amount: res?.data?.discount_amount ?? 0,
            discount_type: res?.data?.discount_type ?? null,
            discount_value: res?.data?.discount_value
              ? Number(res.data.discount_value)
              : null,
          }),
        );
        setCouponInputs(prev => ({ ...prev, [vendor_id]: "" }));
      })
      .catch(err => {
        toast.error(err?.data?.message);
      })
      .finally(() => setApplyingVendorId(null));
  };

  const buildStepUrl = (step: string) => {
    const params = new URLSearchParams();
    params.set("step", step);
    if (mode) params.set("mode", mode);
    return `/checkout?${params.toString()}`;
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white">
      <h3 className="text-xl font-semibold text-secondary-black mb-3">
        Review your order
      </h3>

      <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <input
          type="checkbox"
          checked={subscribe_website}
          onChange={e => dispatch(setSubscribeWebsite(e.target.checked))}
          className="size-3.5 accent-primary-green cursor-pointer"
        />
        Subscribe to Sustainable Trades newsletters
      </label>

      <label className="flex items-start gap-2 text-sm text-gray-700 mb-5 text-left">
        <input
          type="checkbox"
          checked={terms_and_condition}
          onChange={e => dispatch(setTermsAndCondition(e.target.checked))}
          className="size-3.5 mt-0.5 accent-primary-green cursor-pointer shrink-0"
        />
        <span>
          I agree to the{" "}
          <a
            href="/help/terms-and-conditions"
            target="_blank"
            className="text-primary-green underline"
          >
            Terms and Conditions
          </a>
        </span>
      </label>

      <div className="space-y-5 mt-5 mb-6">
        {vendorTotals.map(vendorTotal => {
          const {
            vendor,
            subtotal,
            tax,
            shipping,
            delivery,
            total,
            formFields,
            discount,
            discountType,
            discountValue,
          } = vendorTotal;
          const appliedCoupon = vendorExtras[vendor.vendor_id]?.coupon_code;
          const isSubscribed =
            vendorExtras[vendor.vendor_id]?.subscribe_shop ?? false;

          const fulfillment = vendor.selectedFulfillment;
          const isPickup = fulfillment === "pickup";
          const needsAddress =
            fulfillment === "delivery" || fulfillment === "shipping";
          const hasContactInfo = Boolean(
            formFields.first_name || formFields.email,
          );
          const pickupLocation =
            vendorExtras[vendor.vendor_id]?.pickup_location;

          return (
            <div
              key={vendor.vendor_id}
              className="border border-gray-300 rounded-xl p-4"
            >
              <p className="font-semibold text-[15px] text-secondary-black">
                Sold by {vendor.shop_name}
              </p>

              <p className="text-sm text-secondary-gray mb-3">
                {fulfillment ? fulfillmentLabel[fulfillment] : "—"}
              </p>

              {hasContactInfo && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1.5">
                  <p className="text-sm text-secondary-black font-medium">
                    {formFields.first_name} {formFields.last_name}
                  </p>

                  <p className="text-[13px] text-secondary-gray">
                    <span className="block pb-1">{formFields.email}</span>

                    {formFields.phone ? `${formFields.phone}` : ""}
                  </p>

                  {needsAddress && formFields.street_address && (
                    <p className="flex items-start gap-1.5 text-[13px] text-secondary-gray">
                      <IoLocationOutline className="text-primary-green shrink-0 mt-0.5" />
                      <span>
                        {formFields.street_address}
                        {formFields.city ? `, ${formFields.city}` : ""}
                        {formFields.state ? `, ${formFields.state}` : ""}
                        {formFields.postal_code
                          ? ` ${formFields.postal_code}`
                          : ""}
                        {formFields.country ? `, ${formFields.country}` : ""}
                      </span>
                    </p>
                  )}

                  {isPickup && pickupLocation && (
                    <p className="flex items-start gap-1.5 text-[13px] text-secondary-gray">
                      <IoLocationOutline className="text-primary-green shrink-0 mt-0.5" />
                      <span>
                        {pickupLocation.location_name} —{" "}
                        {pickupLocation.address}
                        {pickupLocation.unit
                          ? `, ${pickupLocation.unit}`
                          : ""}, {pickupLocation.city}, {pickupLocation.state}{" "}
                        {pickupLocation.zip_code}
                      </span>
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4 mb-4">
                <input
                  value={couponInputs[vendor.vendor_id] ?? ""}
                  onChange={e =>
                    setCouponInputs(prev => ({
                      ...prev,
                      [vendor.vendor_id]: e.target.value,
                    }))
                  }
                  placeholder="Promo code"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-green"
                />
                <button
                  type="button"
                  disabled={!couponInputs[vendor.vendor_id]}
                  onClick={() => handleApplyCoupon(vendor.vendor_id)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-secondary-black cursor-pointer hover:bg-gray-50 shrink-0 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applyingVendorId === vendor.vendor_id && isLoading ? (
                    <LuLoaderPinwheel className="animate-spin text-sm" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>

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

              <div className="space-y-1 pt-2 border-t border-gray-200 mt-3">
                <div className="flex justify-between text-sm text-secondary-gray">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-primary-green">
                    <span>
                      {formatDiscountLabel(discountType, discountValue)}
                    </span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-secondary-gray">
                  <span>Sales Tax</span>
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
                    <span>Local Delivery Fee</span>
                    <span>${delivery.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm font-semibold text-secondary-black mt-2 pt-2 border-t border-gray-200">
                <span>Vendor total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <label className="flex items-center gap-2 text-[13px] text-gray-700 pt-2">
                <input
                  type="checkbox"
                  checked={isSubscribed}
                  onChange={e =>
                    dispatch(
                      setVendorSubscribeShop({
                        vendor_id: vendor.vendor_id,
                        subscribe_shop: e.target.checked,
                      }),
                    )
                  }
                  className="size-3 accent-primary-green cursor-pointer"
                />
                Subscribe to {vendor.shop_name} newsletters
              </label>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-lg font-bold text-secondary-black mb-6 pt-3 border-t border-gray-300">
        <span>Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>

      <div className="flex gap-3 justify-between">
        <button
          type="button"
          onClick={() => router.push(buildStepUrl("delivery-details"))}
          className="px-6 py-3 rounded-lg border border-gray-300 font-semibold text-secondary-black cursor-pointer hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!terms_and_condition}
          onClick={() => router.push(buildStepUrl("payment"))}
          className="px-6 py-3 rounded-lg bg-primary-green text-white font-semibold cursor-pointer enabled:hover:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Confirm and pay
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
