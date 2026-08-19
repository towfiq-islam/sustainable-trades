"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GoBackSvg } from "@/Components/Svg/SvgContainer";
import moment from "moment";
import { PuffLoader } from "react-spinners";
import Modal from "@/Components/Common/Modal";
import TrackPackageModal from "@/Components/Modals/TrackPackageModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiFileText, FiHeart, FiShield } from "react-icons/fi";
import ConversationPage from "@/Components/PageComponents/dashboardPages/messageComponents/ConversationPage";
import {
  useDownloadCustomerInvoiceMutation,
  useGetOrderDetailsQuery,
} from "@/redux/api/ordersApi";

const fulfillmentLabel = (type: string) =>
  type === "delivery"
    ? "Local Delivery"
    : type === "pickup"
      ? "Local Pickup"
      : "Shipping";

const SingleOrder = ({ orderId }: { orderId: number }) => {
  const router = useRouter();
  const [trackingHistory, setTrackingHistory] = useState<
    | {
        id: number;
        content: string;
        created_at: string;
      }[]
    | null
  >(null);
  const { data: getSingleOrder, isLoading } = useGetOrderDetailsQuery(orderId);
  const [downloadInvoicePdf, { isLoading: isPending }] =
    useDownloadCustomerInvoiceMutation();
  const order = getSingleOrder?.data;

  const handleDownloadInvoice = () => {
    downloadInvoicePdf(orderId)
      .unwrap()
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `invoice-${order?.order_number ?? orderId}.pdf`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast.error("Couldn't download invoice"));
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <PuffLoader color="#274f45" />
      </div>
    );
  }

  return (
    <>
      {/* Back Btn */}
      <button
        onClick={() => router.back()}
        className="flex gap-1 items-center cursor-pointer font-semibold text-primary-green mb-2 group"
      >
        <span className="group-hover:-translate-x-1 duration-300 transition-transform">
          <GoBackSvg />
        </span>
        <span>Back</span>
      </button>

      <h2 className="text-3xl font-lato font-semibold text-secondary-black mb-5">
        Order Details
      </h2>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* ============ LEFT: main column ============ */}
        <div className="w-full lg:w-[68%] 2xl:w-[75%]">
          {/* Meta bar */}
          <div className="border border-[#E1E2E2] rounded-[10px] px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <h3 className="text-[#67645F] text-[15px] font-semibold mb-1">
                Order Placed
              </h3>
              <p className="font-sans text-secondary-black text-sm">
                {moment(order?.created_at).format("MMMM D, YYYY")}
              </p>
            </div>

            <div>
              <h3 className="text-[#67645F] text-[15px] font-semibold mb-1">
                Order Number
              </h3>
              <p className="font-sans text-secondary-black text-sm">
                {order?.order_number}
              </p>
            </div>

            <div>
              <h3 className="text-[#67645F] text-[15px] font-semibold mb-1.5">
                Payment Status
              </h3>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize bg-primary-green/10 text-primary-green">
                {order?.payment_status}
              </span>
            </div>

            <div>
              <h3 className="text-[#67645F] text-[15px] font-semibold mb-1">
                View Invoice
              </h3>

              <button
                disabled={isPending}
                onClick={handleDownloadInvoice}
                className="flex items-center gap-1 text-primary-green font-bold text-[13px] cursor-pointer disabled:opacity-60"
              >
                <FiFileText size={14} />
                {isPending ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>{" "}
                    Downloading
                  </>
                ) : (
                  "Download Invoice"
                )}
              </button>
            </div>
          </div>

          {/* Multi-vendor banner */}
          {order?.vendor_count > 1 && (
            <div className="flex items-start gap-3 bg-off-green/40 border border-primary-green/20 rounded-[10px] px-4 py-3 mb-5">
              <FiShield
                className="text-primary-green mt-0.5 shrink-0"
                size={18}
              />
              <p className="text-sm text-secondary-black font-sans leading-6">
                This is a multi-vendor order from {order.vendor_count} shops.
                <br />
                You&apos;ll find details for each vendor and delivery method
                below.
              </p>
            </div>
          )}

          {/* Per-vendor blocks */}
          <div className="flex flex-col gap-5">
            {order?.vendor_orders?.map((vendorOrder: any) => {
              const shopName = vendorOrder?.shop?.name;

              const address =
                vendorOrder.fulfillment_type === "pickup"
                  ? vendorOrder.pickup
                  : vendorOrder.fulfillment_type === "delivery"
                    ? vendorOrder.delivery?.delivery_address
                    : vendorOrder.shipping_address;

              return (
                <div
                  key={vendorOrder.id}
                  className="border border-[#E1E2E2] rounded-[10px] overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 px-5 py-3 bg-[#FAFAF9] border-b border-[#E1E2E2]">
                    <figure className="size-9 rounded-full relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${vendorOrder?.shop?.image}`}
                        alt="shop_image"
                        fill
                        className="size-full object-cover rounded-full shrink-0"
                      />
                    </figure>

                    <h4 className="font-sans font-semibold text-secondary-black text-[15px]">
                      Sold by {shopName}
                    </h4>
                    <span className="text-gray-400">•</span>
                    <p className="text-sm font-sans text-[#67645F]">
                      Delivery Method:{" "}
                      {fulfillmentLabel(vendorOrder.fulfillment_type)}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-5 gap-12 p-5">
                    {/* Left: items + totals + address */}
                    <div className="col-span-3">
                      <h5 className="font-sans font-semibold text-secondary-black text-sm mb-3">
                        Items
                      </h5>

                      <div className="space-y-4 mb-4">
                        {vendorOrder?.items?.map((item: any) => (
                          <div key={item.id} className="flex gap-x-3">
                            <figure className="rounded size-16 shrink-0">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.product_image}`}
                                alt={item?.product_name}
                                height={64}
                                width={64}
                                unoptimized
                                className="rounded size-full object-cover"
                              />
                            </figure>

                            <div className="flex flex-col gap-0.5 flex-1">
                              <h5 className="text-[15px] font-semibold text-secondary-black font-sans">
                                {item?.product_name}
                              </h5>
                              <p className="text-[#67645F] text-sm font-sans">
                                Qty: {item?.quantity}
                              </p>
                            </div>

                            <p className="font-sans font-semibold text-secondary-black text-sm shrink-0">
                              ${item?.total_price}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="text-sm font-sans space-y-1.5 border-t border-[#EDEDED] pt-3">
                        <div className="flex justify-between text-[#67645F]">
                          <span>Items Subtotal</span>
                          <span>${vendorOrder.sub_total}</span>
                        </div>

                        {vendorOrder.fulfillment_type === "shipping" && (
                          <div className="flex justify-between text-[#67645F]">
                            <span>Shipping</span>
                            <span>${vendorOrder.shipping_amount}</span>
                          </div>
                        )}

                        {vendorOrder.fulfillment_type === "delivery" && (
                          <div className="flex justify-between text-[#67645F]">
                            <span>Local Delivery</span>
                            <span>${vendorOrder.delivery_amount}</span>
                          </div>
                        )}

                        {vendorOrder.fulfillment_type === "pickup" && (
                          <div className="flex justify-between text-[#67645F]">
                            <span>Local Pickup</span>
                            <span>$0.00</span>
                          </div>
                        )}

                        <div className="flex justify-between text-[#67645F]">
                          <span>Est. Sales Tax</span>
                          <span>${vendorOrder.tax_amount}</span>
                        </div>

                        <div className="flex justify-between font-bold text-primary-green pt-1">
                          <span>Vendor Total</span>
                          <span>${vendorOrder.total_amount}</span>
                        </div>
                      </div>

                      {address && (
                        <div className="mt-4 pt-4 border-t border-[#EDEDED] text-sm font-sans">
                          <h5 className="font-semibold text-secondary-black mb-1">
                            {vendorOrder.fulfillment_type === "pickup"
                              ? "Pickup Location"
                              : vendorOrder.fulfillment_type === "delivery"
                                ? "Delivery Address"
                                : "Shipping Address"}
                          </h5>
                          <div className="text-[#67645F]">
                            {address?.pickup_name && (
                              <p className="text-secondary-black font-medium">
                                {address.pickup_name}
                              </p>
                            )}
                            <p>{address?.street_address ?? address?.address}</p>
                            {(address?.apt || address?.unit) && (
                              <p>{address.apt ?? address.unit}</p>
                            )}
                            <p>
                              {address?.city}, {address?.state}{" "}
                              {address?.postal_code ?? address?.zip_code}
                            </p>
                            <p>{address?.country}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: chat + actions */}
                    <div className="col-span-2">
                      <div className="rounded-[10px] h-[450px] flex flex-col overflow-hidden mb-3 border border-gray-300 p-3">
                        <ConversationPage
                          receiverId={vendorOrder?.vendor_id}
                          conversationId={vendorOrder?.conversation?.id}
                          compact={true}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            setTrackingHistory(vendorOrder.order_status_history)
                          }
                          className="p-2.5 rounded-[8px] border border-[#BFBEBE] text-sm font-semibold text-secondary-black hover:border-primary-green duration-300 ease-in-out cursor-pointer"
                        >
                          {vendorOrder.fulfillment_type === "pickup"
                            ? "View Pickup Details"
                            : vendorOrder.fulfillment_type === "delivery"
                              ? "View Delivery Details"
                              : "Track Package"}
                        </button>

                        <Link
                          href={`/dashboard/customer/messages/inbox?receiver_id=${
                            vendorOrder?.vendor_id
                          }&conversation_id=${vendorOrder?.conversation?.id}`}
                          className="p-2.5 rounded-[8px] bg-primary-green text-white text-sm font-semibold text-center hover:bg-primary-green/90 duration-300 ease-in-out"
                        >
                          Go to Message Board
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ RIGHT: sticky sidebar ============ */}
        <div className="w-full lg:w-[32%] 2xl:w-[25%]">
          <div className="sticky top-6 flex flex-col gap-4">
            <div className="border border-[#E1E2E2] rounded-[10px] p-5">
              <h4 className="font-sans font-bold text-secondary-black mb-4">
                Order Summary ({order?.item_count} items)
              </h4>

              <div className="space-y-3 mb-4">
                {order?.vendor_orders?.map((vendorOrder: any) => {
                  const shopName =
                    vendorOrder?.shop?.shop_name ?? vendorOrder?.shop?.name;

                  return (
                    <div
                      key={vendorOrder.id}
                      className="flex items-center gap-3"
                    >
                      <figure className="size-9 rounded-full relative">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SITE_URL}/${vendorOrder?.shop?.image}`}
                          alt="shop_image"
                          fill
                          className="size-full object-cover rounded-full shrink-0"
                        />
                      </figure>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary-black font-sans truncate">
                          {shopName} ({vendorOrder.items?.length ?? 0}{" "}
                          {vendorOrder.items?.length === 1 ? "item" : "items"})
                        </p>
                        <p className="text-xs text-[#67645F] font-sans">
                          {fulfillmentLabel(vendorOrder.fulfillment_type)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-secondary-black shrink-0">
                        ${vendorOrder.total_amount}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="text-sm font-sans space-y-1.5 border-t border-[#EDEDED] pt-3">
                <div className="flex justify-between text-[#67645F]">
                  <span>Subtotal</span>
                  <span>${order?.sub_total}</span>
                </div>
                <div className="flex justify-between text-[#67645F]">
                  <span>Est. Sales Tax</span>
                  <span>${order?.tax_amount}</span>
                </div>
                <div className="flex justify-between text-[#67645F]">
                  <span>Shipping</span>
                  <span>${order?.shipping_amount}</span>
                </div>
                <div className="flex justify-between text-[#67645F]">
                  <span>Local Delivery Fee</span>
                  <span>${order?.delivery_amount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#EDEDED] mt-3 pt-3">
                <span className="font-bold font-sans text-secondary-black">
                  Total
                </span>
                <span className="font-bold text-primary-green text-lg font-sans">
                  ${order?.total_amount}
                </span>
              </div>
            </div>

            <div className="border border-[#E1E2E2] rounded-[10px] p-5">
              <h4 className="font-sans font-bold text-secondary-black mb-2">
                Need Help?
              </h4>
              <p className="text-sm text-[#67645F] font-sans">
                If you need help with one of your items in your order, reach out
                to the vendor via the chat box.
              </p>
            </div>

            <div className="border border-[#E1E2E2] rounded-[10px] p-5">
              <p className="text-[15px] font-semibold text-secondary-black font-sans">
                Thank you for shopping local!
              </p>

              <div className="flex gap-3 items-center pt-1.5 text-sm text-gray-600">
                <p>Together we rise, together we thrive.</p>
                <FiHeart className="text-primary-green shrink-0" size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={trackingHistory !== null}
        onClose={() => setTrackingHistory(null)}
      >
        <TrackPackageModal history={trackingHistory ?? []} />
      </Modal>
    </>
  );
};

export default SingleOrder;
