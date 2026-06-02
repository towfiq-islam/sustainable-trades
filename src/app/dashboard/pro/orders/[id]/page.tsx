"use client";
import { useParams, useRouter } from "next/navigation";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { GoBackSvg, Pen } from "@/Components/Svg/SvgContainer";
import OrderNote from "@/Components/Modals/OrderNote";
import { useEffect, useRef, useState } from "react";
import OrderSummary from "@/Components/Prodashboardcomponents/OrderSummary";
import Proorderproduct from "@/Components/Prodashboardcomponents/Proorderproduct";
import {
  getSingleOrder,
  useCancelOrder,
  useUpdateOrderStatus,
} from "@/Hooks/api/dashboard_api";
import Modal from "@/Components/Common/Modal";
import TrackPackageModal from "@/Components/Modals/TrackPackageModal";
import { useForm } from "react-hook-form";
import { useSendMessage } from "@/Hooks/api/chat_api";
import { CgSpinnerTwo } from "react-icons/cg";
import toast from "react-hot-toast";
import Link from "next/link";
import useAuth from "@/Hooks/useAuth";

interface FormValues {
  message: string;
}

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const order_id = Number(params.id);
  const [open, isOpen] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openStatusPopover, setOpenStatusPopover] = useState(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<Array<string>>([]);
  const { mutate: updateStatusMutation } = useUpdateOrderStatus();
  const { mutate: sendMessageMutation, isPending: isSending } =
    useSendMessage();
  const { data: singleOrder, isLoading } = getSingleOrder(order_id);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const orderHistory = singleOrder?.data?.order_status_history ?? [];
  const { mutate: cancelOrder, isPending: isCancellingOrder } =
    useCancelOrder();

  const steps = [
    { label: "Order Confirmed", key: "confirmed" },
    { label: "Order Processing", key: "processing" },
    { label: "Order Shipped", key: "shipped" },
    { label: "Order Delivered", key: "delivered" },
    { label: "Order Cancelled", key: "cancelled" },
  ];

  const normalizeStatus = (content: string) => {
    const text = content.toLowerCase();

    if (text.includes("confirmed")) return "confirmed";
    if (text.includes("processed") || text.includes("processing"))
      return "processing";
    if (text.includes("shipped")) return "shipped";
    if (text.includes("delivered")) return "delivered";
    if (text.includes("cancelled") || text.includes("canceled"))
      return "cancelled";

    return null;
  };

  const enabledSteps = orderHistory
    ?.map((item: any) => normalizeStatus(item.content))
    .filter(Boolean);

  const onSubmit = async (data: FormValues) => {
    const customizedData =
      `This message is sent from ${user?.shop_info?.shop_name} shop.\n` +
      `Shop owner: ${user?.first_name} ${
        user?.last_name && user?.last_name
      }\n` +
      `Order Number: ${singleOrder?.data?.order_number}\n` +
      `Order Details: <a href="${
        user?.role === "customer"
          ? `https://sustainable-trades.vercel.app/dashboard/customer/orders/${order_id}`
          : `https://sustainable-trades.vercel.app/dashboard/pro/orders/${order_id}`
      }"  target="_blank" style="text-decoration: underline">Click here</a>\n` +
      `Message: ${data?.message}`;

    const payload = {
      message: customizedData,
      receiver_id: singleOrder?.data?.user_id,
    };

    await sendMessageMutation(payload, {
      onSuccess: (data: any) => {
        if (data?.success) {
          toast.success(data?.message);
          reset();
        }
      },
    });
  };

  useEffect(() => {
    const newHeights = contentRefs.current.map((ref, idx) => {
      if (!ref) return "0px";
      return openIndex === idx ? `${ref.scrollHeight}px` : "0px";
    });
    setHeights(newHeights);
  }, [openIndex]);

  const accordionData = [
    {
      title: "Customer Details",
      content: (
        <div className="text-[#4B4A47] text-[14px] py-2">
          <p>
            <strong>Name:</strong> {singleOrder?.data?.user?.first_name}{" "}
            {singleOrder?.data?.user?.last_name}
          </p>
          <p>
            <strong>Email:</strong> {singleOrder?.data?.user?.email}
          </p>
        </div>
      ),
    },
    {
      title: "Shipping Address",
      content: (
        <div className="text-[#4B4A47] text-[14px] py-2">
          <p>
            <strong>Name:</strong>{" "}
            {singleOrder?.data?.shipping_address?.first_name}{" "}
            {singleOrder?.data?.shipping_address?.last_name}
          </p>
          <p>
            <strong>Phone:</strong> {singleOrder?.data?.shipping_address?.phone}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {singleOrder?.data?.shipping_address?.address}
          </p>
        </div>
      ),
    },
    // {
    //   title: "Billing Address",
    //   content: (
    //     <div className="text-[#4B4A47] text-[14px] py-2">
    //       <p>
    //         <strong>Name:</strong> John Doe
    //       </p>
    //       <p>
    //         <strong>Phone:</strong> +1234567890
    //       </p>
    //       <p>
    //         <strong>Address:</strong> 456 Street, City, Country
    //       </p>
    //     </div>
    //   ),
    // },
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

  const currentStatus = enabledSteps?.[enabledSteps.length - 1];

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

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between">
        <h3 className="text-[40px] font-semibold text-[#000]">Order Details</h3>
        <div className="flex gap-x-3">
          <button
            className="py-4 px-6 rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer hover:border-[#274F45] duration-300 ease-in-out"
            onClick={() => isOpen(true)}
          >
            Track Package
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-8 flex flex-col lg:flex-row justify-between gap-x-6">
        {/* Left Side */}
        <div className="w-full lg:w-[65%] 2xl:w-[75%]">
          {/* Order Status Dropdown */}
          <div className="my-4">
            <h4 className="text-[#000] font-bold text-[16px] mb-3">
              Order Status
            </h4>

            <div className="relative inline-block">
              {/* Trigger */}
              <button
                onClick={() => setOpenStatusPopover(prev => !prev)}
                className="min-w-[240px] flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-2 hover:border-[#274F45] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-[#274F45]" />

                  <div className="text-left">
                    <p className="text-[12px] text-gray-500">Current Status</p>

                    <h5 className="text-[15px] font-semibold text-[#274F45] capitalize">
                      {currentStatus}
                    </h5>
                  </div>
                </div>

                <FaAngleDown
                  className={`transition-transform duration-300 ${
                    openStatusPopover ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Popover */}
              <div
                className={`absolute left-0 top-[110%] z-50 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-300 ${
                  openStatusPopover
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                }`}
              >
                <div className="p-2">
                  {steps?.slice(0, 4)?.map(step => (
                    <button
                      key={step.key}
                      onClick={() => {
                        updateStatusMutation({
                          endpoint: `/api/order-status-update/${order_id}`,
                          status: step?.key,
                        });

                        setOpenStatusPopover(false);
                      }}
                      className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-[#274F45]/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-[#274F45]" />

                        <span className="text-[14px] font-medium text-[#222] group-hover:text-[#274F45]">
                          {step.label}
                        </span>
                      </div>

                      <FaCheck className="opacity-0 scale-50 text-[#274F45] transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] items-start mt-6">
            {steps.map((step, index) => {
              const isCompleted = enabledSteps.includes(step.key);

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center relative"
                >
                  {/* Connector */}
                  {index !== 0 && (
                    <div
                      className={`absolute top-3 -left-1/2 w-full border-t border-dashed ${
                        isCompleted ? "border-[#274F45]" : "border-[#A7A39C]"
                      }`}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`z-10 size-6 rounded-full border-2 flex items-center justify-center ${
                      isCompleted ? "border-[#274F45]" : "border-[#A7A39C]"
                    }`}
                  >
                    <div
                      className={`size-4 rounded-full ${
                        isCompleted ? "bg-[#274F45]" : "bg-[#A7A39C]"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <h5
                    className={`mt-3 text-center text-[14px] font-medium ${
                      isCompleted ? "text-[#000]" : "text-[#A7A39C]"
                    }`}
                  >
                    {step.label}
                  </h5>
                </div>
              );
            })}
          </div>

          {/* Products */}
          <div className="mt-6">
            <Proorderproduct data={singleOrder?.data} order_id={order_id} />
          </div>

          {/* Step Buttons */}
          {/* <div className="my-6 flex flex-wrap md:flex-nowrap  stepbutton gap-3">
            <button className="py-4 px-3 md:px-6 w-full sm:w-fit rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer hover:border-[#274F45] duration-300 ease-in-out">
              Track Package
            </button>
            <button className="py-4 px-3 md:px-6 w-full sm:w-fit rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer hover:border-[#274F45] duration-300 ease-in-out ">
              Return or replace
            </button>
            <button className="py-4 px-3 md:px-6 w-full sm:w-fit rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer hover:border-[#274F45] duration-300 ease-in-out ">
              Get Help
            </button>
            <button className="py-4 px-3 md:px-6 w-full sm:w-fit rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer hover:border-[#274F45] duration-300 ease-in-out">
              Request a Review
            </button>
          </div> */}

          {/* Order Summary */}
          <div className="hidden lg:block mt-20">
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
                  if (item.isModal) setNoteModalOpen(true);
                  else setOpenIndex(openIndex === idx ? null : idx);
                }}
              >
                <h4 className="text-[#000] font-bold text-[16px]">
                  {item.title}
                </h4>
                {item.isModal ? (
                  <Pen className="text-[#000]" />
                ) : (
                  <FaAngleDown
                    className={`transition-transform duration-300 ${
                      openIndex === idx ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </div>

              {!item.isModal && (
                <div
                  ref={(el: HTMLDivElement | null): void => {
                    contentRefs.current[idx] = el;
                  }}
                  style={{ maxHeight: heights[idx] }}
                  className="overflow-hidden transition-all duration-500 ease-in-out px-3"
                >
                  {item?.content}
                </div>
              )}
            </div>
          ))}

          <div className="border border-gray-300 p-4 rounded-lg">
            <h2 className="text-[24px] font-normal text-[#000]">
              Message to Buyer
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
                placeholder="Enter Message"
                className="py-2 px-3 rounded-[8px] border border-gray-300 cursor-pointer hover:border-primary-green duration-300 ease-in-out w-full mt-5 h-[280px]"
                {...register("message", {
                  required: "Message is required",
                })}
              />

              <div className="flex flex-col gap-y-3 mt-5">
                <button
                  type="submit"
                  disabled={isSending}
                  className={`auth-secondary-btn w-full ${
                    isSending
                      ? "!cursor-not-allowed opacity-85"
                      : "cursor-pointer"
                  }`}
                >
                  {isSending ? (
                    <p className="flex gap-2 items-center justify-center">
                      <CgSpinnerTwo className="animate-spin text-xl" />
                      <span>Please wait....</span>
                    </p>
                  ) : (
                    "Send Messages"
                  )}
                </button>

                <Link
                  href={`/dashboard/${
                    singleOrder?.data?.user?.role === "vendor" &&
                    singleOrder?.data?.user?.membership?.membership_type ===
                      "pro"
                      ? "pro"
                      : singleOrder?.data?.user?.role === "vendor" &&
                          singleOrder?.data?.user?.membership
                            ?.membership_type === "basic"
                        ? "basic"
                        : "customer"
                  }/messages/inbox/${singleOrder?.data?.user_id}`}
                  className="auth-primary-btn !text-center"
                >
                  Go to Messages
                </Link>
              </div>
            </form>
          </div>

          <button
            disabled={!singleOrder?.data?.note}
            onClick={() => {
              setNote(singleOrder?.data?.note);
              setShowNote(true);
            }}
            className={`font-semibold border border-[#E1E2E2] rounded-lg overflow-hidden w-full p-3 ${
              singleOrder?.data?.note
                ? "cursor-pointer hover:bg-accent-red hover:text-white duration-300 transition-all"
                : "opacity-70 bg-gray-200 cursor-not-allowed"
            }`}
          >
            View Note
          </button>

          <div className="mt-12">
            <button
              disabled={isCancellingOrder}
              onClick={() =>
                cancelOrder({
                  endpoint: `/api/cancel-order/${order_id}`,
                })
              }
              className="py-4 px-6 rounded-[8px] border border-[#8E2F2F] bg-[#FFE8E8] font-semibold text-[#8E2F2F] cursor-pointer hover:border-[#274F45] duration-300 ease-in-out w-full disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isCancellingOrder ? "Cancelling...." : "Cancel Order"}
            </button>
          </div>
        </div>
      </div>
      {/* Order Summary */}
      <div className="block lg:hidden mt-20">
        <OrderSummary data={singleOrder?.data} />
      </div>

      {/* <EditOrderModal
        isOpen={editModalOpen}
        onClose={() => {
          if (editModalOpen) {
            setEditModalOpen(false);
            document.body.style.overflow = "visible";
          }
        }}
      /> */}

      <Modal open={noteModalOpen} onClose={() => setNoteModalOpen(false)}>
        <OrderNote
          order_id={order_id}
          onClose={() => setNoteModalOpen(false)}
        />
      </Modal>

      <Modal open={open} onClose={() => isOpen(false)}>
        <TrackPackageModal order_id={order_id} />
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
