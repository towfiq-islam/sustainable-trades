"use client";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { FaStore, FaMapMarkerAlt, FaTruck, FaBoxOpen } from "react-icons/fa";
import { CartItem } from "@/redux/slices/cartSlice";
import { fulfillmentLabel } from "@/lib/fulfillment";
import { useAppDispatch } from "@/redux/store";
import { setVendorFulfillment } from "@/redux/slices/cartSlice";

type Fulfillment = "pickup" | "delivery" | "shipping";

interface Props {
  vendors: CartItem[];
  onContinue: (data: { vendor_id: number; fulfillment: Fulfillment }[]) => void;
}

const fulfillmentConfig: Record<
  Fulfillment,
  {
    label: string;
    description: string;
    icon: React.ReactNode;
  }
> = {
  pickup: {
    label: fulfillmentLabel.pickup,
    description: "Pick up directly from the seller.",
    icon: <FaMapMarkerAlt className="text-green-600" />,
  },

  delivery: {
    label: fulfillmentLabel.delivery,
    description: "Delivered by the seller.",
    icon: <FaTruck className="text-blue-600" />,
  },

  shipping: {
    label: fulfillmentLabel.shipping,
    description: "Delivered through a shipping carrier.",
    icon: <FaBoxOpen className="text-orange-600" />,
  },
};
export default function FulfillmentModal({ vendors, onContinue }: Props) {
  const dispatch = useAppDispatch();

  const vendorMethods = useMemo(() => {
    return vendors.map(vendor => {
      if (!vendor.products.length) {
        return {
          ...vendor,
          methods: [] as Fulfillment[],
        };
      }

      const methods = vendor.products.reduce<Fulfillment[]>(
        (common, product) => {
          const productFulfillment = product.fulfillment ?? [];

          return common.filter(method => productFulfillment.includes(method));
        },
        vendor.products[0]?.fulfillment ?? [],
      );

      return {
        ...vendor,
        methods,
      };
    });
  }, [vendors]);

  const handleContinue = () => {
    const missing = vendorMethods.find(v => !v.selectedFulfillment);

    if (missing) {
      toast.error(`Please select a fulfillment for ${missing.shop_name}`);
      return;
    }

    onContinue(
      vendorMethods.map(v => ({
        vendor_id: v.vendor_id,
        fulfillment: v.selectedFulfillment as Fulfillment,
      })),
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Choose Fulfillment</h2>
        <p className="text-gray-500">
          Select a fulfillment method for each seller.
        </p>
      </div>

      {vendorMethods.map(vendor => (
        <div key={vendor.vendor_id} className="border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <FaStore className="text-green-700" />
            </div>
            <div>
              <h3 className="font-semibold">{vendor.shop_name}</h3>
              <p className="text-sm text-gray-500">
                {vendor.products.length} product(s)
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {vendor.products.map(product => (
              <span
                key={product.id}
                className="px-3 py-1 rounded-full bg-gray-100 text-sm"
              >
                {product.name} × {product.quantity}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {vendor.methods.map(method => {
              const cfg = fulfillmentConfig[method];
              if (!cfg) return null;

              return (
                <label
                  key={method}
                  className={`flex gap-3 border rounded-lg p-4 cursor-pointer ${
                    vendor.selectedFulfillment === method
                      ? "border-green-600 bg-green-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    checked={vendor.selectedFulfillment === method}
                    onChange={() => {
                      dispatch(
                        setVendorFulfillment({
                          vendor_id: vendor.vendor_id,
                          fulfillment: method,
                        }),
                      );
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      {cfg.icon}
                      {cfg.label}
                    </div>
                    <p className="text-sm text-gray-500">{cfg.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="px-6 py-2 rounded-lg bg-primary-green text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
