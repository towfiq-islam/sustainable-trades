"use client";

import { CartItem } from "@/redux/slices/cartSlice";
import ShippingCheckout from "./ShippingCheckout";
import PickupCheckout from "./PickupCheckout";
import DeliveryCheckout from "./DeliveryCheckout";

type Props = {
  vendor: CartItem;
};

export default function VendorCheckout({ vendor }: Props) {
  switch (vendor.selectedFulfillment) {
    case "shipping":
      return <ShippingCheckout vendor={vendor} />;

    case "pickup":
      return <PickupCheckout vendor={vendor} />;

    case "delivery":
      return <DeliveryCheckout vendor={vendor} />;

    default:
      return (
        <div className="border rounded-lg p-5 bg-yellow-50 text-yellow-700">
          Please select a fulfillment method for this vendor.
        </div>
      );
  }
}
