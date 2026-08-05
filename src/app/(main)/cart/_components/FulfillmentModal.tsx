"use client";

import { useMemo, useState } from "react";
import { FaStore, FaMapMarkerAlt, FaTruck, FaBoxOpen } from "react-icons/fa";
import { CartItem } from "@/redux/slices/cartSlice";

type Fulfillment = "pickup" | "delivery" | "shipping";

interface Props {
  vendors: CartItem[];
  open: boolean;
  onClose: () => void;
  onContinue: (
    data: {
      vendor_id: number;
      fulfillment: Fulfillment;
    }[],
  ) => void;
}

export default function FulfillmentModal({
  vendors,
  open,
  onClose,
  onContinue,
}: Props) {
  /**
   * Returns the common fulfillment methods available
   * for all products of a vendor.
   */
  const getAvailableFulfillments = (vendor: CartItem): Fulfillment[] => {
    if (!vendor.products.length) return [];

    const common = vendor.products[0].availableFulfillments.filter(method =>
      vendor.products.every(product =>
        product.availableFulfillments.includes(method),
      ),
    );

    return common as Fulfillment[];
  };

  /**
   * Cache fulfillment methods for each vendor.
   */
  const vendorMethods = useMemo(() => {
    return vendors.map(vendor => ({
      ...vendor,
      methods: getAvailableFulfillments(vendor),
    }));
  }, [vendors]);

  /**
   * Auto select if only one fulfillment exists.
   */
  const [selected, setSelected] = useState<Record<number, Fulfillment>>(() => {
    const defaults: Record<number, Fulfillment> = {};

    vendors.forEach(vendor => {
      const methods = getAvailableFulfillments(vendor);

      if (methods.length === 1) {
        defaults[vendor.vendor_id] = methods[0];
      }
    });

    return defaults;
  });

  if (!open) return null;

  const completed = Object.keys(selected).length;

  const handleContinue = () => {
    if (completed !== vendors.length) {
      alert("Please select a fulfillment method for every seller.");
      return;
    }

    onContinue(
      Object.entries(selected).map(([vendorId, fulfillment]) => ({
        vendor_id: Number(vendorId),
        fulfillment,
      })),
    );
  };

  const getMethodLabel = (method: Fulfillment) => {
    switch (method) {
      case "pickup":
        return "Local Pickup";
      case "delivery":
        return "Local Delivery";
      case "shipping":
        return "Shipping";
    }
  };

  const getMethodDescription = (method: Fulfillment) => {
    switch (method) {
      case "pickup":
        return "Pick up directly from the seller.";
      case "delivery":
        return "Delivered locally by the seller.";
      case "shipping":
        return "Delivered through a shipping carrier.";
    }
  };

  const getMethodIcon = (method: Fulfillment) => {
    switch (method) {
      case "pickup":
        return <FaMapMarkerAlt className="text-green-600 text-lg" />;

      case "delivery":
        return <FaTruck className="text-blue-600 text-lg" />;

      case "shipping":
        return <FaBoxOpen className="text-orange-600 text-lg" />;
    }
  };

  return (
    <div className="">
      {/* Header */}

      <div className="border-b px-6 py-5">
        <h2 className="text-2xl font-bold">Choose Delivery Method</h2>

        <p className="text-gray-500 mt-1">
          Your order contains items from{" "}
          <span className="font-semibold">{vendors.length}</span> seller(s).
          Please choose a fulfillment method for each seller.
        </p>

        <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="bg-green-600 h-full transition-all"
            style={{
              width: `${(completed / vendors.length) * 100}%`,
            }}
          />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {completed} of {vendors.length} completed
        </p>
      </div>

      {/* Vendor List */}

      <div className="max-h-[65vh] overflow-y-auto p-6 space-y-5">
        {vendorMethods.map(vendor => (
          <div key={vendor.vendor_id} className="border rounded-xl p-5">
            {/* Shop */}

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                <FaStore className="text-green-700" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">{vendor.shop_name}</h3>

                <p className="text-gray-500 text-sm">
                  {vendor.products.length} Product(s)
                </p>
              </div>
            </div>

            {/* Products */}

            <div className="mt-4 flex flex-wrap gap-2">
              {vendor.products.map(product => (
                <span
                  key={product.id}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {product.name}
                </span>
              ))}
            </div>

            {/* Fulfillment */}

            {vendor.methods.length === 0 ? (
              <div className="mt-5 rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                These products don't share a common fulfillment method. Please
                remove one of the products.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {vendor.methods.map(method => (
                  <label
                    key={method}
                    className={`flex gap-4 border rounded-lg p-4 cursor-pointer transition

                      ${
                        selected[vendor.vendor_id] === method
                          ? "border-green-600 bg-green-50"
                          : "hover:border-gray-400"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`vendor-${vendor.vendor_id}`}
                      checked={selected[vendor.vendor_id] === method}
                      onChange={() =>
                        setSelected(prev => ({
                          ...prev,
                          [vendor.vendor_id]: method,
                        }))
                      }
                    />

                    <div>
                      <div className="flex items-center gap-2 font-semibold">
                        {getMethodIcon(method)}
                        {getMethodLabel(method)}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {getMethodDescription(method)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}

      <div className="border-t px-6 py-4 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="border rounded-lg px-5 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleContinue}
          className="bg-green-700 hover:bg-green-800 text-white rounded-lg px-6 py-2"
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}
