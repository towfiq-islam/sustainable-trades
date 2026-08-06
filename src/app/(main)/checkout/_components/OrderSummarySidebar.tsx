import Image from "next/image";
import { CartItem } from "@/redux/slices/cartSlice";
import { calcVendorSubtotal } from "@/lib/checkout";

const OrderSummarySidebar = ({ items }: { items: CartItem[] }) => {
  const subtotal = items.reduce(
    (sum, vendor) => sum + calcVendorSubtotal(vendor.products),
    0,
  );

  return (
    <aside className="border border-gray-300 rounded-lg p-5 space-y-4 h-fit">
      <h3 className="text-lg font-semibold text-secondary-black">
        Order Summary
      </h3>

      <div className="space-y-3">
        {items.map(vendor =>
          vendor.products.map(product => (
            <div
              key={`${vendor.vendor_id}-${product.id}`}
              className="flex gap-3 items-center"
            >
              <figure className="size-12 rounded-md border border-gray-100 relative shrink-0 bg-gray-100">
                {product.image && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${product.image}`}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover rounded-md"
                  />
                )}
              </figure>
              <div className="grow">
                <p className="text-sm font-medium text-secondary-black">
                  {product.name}
                </p>
                <p className="text-xs text-secondary-gray pt-0.5">
                  Qty {product.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-secondary-black">
                ${(product.price * product.quantity).toFixed(2)}
              </p>
            </div>
          )),
        )}
      </div>

      <hr className="text-gray-300" />

      <div className="flex justify-between text-sm text-secondary-gray">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-secondary-gray -mt-1">
        <span>Tax and shipping</span>
        <span>Calculated next</span>
      </div>

      <hr className="text-gray-300" />

      <div className="flex justify-between font-bold text-secondary-black">
        <span className="text-primary-green">Estimated total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
    </aside>
  );
};

export default OrderSummarySidebar;
