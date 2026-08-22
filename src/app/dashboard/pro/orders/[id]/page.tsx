"use client";
import { useParams, useRouter } from "next/navigation";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { GoBackSvg, Pen } from "@/Components/Svg/SvgContainer";
import OrderNote from "@/Components/Modals/OrderNote";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import OrderSummary from "@/Components/Prodashboardcomponents/OrderSummary";
import Modal from "@/Components/Common/Modal";
import TrackPackageModal from "@/Components/Modals/TrackPackageModal";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useCancelOrderMutation,
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/api/ordersApi";
import ConversationPage from "@/Components/PageComponents/dashboardPages/messageComponents/ConversationPage";
import OrderedProducts from "@/Components/Prodashboardcomponents/OrderedProducts";

type FulfillmentType = "shipping" | "delivery" | "pickup";

const FULFILLMENT_STEPS: Record<
  FulfillmentType,
  { label: string; key: string }[]
> = {
  shipping: [
    { label: "Order Confirmed", key: "confirmed" },
    { label: "Order Processing", key: "processing" },
    { label: "Order Shipped", key: "shipped" },
    { label: "Order Delivered", key: "delivered" },
  ],
  delivery: [
    { label: "Order Confirmed", key: "confirmed" },
    { label: "Order Processing", key: "processing" },
    { label: "Out for Delivery", key: "out_for_delivery" },
    { label: "Order Delivered", key: "delivered" },
  ],
  pickup: [
    { label: "Order Confirmed", key: "confirmed" },
    { label: "Order Processing", key: "processing" },
    { label: "Ready for Pickup", key: "ready_for_pickup" },
    { label: "Picked Up", key: "picked_up" },
  ],
};

const DROPDOWN_STATUSES: Record<FulfillmentType, string[]> = {
  shipping: ["confirmed", "processing", "shipped", "delivered", "cancelled"],
  delivery: [
    "confirmed",
    "processing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ],
  pickup: [
    "confirmed",
    "processing",
    "ready_for_pickup",
    "picked_up",
    "cancelled",
  ],
};

const TERMINAL_STATUSES = new Set(["delivered", "picked_up", "cancelled"]);

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Order Confirmed",
  processing: "Order Processing",
  shipped: "Order Shipped",
  delivered: "Order Delivered",
  out_for_delivery: "Out for Delivery",
  ready_for_pickup: "Ready for Pickup",
  picked_up: "Picked Up",
  cancelled: "Order Cancelled",
};

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const order_id = Number(params.id);
  const [note, setNote] = useState<string>("");
  const [openItems, setOpenItems] = useState<Set<number>>(
    () => new Set([0, 1, 2]),
  );

  const toggleAccordion = (idx: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };
  const [openStatusPopover, setOpenStatusPopover] = useState(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<Array<string>>([]);
  const [updateStatusMutation] = useUpdateOrderStatusMutation();
  const { data: singleOrder, isLoading } = useGetSingleOrderQuery(order_id);
  const [cancelOrder, { isLoading: isCancellingOrder }] =
    useCancelOrderMutation();
  const [trackingHistory, setTrackingHistory] = useState<
    | {
        id: number;
        content: string;
        created_at: string;
      }[]
    | null
  >(null);
  const currentStatus: string | undefined = singleOrder?.data?.status;
  const isCancelled = currentStatus === "cancelled";

  const fulfillmentType: FulfillmentType =
    (singleOrder?.data?.fulfillment_type as FulfillmentType) ?? "shipping";

  const steps = FULFILLMENT_STEPS[fulfillmentType];
  const stepKeys = steps.map(s => s.key);
  const dropdownStatuses = DROPDOWN_STATUSES[fulfillmentType];
  const currentStepIndex = currentStatus ? stepKeys.indexOf(currentStatus) : -1;

  const enabledStatuses = useMemo(() => {
    if (!currentStatus || TERMINAL_STATUSES.has(currentStatus)) {
      return new Set<string>();
    }
    const enabled = new Set<string>(["cancelled"]);
    const nextStep =
      currentStepIndex === -1 ? steps[0] : steps[currentStepIndex + 1];

    if (nextStep) enabled.add(nextStep.key);

    return enabled;
  }, [currentStatus, currentStepIndex, steps]);

  useLayoutEffect(() => {
    const measure = () => {
      const newHeights = contentRefs.current.map((ref, idx) => {
        if (!ref) return "0px";
        return openItems.has(idx) ? `${ref.scrollHeight}px` : "0px";
      });

      setHeights(newHeights);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [openItems]);

  const deliveryAddress = singleOrder?.data?.delivery?.delivery_address;
  const pickup = singleOrder?.data?.pickup;

  const getFulfillmentAccordionItem = () => {
    if (fulfillmentType === "delivery") {
      return {
        title: "Delivery Address",
        content: (
          <div className="text-sm text-secondary-gray pb-3">
            <p>{deliveryAddress?.street_address}</p>
            {deliveryAddress?.apt && <p>{deliveryAddress.apt}</p>}
            <p>
              {deliveryAddress?.city}
              {deliveryAddress?.state ? `, ${deliveryAddress.state}` : ""}
              {deliveryAddress?.postal_code
                ? ` ${deliveryAddress.postal_code}`
                : ""}
            </p>
            <p>{deliveryAddress?.country}</p>
          </div>
        ),
      };
    }

    if (fulfillmentType === "pickup") {
      return {
        title: "Pickup Location",
        content: (
          <div className="text-sm text-secondary-gray pb-3">
            {pickup?.pickup_name && (
              <p className="font-medium text-secondary-black">
                {pickup.pickup_name}
              </p>
            )}
            <p>{pickup?.address}</p>
            {pickup?.unit && <p>{pickup.unit}</p>}
            <p>
              {pickup?.city}
              {pickup?.state ? `, ${pickup.state}` : ""}
              {pickup?.zip_code ? ` ${pickup.zip_code}` : ""}
            </p>
            <p>{pickup?.country}</p>
          </div>
        ),
      };
    }

    return {
      title: "Shipping Address",
      content: (
        <div className="text-sm text-secondary-gray pb-3">
          <p>{singleOrder?.data?.shipping_address?.street_address}</p>
          {singleOrder?.data?.shipping_address?.apt && (
            <p>{singleOrder?.data?.shipping_address.apt}</p>
          )}
          <p>
            {singleOrder?.data?.shipping_address?.city}
            {singleOrder?.data?.shipping_address?.state
              ? `, ${singleOrder?.data?.shipping_address.state}`
              : ""}
            {singleOrder?.data?.shipping_address?.postal_code
              ? ` ${singleOrder?.data?.shipping_address.postal_code}`
              : ""}
          </p>
          <p>{singleOrder?.data?.shipping_address?.country}</p>
        </div>
      ),
    };
  };

  const accordionData = [
    {
      title: "Customer Details",
      content: (
        <div className="text-secondary-gray text-[14px] pb-2">
          <p>
            <strong>Name:</strong> {singleOrder?.data?.customer?.first_name}{" "}
            {singleOrder?.data?.customer?.last_name}
          </p>
          <p>
            <strong>Email:</strong> {singleOrder?.data?.customer?.email}
          </p>
          <p>
            <strong>Phone:</strong> {singleOrder?.data?.customer?.phone}
          </p>
        </div>
      ),
    },
    getFulfillmentAccordionItem(),
    {
      title: "Add Note",
      content: <></>,
      isModal: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <PuffLoader color="#274f45" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Side */}
        <div className="w-full lg:w-[65%] 2xl:w-[75%]">
          <button
            onClick={() => router.back()}
            className="flex gap-1 items-center cursor-pointer font-semibold text-primary-green mb-2 group"
          >
            <span className="group-hover:-translate-x-1 duration-300 transition-transform">
              <GoBackSvg />
            </span>
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <h3 className="text-3xl font-semibold text-secondary-black">
              Order Details
            </h3>

            <div className="flex gap-3 items-center">
              <button
                className="py-3 px-4 rounded-[8px] border border-light-green text-[16px] font-semibold text-secondary-black cursor-pointer hover:border-primary-green duration-300 ease-in-out"
                onClick={() =>
                  setTrackingHistory(singleOrder?.data?.order_status_history)
                }
              >
                Track Package
              </button>
            </div>
          </div>

          {/* Order Status Dropdown */}
          <div className="my-4">
            <h4 className="text-secondary-black font-bold text-[16px] mb-3">
              Order Status
            </h4>

            <div className="relative inline-block">
              {/* Trigger */}
              <button
                onClick={() => setOpenStatusPopover(prev => !prev)}
                className="min-w-[240px] flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-2 hover:border-primary-green transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-3 rounded-full ${
                      isCancelled ? "bg-primary-red" : "bg-primary-green"
                    }`}
                  />

                  <div className="text-left">
                    <p className="text-[12px] text-gray-500">Current Status</p>

                    <h5
                      className={`text-[15px] font-semibold capitalize ${
                        isCancelled ? "text-primary-red" : "text-primary-green"
                      }`}
                    >
                      {currentStatus
                        ? (STATUS_LABELS[currentStatus] ?? currentStatus)
                        : "Unknown"}
                    </h5>
                  </div>
                </div>

                <FaAngleDown
                  className={`transition-transform duration-300 ${
                    openStatusPopover ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute left-0 top-[110%] z-50 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-300 ${
                  openStatusPopover
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                }`}
              >
                <div className="p-2">
                  {dropdownStatuses.map(statusKey => {
                    const isCancelledOption = statusKey === "cancelled";
                    const isCurrent = statusKey === currentStatus;
                    const isEnabled =
                      !isCurrent && enabledStatuses.has(statusKey);

                    return (
                      <button
                        key={statusKey}
                        disabled={!isEnabled}
                        onClick={() => {
                          if (!isEnabled) return;

                          updateStatusMutation({
                            id: order_id,
                            data: { status: statusKey },
                          })
                            .unwrap()
                            .then(res => {
                              toast.success(res.message);
                            })
                            .catch(err => {
                              toast.error(
                                err?.data?.message ??
                                  "Couldn't update order status",
                              );
                            });

                          setOpenStatusPopover(false);
                        }}
                        className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                          isEnabled
                            ? `cursor-pointer ${
                                isCancelledOption
                                  ? "hover:bg-primary-red/5"
                                  : "hover:bg-primary-green/5"
                              }`
                            : "cursor-not-allowed opacity-70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-2 rounded-full ${
                              isCurrent
                                ? isCancelledOption
                                  ? "bg-primary-red"
                                  : "bg-primary-green"
                                : isCancelledOption
                                  ? "bg-primary-red/40"
                                  : "bg-gray-600"
                            }`}
                          />

                          <span
                            className={`text-[14px] font-medium ${
                              isCancelledOption
                                ? isEnabled
                                  ? "text-primary-red group-hover:text-primary-red"
                                  : "text-primary-red"
                                : isEnabled
                                  ? "text-[#222] group-hover:text-primary-green"
                                  : "text-[#222]"
                            }`}
                          >
                            {STATUS_LABELS[statusKey] ?? statusKey}
                          </span>
                        </div>

                        {isCurrent && (
                          <FaCheck
                            className={
                              isCancelledOption
                                ? "text-primary-red"
                                : "text-primary-green"
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar - steps and their count match fulfillment type */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] items-start mt-6">
            {steps.map((step, index) => {
              const isCompleted = !isCancelled && index <= currentStepIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center relative"
                >
                  {/* Connector */}
                  {index !== 0 && (
                    <div
                      className={`absolute top-3 -left-1/2 w-full border-t border-dashed ${
                        isCompleted
                          ? "border-primary-green"
                          : "border-accent-gray"
                      }`}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`z-10 size-6 rounded-full border-2 flex items-center justify-center ${
                      isCompleted
                        ? "border-primary-green"
                        : "border-accent-gray"
                    }`}
                  >
                    <div
                      className={`size-4 rounded-full ${
                        isCompleted ? "bg-primary-green" : "bg-accent-gray"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <h5
                    className={`mt-3 text-center text-[14px] font-medium ${
                      isCompleted ? "text-secondary-black" : "text-accent-gray"
                    }`}
                  >
                    {step.label}
                  </h5>
                </div>
              );
            })}

            {/* Cancelled - shown as its own trailing step only when relevant */}
            {isCancelled && (
              <div className="flex flex-col items-center relative">
                <div className="absolute top-3 -left-1/2 w-full border-t border-dashed border-primary-red" />
                <div className="z-10 size-6 rounded-full border-2 border-primary-red flex items-center justify-center">
                  <div className="size-4 rounded-full bg-primary-red" />
                </div>
                <h5 className="mt-3 text-center text-[14px] font-medium text-primary-red">
                  Order Cancelled
                </h5>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="mt-6">
            <OrderedProducts data={singleOrder?.data} order_id={order_id} />
          </div>

          {/* Order Summary */}
          <div className="hidden lg:block mt-10">
            <OrderSummary data={singleOrder?.data} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[35%] 2xl:w-[25%] space-y-4">
          {accordionData?.map((item, idx) => (
            <div
              key={item.title}
              className="border border-[#E1E2E2] rounded-lg overflow-hidden"
            >
              <div
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() => {
                  if (item.isModal && item.title === "Add Note")
                    setNoteModalOpen(true);
                  else toggleAccordion(idx);
                }}
              >
                <h4 className="text-secondary-black font-semibold">
                  {item.title}
                </h4>

                {item.isModal ? (
                  <Pen className="text-secondary-black" />
                ) : (
                  <FaAngleDown
                    className={`transition-transform duration-300 ${
                      openItems.has(idx) ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </div>

              {!item.isModal && (
                <div
                  ref={(el: HTMLDivElement | null): void => {
                    contentRefs.current[idx] = el;
                  }}
                  style={{ maxHeight: heights[idx] ?? "0px" }}
                  className="overflow-hidden transition-all duration-500 ease-in-out px-3"
                >
                  {item?.content}
                </div>
              )}
            </div>
          ))}

          {/* Chat */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="px-4 pt-4 pb-2 border-b border-gray-200">
              <h2 className="text-[16px] font-semibold text-secondary-black">
                Chat with Buyer
              </h2>
            </div>
            
            <div className="h-[480px] flex flex-col p-3">
              <ConversationPage
                receiverId={singleOrder?.data?.vendor_id}
                conversationId={singleOrder?.data?.conversation?.id}
                compact={true}
              />
            </div>
          </div>

          <Link
            className="primary_btn"
            href={`/dashboard/pro/messages/inbox?receiver_id=${
              singleOrder?.data?.vendor_id
            }&conversation_id=${singleOrder?.data?.conversation?.id}`}
          >
            Go to Messages Board
          </Link>

          <button
            disabled={!singleOrder?.data?.noted}
            onClick={() => {
              setNote(singleOrder?.data?.noted);
              setShowNote(true);
            }}
            className={`font-semibold border border-[#E1E2E2] rounded-lg overflow-hidden w-full p-3 ${
              singleOrder?.data?.noted
                ? "cursor-pointer hover:bg-accent-red hover:text-white duration-300 transition-all"
                : "opacity-70 bg-gray-200 cursor-not-allowed"
            }`}
          >
            View Note
          </button>

          <button
            disabled={isCancellingOrder || isCancelled}
            onClick={() => {
              cancelOrder(order_id)
                .unwrap()
                .then(res => {
                  toast.success(res.message);
                })
                .catch(err => {
                  toast.error(err?.data?.message ?? "Couldn't cancel order");
                });
            }}
            className="py-4 px-6 rounded-[8px] border border-primary-red bg-[#FFE8E8] font-semibold text-primary-red cursor-pointer hover:border-primary-green duration-300 ease-in-out w-full disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isCancellingOrder ? "Cancelling...." : "Cancel Order"}
          </button>
        </div>
      </div>

      <div className="block lg:hidden mt-10">
        <OrderSummary data={singleOrder?.data} />
      </div>

      <Modal open={noteModalOpen} onClose={() => setNoteModalOpen(false)}>
        <OrderNote
          order_id={order_id}
          onClose={() => setNoteModalOpen(false)}
        />
      </Modal>
      <Modal
        open={trackingHistory !== null}
        onClose={() => setTrackingHistory(null)}
      >
        <TrackPackageModal history={trackingHistory ?? []} />
      </Modal>
      <Modal open={showNote} onClose={() => setShowNote(false)}>
        <h3 className="text-xl font-semibold text-primary-green mb-2">
          Order Note
        </h3>

        <p className="leading-[164%] text-gray-700">"{note}"</p>
      </Modal>
    </>
  );
};

export default Page;
