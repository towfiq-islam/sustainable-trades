"use client";

import { CartItem } from "@/redux/slices/cartSlice";

type Props = {
  vendor: CartItem;
};

export default function ShippingCheckout({ vendor }: Props) {
  return (
    <div className="border rounded-xl p-5 bg-white space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Shipping - {vendor.shop_name}</h3>

        <p className="text-sm text-gray-500">
          Enter your shipping information.
        </p>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <input className="form-input" placeholder="Full Name" />

        <input className="form-input" placeholder="Phone Number" />

        <input className="form-input" placeholder="Street Address" />

        <input className="form-input" placeholder="City" />

        <input className="form-input" placeholder="State" />

        <input className="form-input" placeholder="ZIP Code" />
      </div>

      {/* Shipping Method */}

      <div>
        <h4 className="font-semibold mb-3">Shipping Method</h4>

        <label className="flex gap-3">
          <input type="radio" />
          UPS
        </label>

        <label className="flex gap-3">
          <input type="radio" />
          USPS
        </label>

        <label className="flex gap-3">
          <input type="radio" />
          FedEx
        </label>
      </div>
    </div>
  );
}
