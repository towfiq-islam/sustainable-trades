"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import {
  calcVendorSubtotal,
  calcVendorTax,
  calcVendorShipping,
} from "@/lib/checkout";

const PaymentStep = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);

  const vendorTotals = items.map(vendor => {
    const subtotal = calcVendorSubtotal(vendor.products);
    const tax = calcVendorTax(subtotal);
    const shipping = calcVendorShipping(vendor.selectedFulfillment);
    return { vendor, total: subtotal + tax + shipping };
  });

  const grandTotal = vendorTotals.reduce((sum, v) => sum + v.total, 0);

  // TODO: call real order-creation API here before triggering PayPal
  const handlePaypalCheckout = () => {
    console.log("Pending order API integration");
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white text-center max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-secondary-black mb-1">
        Confirm and pay
      </h3>
      <p className="text-sm text-secondary-gray mb-5">
        {items.length} order{items.length > 1 ? "s" : ""} will be created — one
        per seller
      </p>

      <div className="border border-gray-200 rounded-lg p-4 mb-6 text-left space-y-2">
        {vendorTotals.map(({ vendor, total }) => (
          <div
            key={vendor.vendor_id}
            className="flex justify-between text-sm text-secondary-black"
          >
            <span>{vendor.shop_name}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between font-bold text-secondary-black">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePaypalCheckout}
        className="w-full py-3 rounded-full bg-[#FFC439] text-[#003087] font-bold cursor-pointer hover:scale-95 transition-all duration-300"
      >
        PayPal checkout
      </button>

      <button
        type="button"
        onClick={() => router.push("/checkout?step=review")}
        className="w-full mt-3 py-3 rounded-lg border border-gray-300 font-semibold text-secondary-black cursor-pointer hover:bg-gray-50"
      >
        Back
      </button>
    </div>
  );
};

export default PaymentStep;
