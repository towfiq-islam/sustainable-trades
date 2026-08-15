"use client";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoCheckmarkCircle,
  IoPersonOutline,
  IoMailOutline,
} from "react-icons/io5";
import Container from "@/Components/Common/Container";
import { useGetOrderDetailsQuery } from "@/redux/api/ordersApi";
import { fulfillmentLabel } from "@/lib/fulfillment";
import { OrderSuccessSkeleton } from "@/Components/Loader/Loader";
import useAuth from "@/Hooks/useAuth";
import { BsTruck } from "react-icons/bs";

type VendorItem = {
  id: number;
  vendor_id: number;
  fulfillment_type: string;
  discount_amount: number;
  sub_total: number;
  delivery_amount: number;
  shipping_amount: number;
  total_amount: number;
  tax_amount: number;
  items: {
    id: number;
    product_name: string;
    quantity: number;
    total_price: number;
  }[];
  shop: {
    id?: number;
    name: string;
    image: string;
  };
};

type Props = {
  searchParams: Promise<{ order_id: number; shop_id: number }>;
};

const getInitials = (name: string) =>
  name
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "";

const fulfillmentDisplay = (type: string) =>
  fulfillmentLabel[type as "pickup" | "delivery" | "shipping"] ?? type;

export default function Page({ searchParams }: Props) {
  const { order_id } = use(searchParams);
  const { user } = useAuth();
  const { data: res, isLoading } = useGetOrderDetailsQuery(order_id, {
    skip: !order_id,
  });
  const order = res?.data;

  if (isLoading) {
    return (
      <section className="py-12">
        <Container>
          <OrderSuccessSkeleton />
        </Container>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="py-12">
        <Container>
          <p className="text-center text-secondary-gray py-16">
            We couldn't find this order.
          </p>
        </Container>
      </section>
    );
  }

  const vendorOrders: VendorItem[] = order.vendor_orders ?? [];
  const visibleVendors = vendorOrders.slice(0, 3);
  const extraVendorCount = vendorOrders.length - visibleVendors.length;
  const extraVendorItemCount = vendorOrders
    .slice(3)
    .reduce(
      (sum, v) => sum + v.items.reduce((s, item) => s + item.quantity, 0),
      0,
    );
  const extraVendorTotal = vendorOrders
    .slice(3)
    .reduce((sum, v) => sum + v.total_amount, 0);

  return (
    <section className="py-12">
      <Container>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left - informational content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-2">
              <IoCheckmarkCircle className="text-primary-green text-3xl shrink-0" />
              <h1 className="text-2xl font-semibold text-secondary-black">
                Thank you for your purchase!
              </h1>
            </div>
            <p className="text-secondary-gray mb-6">
              Your order has been placed and your payment is confirmed.
            </p>

            <div className="space-y-5">
              {/* Multi-vendor notice */}
              <div className="flex gap-3.5 bg-off-green/20 rounded-lg p-4">
                <div className="size-12 rounded-full bg-off-green/50 grid place-items-center shrink-0">
                  <BsTruck className="text-primary-green text-xl" />
                </div>
                <p className="text-sm text-secondary-gray leading-relaxed">
                  Your order includes items from multiple sellers. Each seller
                  will fulfill their portion of your order separately, so
                  pickup, delivery, shipping, and status updates may vary by
                  seller.
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* If has account */}
              <div className="flex gap-3.5">
                <div className="size-10 rounded-full bg-off-green/30 grid place-items-center shrink-0">
                  <IoPersonOutline className="text-primary-green text-lg" />
                </div>
                <div className="text-[15px] text-secondary-gray leading-relaxed">
                  <p className="font-semibold text-secondary-black mb-1">
                    If you have a Sustainable Shopper account:
                  </p>
                  <p className="text-sm leading-6.5">
                    Click the View order button above or go to the Orders tab on
                    your dashboard and select View Details. From there, you can
                    view each seller's order details, track the status of your
                    items, and message each seller directly.
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* If guest */}
              <div className="flex gap-3.5">
                <div className="size-10 rounded-full bg-off-green/30 grid place-items-center shrink-0">
                  <IoMailOutline className="text-primary-green text-lg" />
                </div>
                <div className="text-[15px] text-secondary-gray leading-relaxed">
                  <p className="font-semibold text-secondary-black mb-1">
                    If you checked out as a guest:
                  </p>
                  <p className="text-sm leading-6.5">
                    Consider creating a free Sustainable Shopper account{" "}
                    <Link
                      href="/auth/register?role=customer"
                      className="text-primary-green underline font-medium"
                    >
                      here.
                    </Link>
                  </p>
                  <p className="text-sm leading-6.5">
                    Otherwise, check your email for order details and updates.
                    If you need to communicate with a seller about your order,
                    feel free to respond to that email.
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 mt-4 mb-4" />

            <p className="text-secondary-black">
              Thank you for choosing to shop local.
              <br />
              <span className="text-primary-green font-medium italic">
                Together we rise, together we thrive! ♥
              </span>
            </p>
          </div>

          {/* Right - order summary */}
          <div className="lg:col-span-5">
            <div className="flex gap-2 mb-4">
              <button
                disabled={!user}
                className={`flex-1 text-center px-4 py-2.5 rounded-lg border border-gray-300 text-secondary-black text-sm font-medium transition-all duration-300 cursor-pointer enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:pointer-events-none`}
              >
                <Link href={`/dashboard/customer/orders/${order_id}`}>
                  View order
                </Link>
              </button>

              <Link
                href="/shop"
                className="flex-1 text-center px-4 py-2.5 rounded-lg bg-primary-green text-white text-sm font-medium hover:scale-95 transition-all duration-300"
              >
                Continue shopping
              </Link>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-secondary-black mb-1">
                Order summary
              </h3>
              <p className="text-sm text-secondary-gray mb-4">
                {order.order_number} · {order.vendor_count} seller
                {order.vendor_count > 1 ? "s" : ""}
              </p>

              <div className="space-y-4">
                {visibleVendors.map(vendorOrder => {
                  const itemCount = vendorOrder.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );

                  return (
                    <div
                      key={vendorOrder.id}
                      className="flex items-center gap-3"
                    >
                      {vendorOrder.shop?.image ? (
                        <figure className="size-11 rounded-lg border border-gray-100 relative shrink-0 bg-gray-100 overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${vendorOrder.shop.image}`}
                            alt={vendorOrder.shop.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </figure>
                      ) : (
                        <div className="size-11 rounded-full bg-primary-green/10 flex items-center justify-center font-semibold text-[13px] text-primary-green shrink-0">
                          {getInitials(vendorOrder.shop?.name)}
                        </div>
                      )}

                      <div className="grow min-w-0">
                        <p className="text-sm font-semibold text-secondary-black truncate">
                          {vendorOrder.shop?.name}
                        </p>
                        <p className="text-xs text-primary-green">
                          {fulfillmentDisplay(vendorOrder.fulfillment_type)}
                        </p>
                      </div>

                      <p className="text-xs text-secondary-gray shrink-0">
                        {itemCount} item{itemCount > 1 ? "s" : ""}
                      </p>

                      <p className="text-sm font-semibold text-secondary-black shrink-0 w-16 text-right">
                        ${vendorOrder.total_amount.toFixed(2)}
                      </p>
                    </div>
                  );
                })}

                {extraVendorCount > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-[13px] text-secondary-gray shrink-0">
                      +{extraVendorCount}
                    </div>
                    <div className="grow min-w-0">
                      <p className="text-sm font-semibold text-secondary-black">
                        +{extraVendorCount} more seller
                        {extraVendorCount > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-primary-green">
                        {fulfillmentDisplay(
                          vendorOrders[3]?.fulfillment_type ?? "",
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-secondary-gray shrink-0">
                      {extraVendorItemCount} item
                      {extraVendorItemCount > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm font-semibold text-secondary-black shrink-0 w-16 text-right">
                      ${extraVendorTotal.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-secondary-black">
                  <span>Subtotal</span>
                  <span>${order.sub_total.toFixed(2)}</span>
                </div>

                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-black">Discounts</span>
                    <span className="text-primary-green">
                      - ${order.discount_amount.toFixed(2)}
                    </span>
                  </div>
                )}

                {(order.shipping_amount > 0 || order.delivery_amount > 0) && (
                  <div className="flex justify-between text-sm text-secondary-black">
                    <span>Shipping &amp; Local Delivery Fees</span>
                    <span>
                      $
                      {(order.shipping_amount + order.delivery_amount).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-secondary-black">
                  <span>Sales Tax</span>
                  <span>${order.tax_amount.toFixed(2)}</span>
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="flex justify-between items-center">
                <span className="text-secondary-black font-semibold">
                  Order total
                </span>
                <span className="text-xl font-bold text-primary-green">
                  ${order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
