"use client";
import { useApplyCoupon } from "@/Hooks/api/dashboard_api";
import { useState } from "react";

type Item = {
  id: number;
  price: string;
  product: {
    product_name: string;
    product_price: number;
  };
};

type Props = {
  onClose: any;
  onProceed: any;
  setFormData: any;
  formData: any;
  cartItems: any;
  subTotal: number;
  cart_id: number | null;
  taxData: any;
  shop_name: string;
};

function OrderItem({
  title,
  vendor,
  price,
}: {
  title: string;
  vendor: string;
  price: string;
}) {
  return (
    <div className="flex justify-between">
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-[13px] text-gray-500 mt-0.5">{vendor}</p>
      </div>
      <span className="text-sm">{price}</span>
    </div>
  );
}

export default function OrderReviewModal({
  onClose,
  onProceed,
  formData,
  setFormData,
  cartItems,
  cart_id,
  subTotal,
  taxData,
  shop_name,
}: Props) {
  const [promo, setPromo] = useState<string>("");
  const { mutate: couponMutation, isPending } = useApplyCoupon();
  const [couponCode, setCouponCode] = useState<number | null>(null);
  const [couponType, setCouponType] = useState<string>("");

  const handleApplyCoupon = () => {
    const payload = {
      cart_id,
      coupon_code: promo,
    };

    couponMutation(payload, {
      onSuccess: (res: any) => {
        if (res?.success) {
          setCouponCode(+res?.data?.discount_amount);
          setCouponType(res?.data?.discount_type);
          setFormData((prev: any) => ({
            ...prev,
            coupon_code: promo,
          }));
        }
      },
    });
  };

  const discountAmount =
    couponCode && couponType === "percentage"
      ? (subTotal * couponCode) / 100
      : couponCode && couponType === "fixed"
        ? couponCode
        : 0;

  const totalAfterDiscount = Math.max(0, subTotal - discountAmount);
  const total = Math.max(
    0,
    totalAfterDiscount + taxData?.calculated_tax + taxData?.shipping_cost,
  );

  return (
    <div className="">
      <h2 className="text-lg text-light-green font-semibold">
        Review your order details
      </h2>

      <p className="mt-0.5 font-semibold text-[15px] text-secondary-gray">
        Shipping and Payment Information.
      </p>

      {/* Customer Info */}
      <div className="mt-3 space-y-2 border-b text-gray-300 pb-4">
        <div className="mb-2.5">
          <p className="text-secondary-gray font-semibold text-sm mb-1">
            Customer Details:{" "}
          </p>

          <p className="flex items-center gap-2 text-sm text-gray-700">
            {formData?.first_name} {formData?.last_name}
          </p>
          <p className="text-sm text-gray-700">{formData?.email}</p>
          <p className="text-sm text-gray-700">{formData?.phone}</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formData?.subscribe_website === 1}
            onChange={e =>
              setFormData((prev: any) => ({
                ...prev,
                subscribe_website: e.target.checked ? 1 : 0,
              }))
            }
            className="size-4 accent-primary-green cursor-pointer"
          />
          Subscribe to Sustainable Trades newsletters
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formData?.subscribe_shop === 1}
            onChange={e =>
              setFormData((prev: any) => ({
                ...prev,
                subscribe_shop: e.target.checked ? 1 : 0,
              }))
            }
            className="size-4 accent-primary-green cursor-pointer"
          />
          Subscribe to {shop_name} newsletters
        </label>
      </div>

      {/* Shipping Info */}
      <div className="mt-3">
        <h3 className="font-semibold text-secondary-gray">
          Shipping Information:
        </h3>

        <div className="mt-1 text-sm text-gray-700">
          <p>{formData?.address}</p>
          {formData?.apt && <p>{formData.apt}</p>}
          <p>
            {formData?.city}
            {formData?.state ? `, ${formData.state}` : ""}
            {formData?.postal_code ? ` ${formData.postal_code}` : ""}
          </p>
          <p>{formData?.country}</p>
        </div>
      </div>

      {/* Promo */}
      <div className="mt-4">
        <p className="flex gap-3 items-center justify-between border border-primary-green px-3 py-2.5 text-sm rounded-[6px]">
          <input
            type="text"
            value={promo}
            readOnly={isPending}
            onChange={e => setPromo(e.target.value)}
            className="h-full w-full block outline-none read-only:opacity-50 read-only:animate-pulse"
            placeholder="Enter promo code (If have)"
          />

          {promo && (
            <button
              disabled={isPending}
              onClick={handleApplyCoupon}
              className="text-accent-red hover:underline cursor-pointer"
            >
              {isPending ? "Applying... " : "Apply"}
            </button>
          )}
        </p>

        {couponCode && (
          <p className="mt-2 text-xs text-primary-green font-semibold">
            Promo applied
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="mt-4">
        <label className="flex items-start gap-3 text-secondary-gray text-sm">
          <input
            type="checkbox"
            checked={formData?.terms_and_condition === 1}
            onChange={e =>
              setFormData((prev: any) => ({
                ...prev,
                terms_and_condition: e.target.checked ? 1 : 0,
              }))
            }
            className="mt-1 size-4 accent-primary-green cursor-pointer"
          />

          <span>
            By continuing, you agree to Sustainable Trades' Acceptable Use
            Policy, Privacy Policy, and Terms & Conditions.
          </span>
        </label>
      </div>

      {/* Order Summary */}
      <div className="mt-5">
        <h3 className="text-lg font-semibold text-secondary-gray">Subtotal</h3>

        <div className="mt-2 space-y-4">
          {cartItems?.cart_items?.map((item: Item) => (
            <OrderItem
              title={item?.product?.product_name}
              vendor={cartItems?.shop?.shop_name}
              price={`$${Number(item?.price).toFixed(2)}`}
            />
          ))}

          <div className="space-y-2">
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span>
                  Promo Discount{" "}
                  {couponType === "percentage" ? `(${couponCode}% off)` : ""}
                </span>

                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Est. Sales Tax ({taxData?.tax_rate?.toFixed(2)}%)</span>
              <span>${taxData?.calculated_tax?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping *</span>
              <span>${taxData?.shipping_cost?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="my-4 border-t border-gray-300" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xl font-semibold text-secondary-gray">
              Total
            </span>
            <span className="text-xl font-semibold text-secondary-black">
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>{cartItems?.cart_items?.length} Cart Items</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-3">
        <button
          disabled={!formData?.terms_and_condition}
          onClick={() => onProceed()}
          className="w-full primary_btn"
        >
          Checkout
        </button>

        <button
          onClick={onClose}
          className="w-full rounded-md bg-[#d9e3d0] py-3 font-semibold text-primary-green cursor-pointer"
        >
          Back to Shipping
        </button>
      </div>
    </div>
  );
}
