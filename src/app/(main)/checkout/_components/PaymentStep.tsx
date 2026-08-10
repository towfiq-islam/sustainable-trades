"use client";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "@/redux/store";
import { buildCheckoutPayload, VendorFormValues } from "@/lib/checkout";
import toast from "react-hot-toast";
import { useCreateCheckoutMutation } from "@/redux/api/ordersApi";

const PaymentStep = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);
  const {
    master,
    vendor_orders: pricingByVendor,
    subscribe_website,
    terms_and_condition,
    vendors: vendorExtras,
  } = useAppSelector(state => state.checkout);
  const { getValues } = useFormContext();
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  const vendorTotals = items.map(vendor => {
    const pricing = pricingByVendor.find(p => p.vendor_id === vendor.vendor_id);
    const discount = vendorExtras[vendor.vendor_id]?.discount_amount ?? 0;
    const baseTotal = pricing?.total_amount ?? 0;
    return { vendor, discount, total: Math.max(baseTotal - discount, 0) };
  });

  const totalDiscount = Object.values(vendorExtras).reduce(
    (sum, v) => sum + (v?.discount_amount ?? 0),
    0,
  );
  const grandTotal = Math.max((master?.total_amount ?? 0) - totalDiscount, 0);

  const handlePaypalCheckout = async () => {
    if (!terms_and_condition) {
      toast.error("Please accept the terms and conditions to continue");
      return;
    }

    const { vendors: formValues } = getValues() as {
      vendors: VendorFormValues;
    };

    const payload = buildCheckoutPayload(items, formValues, vendorExtras, {
      payment_method: "paypal",
      terms_and_condition,
      subscribe_website,
    });

    try {
      const res = await createCheckout(payload).unwrap();
      toast.success(res?.message);
      // router.push(`/order-confirmation/${res.order_group_id}`);
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white text-center">
      <h3 className="text-xl font-semibold text-secondary-black mb-1">
        Confirm and pay
      </h3>
      <p className="text-sm text-secondary-gray mb-5">
        {items.length} order{items.length > 1 ? "s" : ""} will be created — one
        per seller
      </p>

      <div className="border border-gray-200 rounded-lg p-4 mb-6 text-left space-y-2">
        {vendorTotals.map(({ vendor, discount, total }) => (
          <div key={vendor.vendor_id}>
            <div className="flex justify-between text-sm text-secondary-black">
              <span>{vendor.shop_name}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-primary-green">
                <span>Discount applied</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
          </div>
        ))}
        <hr />
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm text-primary-green">
            <span>Total discount</span>
            <span>-${totalDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-secondary-black">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePaypalCheckout}
        disabled={isLoading || !terms_and_condition}
        className="w-full py-3 rounded-full bg-[#FFC439] text-[#003087] font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-95 transition-all duration-300"
      >
        {isLoading ? "Processing..." : "PayPal checkout"}
      </button>

      <button
        type="button"
        onClick={() => router.push("/checkout?step=review-order")}
        className="w-full mt-3 py-3 rounded-lg border border-gray-300 font-semibold text-secondary-black cursor-pointer hover:bg-gray-50"
      >
        Back
      </button>
    </div>
  );
};

export default PaymentStep;
