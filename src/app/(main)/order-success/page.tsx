"use client";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoCheckmarkCircle, IoLocationOutline } from "react-icons/io5";
import Container from "@/Components/Common/Container";
import { useGetOrderDetailsQuery } from "@/redux/api/ordersApi";
import { fulfillmentLabel } from "@/lib/fulfillment";
import { OrderSuccessSkeleton } from "@/Components/Loader/Loader";

type VendorItem = {
  id: number;
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
    name: string;
    image: string;
  };
  shipping_address: {
    apt: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
  };
  delivery: {
    delivery_address: {
      apt: string;
      street_address: string;
      postal_code: string;
      state: string;
      city: string;
    };
  };
  pickup: {
    address: string;
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

const STATUS_STEPS = [
  { key: "pending", label: "Purchase" },
  { key: "confirmed", label: "Processed" },
  { key: "completed", label: "Ready" },
] as const;

const StatusTrail = ({ status }: { status: string }) => {
  const currentIndex = STATUS_STEPS.findIndex(s => s.key === status);
  const idx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {STATUS_STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-1.5">
          <span
            className={`text-[11px] ${
              i <= idx ? "text-secondary-gray font-medium" : "text-gray-400"
            }`}
          >
            {step.label}
          </span>
          {i < STATUS_STEPS.length - 1 && (
            <div
              className={`w-5 h-0.5 rounded-full ${
                i < idx ? "bg-primary-green" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function Page({ searchParams }: Props) {
  const { order_id } = use(searchParams);
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

  return (
    <section className="py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
            <div className="flex items-center gap-2.5">
              <IoCheckmarkCircle className="text-primary-green text-2xl shrink-0" />
              <div>
                <h1 className="text-xl font-semibold text-secondary-black">
                  Thank you for your purchase
                </h1>
                <p className="text-sm text-secondary-gray mt-0.5">
                  Order {order.order_number} · {order.vendor_count} seller
                  {order.vendor_count > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="px-4 py-2.5 rounded-lg bg-primary-green text-white text-sm font-medium hover:scale-95 transition-all duration-300 shrink-0"
            >
              Continue shopping
            </Link>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-[13px] text-secondary-gray leading-relaxed">
              Your order has been placed and payment confirmed. Each seller will
              fulfill their part separately — check back here for status updates
              on every shipment.
            </p>
          </div>

          {/* Vendor cards */}
          <div className="space-y-3.5 mb-6">
            {order.vendor_orders.map((vendorOrder: VendorItem) => {
              const fulfillment = vendorOrder.fulfillment_type as
                | "pickup"
                | "delivery"
                | "shipping";

              return (
                <div
                  key={vendorOrder.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
                >
                  <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      {vendorOrder.shop?.image ? (
                        <figure className="size-9 rounded-full border border-gray-100 relative shrink-0 bg-gray-100 overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${vendorOrder.shop.image}`}
                            alt={vendorOrder.shop.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </figure>
                      ) : (
                        <div className="size-9 rounded-full bg-primary-green/10 flex items-center justify-center font-semibold text-[13px] text-primary-green shrink-0">
                          {getInitials(vendorOrder.shop?.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[14px] text-secondary-black">
                          {vendorOrder.shop?.name}
                        </p>
                        <p className="text-xs text-secondary-gray">
                          {fulfillmentLabel[fulfillment] ?? fulfillment}
                        </p>
                      </div>
                    </div>

                    {/* <StatusTrail status={vendorOrder.status} /> */}
                  </div>

                  {/* Delivery / pickup detail */}
                  {fulfillment === "delivery" &&
                    vendorOrder.delivery?.delivery_address && (
                      <p className="flex items-start gap-1.5 text-[13px] text-secondary-gray mb-3">
                        <IoLocationOutline className="text-primary-green shrink-0 mt-0.5" />
                        <span>
                          {vendorOrder.delivery.delivery_address.street_address}
                          {vendorOrder.delivery.delivery_address.apt
                            ? `, ${vendorOrder.delivery.delivery_address.apt}`
                            : ""}
                          , {vendorOrder.delivery.delivery_address.city},{" "}
                          {vendorOrder.delivery.delivery_address.state}{" "}
                          {vendorOrder.delivery.delivery_address.postal_code}
                        </span>
                      </p>
                    )}

                  {fulfillment === "shipping" &&
                    vendorOrder.shipping_address && (
                      <p className="flex items-start gap-1.5 text-[13px] text-secondary-gray mb-3">
                        <IoLocationOutline className="text-primary-green shrink-0 mt-0.5" />
                        <span>
                          {vendorOrder.shipping_address.street_address}
                          {vendorOrder.shipping_address.apt
                            ? `, ${vendorOrder.shipping_address.apt}`
                            : ""}
                          , {vendorOrder.shipping_address.city},{" "}
                          {vendorOrder.shipping_address.state}{" "}
                          {vendorOrder.shipping_address.postal_code}
                        </span>
                      </p>
                    )}

                  {fulfillment === "pickup" && vendorOrder.pickup?.address && (
                    <p className="flex items-start gap-1.5 text-[13px] text-secondary-gray mb-3">
                      <IoLocationOutline className="text-primary-green shrink-0 mt-0.5" />
                      <span>{vendorOrder.pickup.address}</span>
                    </p>
                  )}

                  {/* Line items */}
                  <div className="space-y-1 mb-3">
                    {vendorOrder.items.map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between text-[13px] text-secondary-black"
                      >
                        <span>
                          {item.product_name} x{item.quantity}
                        </span>
                        <span>${item.total_price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Vendor pricing breakdown */}
                  <div className="space-y-1 pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-secondary-gray">
                      <span>Subtotal</span>
                      <span>${vendorOrder.sub_total.toFixed(2)}</span>
                    </div>
                    {vendorOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-xs text-primary-green">
                        <span>Discount</span>
                        <span>-${vendorOrder.discount_amount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-secondary-gray">
                      <span>Tax</span>
                      <span>${vendorOrder.tax_amount.toFixed(2)}</span>
                    </div>
                    {vendorOrder.shipping_amount > 0 && (
                      <div className="flex justify-between text-xs text-secondary-gray">
                        <span>Shipping</span>
                        <span>${vendorOrder.shipping_amount.toFixed(2)}</span>
                      </div>
                    )}
                    {vendorOrder.delivery_amount > 0 && (
                      <div className="flex justify-between text-xs text-secondary-gray">
                        <span>Delivery</span>
                        <span>${vendorOrder.delivery_amount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-2.5 mt-2">
                    <span className="text-[13px] font-medium text-secondary-gray">
                      Order total
                    </span>
                    <span className="font-semibold text-secondary-black">
                      ${vendorOrder.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall totals */}
          <div className="border-t border-gray-200 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm text-secondary-gray">
              <span>Subtotal</span>
              <span>${order.sub_total.toFixed(2)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-primary-green">
                <span>Discount</span>
                <span>-${order.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-secondary-gray">
              <span>Tax</span>
              <span>${order.tax_amount.toFixed(2)}</span>
            </div>
            {order.shipping_amount > 0 && (
              <div className="flex justify-between text-sm text-secondary-gray">
                <span>Shipping</span>
                <span>${order.shipping_amount.toFixed(2)}</span>
              </div>
            )}
            {order.delivery_amount > 0 && (
              <div className="flex justify-between text-sm text-secondary-gray">
                <span>Delivery</span>
                <span>${order.delivery_amount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-primary-green font-semibold">
                Total paid
              </span>
              <span className="text-lg font-semibold text-secondary-black">
                ${order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
