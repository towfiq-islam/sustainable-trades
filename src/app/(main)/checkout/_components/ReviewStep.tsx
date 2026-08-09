"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { fulfillmentLabel } from "@/lib/fulfillment";

const ReviewStep = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);
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

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-secondary-black mb-5">
        Review your order
      </h3>

      <div className="space-y-5 mb-6">
        {vendorTotals.map(({ vendor, tax, shipping, delivery, total }) => (
          <div
            key={vendor.vendor_id}
            className="border border-gray-200 rounded-lg p-4"
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
