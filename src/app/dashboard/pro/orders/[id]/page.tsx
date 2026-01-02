"use client";
import { useParams } from "next/navigation";
import { FaAngleDown } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { Pen } from "@/Components/Svg/SvgContainer";
import OrderNote from "@/Components/Modals/OrderNote";
import { useEffect, useRef, useState } from "react";
import OrderSummary from "@/Components/Prodashboardcomponents/OrderSummary";
import Proorderproduct from "@/Components/Prodashboardcomponents/Proorderproduct";
import {
  getSingleOrder,
  useUpdateOrderStatus,
} from "@/Hooks/api/dashboard_api";
import Modal from "@/Components/Common/Modal";
import TrackPackageModal from "@/Components/Modals/TrackPackageModal";

const Page = () => {
  const params = useParams();
  const order_id = Number(params.id);
  const [open, isOpen] = useState<boolean>(false);
  const { mutate: updateStatusMutation, isPending: isCancelling } =
    useUpdateOrderStatus();
  const { data: singleOrder, isLoading } = getSingleOrder(order_id);

  const orderHistory = singleOrder?.data?.order_status_history ?? [];
  const currentStep = orderHistory.length - 1;
  console.log(singleOrder?.data);

  const steps = [
    { label: "Order Confirmed", path: "confirmed" },
    { label: "Order Processing", path: "processing" },
    { label: "Order Shipped", path: "shipped" },
    { label: "Order Delivered", path: "delivered" },
    { label: "Order Cancelled", path: "cancelled" },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Separate modal states
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  // refs for sidebar accordion
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<Array<string>>([]);

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
            <strong>Name:</strong> John Doe
          </p>
          <p>
            <strong>Email:</strong> john@example.com
          </p>
          <p>
            <strong>Phone:</strong> +1234567890
          </p>
          <p>
            <strong>Address:</strong> 123 Street, City, Country
          </p>
        </div>
      ),
    },
    {
      title: "Shipping Address",
      content: (
        <div className="text-[#4B4A47] text-[14px] py-2">
          <p>
            <strong>Name:</strong> John Doe
          </p>
          <p>
            <strong>Phone:</strong> +1234567890
          </p>
          <p>
            <strong>Address:</strong> 123 Street, City, Country
          </p>
        </div>
      ),
    },
    {
      title: "Billing Address",
      content: (
        <div className="text-[#4B4A47] text-[14px] py-2">
          <p>
            <strong>Name:</strong> John Doe
          </p>
          <p>
            <strong>Phone:</strong> +1234567890
          </p>
          <p>
            <strong>Address:</strong> 456 Street, City, Country
          </p>
        </div>
      ),
    },
    {
      title: "Order Note",
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
    <div className="2xl:px-6 py-4 ">
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
          <h4 className="text-[#000] font-bold text-[16px]">Order Status</h4>
          <div className="relative my-3">
            <select
              onChange={e => {
                updateStatusMutation({
                  endpoint: `/api/order-status-update/${order_id}`,
                  status: e.target.value,
                });
              }}
              className="border border-[#A7A39C] rounded-[8px] cursor-pointer appearance-none outline-0 px-2 py-[10px] w-[190px] text-[#274F45] text-[14px] font-normal"
            >
              <option disabled>Choose status</option>
              {steps?.map(step => (
                <option key={step.label} value={step?.path}>
                  {step?.label}
                </option>
              ))}
            </select>
            <FaAngleDown className="absolute top-3 left-40 size-5" />
          </div>

          {/* Progress Bar */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] items-start mt-6">
            {orderHistory.map((step: any, index: number) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Connector */}
                {index !== 0 && (
                  <div
                    className={`absolute top-3 -left-1/2 w-full border-t border-dashed ${
                      index <= currentStep
                        ? "border-[#274F45]"
                        : "border-[#A7A39C]"
                    }`}
                  />
                )}

                {/* Circle */}
                <div
                  className={`z-10 size-6 rounded-full border-2 flex items-center justify-center ${
                    index <= currentStep
                      ? "border-[#274F45]"
                      : "border-[#A7A39C]"
                  }`}
                >
                  <div
                    className={`size-4 rounded-full ${
                      index <= currentStep ? "bg-[#274F45]" : "bg-[#A7A39C]"
                    }`}
                  />
                </div>

                {/* Label */}
                <h5 className="mt-3 text-center text-[14px] font-medium text-[#000] capitalize">
                  {step?.content?.trim()?.split(/\s+/)?.pop()}
                </h5>
              </div>
            ))}
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
          {accordionData.map((item, idx) => (
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
                  {item.content}
                </div>
              )}
            </div>
          ))}
          <div className="border p-4 rounded-lg">
            <h2 className="text-[24px] font-normal text-[#000]">
              Message to Buyer
            </h2>
            <div className="pt-5">
              <h4 className="text-[16px] font-semibold text-[#000]">
                Amy Woods
              </h4>
              <h5 className="text-[16px] font-semibold text-[#000]">
                Order Number: #155796{" "}
              </h5>
            </div>
            <textarea
              placeholder="Enter Message"
              className="py-2 px-3 rounded-[8px] border border-[#8E2F2F]  text-[16px] font-normal text-[#000] cursor-pointer hover:border-green-500 duration-300 ease-in-out w-full mt-5 h-[280px]"
            />
            <div className="flex flex-col gap-y-3 mt-5">
              <button className="auth-secondary-btn">Send Messages</button>
              <button className="auth-primary-btn">Go to Messages</button>
            </div>
          </div>

          {status === "Package Delivered" ? (
            ""
          ) : (
            <div className="mt-12">
              <button
                onClick={() =>
                  updateStatusMutation({
                    endpoint: `/api/order-status-update/${order_id}`,
                    status: "cancelled",
                  })
                }
                className="py-4 px-6 rounded-[8px] border border-[#8E2F2F] bg-[#FFE8E8] text-[16px] font-semibold text-[#8E2F2F] cursor-pointer hover:border-[#274F45] duration-300 ease-in-out w-full"
              >
                {isCancelling ? "Cancelling...." : "Cancel Order"}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Order Summary */}
      <div className="block lg:hidden mt-20">
        <OrderSummary data={singleOrder?.data} />
      </div>
      {/* Modals */}
      <OrderNote
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        note="This is the detailed order note info."
      />
      {/* <EditOrderModal
        isOpen={editModalOpen}
        onClose={() => {
          if (editModalOpen) {
            setEditModalOpen(false);
            document.body.style.overflow = "visible";
          }
        }}
      /> */}
      {/* <SendMessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
      /> */}

      <Modal open={open} onClose={() => isOpen(false)}>
        <TrackPackageModal order_id={order_id} />
      </Modal>
    </div>
  );
};

export default Page;
