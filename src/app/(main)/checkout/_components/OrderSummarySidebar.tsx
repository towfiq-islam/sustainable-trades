import Image from "next/image";
import { CartItem } from "@/redux/slices/cartSlice";
import { useAppSelector } from "@/redux/store";

const OrderSummarySidebar = ({ items }: { items: CartItem[] }) => {
  const { master } = useAppSelector(state => state.checkoutPricing);

  const subtotal = items.reduce(
    (sum, vendor) =>
      sum +
      vendor.products.reduce(
        (vendorSum, product) => vendorSum + product.price * product.quantity,
        0,
      ),
    0,
  );

  const hasPricing = !!master;
  const total = master?.total_amount ?? subtotal;

  return (
    <aside className="border border-gray-300 rounded-xl p-5 space-y-4 h-fit">
      <h3 className="text-lg font-semibold text-secondary-black">
        Order Summary
      </h3>

      <div className="space-y-4">
        {items.map(vendor => (
          <div
            key={vendor.vendor_id}
            className="space-y-2.5 border-b pb-4 last:pb-1 border-gray-200 last:border-b-0"
          >
            <h3 className="text-sm font-semibold text-secondary-black">
              Sold by {vendor.shop_name} ({vendor.products.length} item
              {vendor.products.length > 1 ? "s" : ""})
            </h3>

            {vendor.products.map(product => (
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
            ))}
          </div>
        ))}
      </div>

      <hr className="text-gray-300" />

      <div className="flex justify-between text-sm text-secondary-gray">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {hasPricing ? (
        <>
          <div className="flex justify-between text-sm text-secondary-gray -mt-2">
            <span>Tax</span>
            <span>${master.tax_amount.toFixed(2)}</span>
          </div>
          {master.shipping_amount > 0 && (
            <div className="flex justify-between text-sm text-secondary-gray -mt-2">
              <span>Shipping</span>
              <span>${master.shipping_amount.toFixed(2)}</span>
            </div>
          )}
          {master.delivery_amount > 0 && (
            <div className="flex justify-between text-sm text-secondary-gray -mt-2">
              <span>Delivery</span>
              <span>${master.delivery_amount.toFixed(2)}</span>
            </div>
          )}
          {master.discount_amount > 0 && (
            <div className="flex justify-between text-sm text-secondary-gray -mt-2">
              <span>Discount</span>
              <span>-${master.discount_amount.toFixed(2)}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-between text-sm text-secondary-gray -mt-1">
          <span>Tax and shipping</span>
          <span>Calculated next</span>
        </div>
      )}

      <hr className="text-gray-300" />

      <div className="flex justify-between font-bold text-secondary-black">
        <span className="text-primary-green">
          {hasPricing ? "Total" : "Estimated total"}
        </span>
        <span>${total.toFixed(2)}</span>
      </div>
    </aside>
  );
};

export default OrderSummarySidebar;
