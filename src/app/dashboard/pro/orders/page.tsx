"use client";
import moment from "moment";
import { useEffect, useState } from "react";
import { getOrders, useUpdateOrderStatus } from "@/Hooks/api/dashboard_api";
import { BsThreeDotsVertical } from "react-icons/bs";
import { OrderRowSkeleton } from "@/Components/Loader/Loader";
import useAuth from "@/Hooks/useAuth";
import Link from "next/link";
import VendorOrders from "./_Components/VendorOrders";
import Modal from "@/Components/Common/Modal";

type orderItem = {
  id: number;
  order_number: string;
  payment_method: string;
  created_at: string;
  total_quantity: number;
  total_amount: string;
  status: string;
  shipping_option: string;
  note: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    id: number;
  };
};

const page = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState("orders");
  const [status, setStatus] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [page, setPage] = useState<string>("");
  const tabs = [
    "orders",
    "pending",
    "confirmed",
    "delivered",
    "cancelled",
    "purchased from another member",
  ];
  const { data: allOrders, isLoading } = getOrders(status, page);
  const { mutate: updateStatusMutation, isPending } = useUpdateOrderStatus();

  useEffect(() => {
    const handleWindowClick = () => {
      setOpenPopup(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3.5 lg:gap-0 mb-7">
        <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000]">
          Orders
        </h2>

        {/* <div className="flex flex-wrap gap-2.5 md:gap-x-4 items-center">
          <button
            className="px-6 w-full md:w-fit rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer
                      duration-300 ease-in-out flex gap-x-2 items-center h-[50px] hover:translate-y-1"
          >
            <Download />
            Download File
          </button>
          <div className="relative w-full md:w-fit">
            <input
              placeholder="Search Orders"
              type="search"
              className="w-full lg:w-[300px] py-[10px] pl-4 pr-12 outline-0 border border-[#BFBEBE] rounded-[8px] text-[16px] text-[#67645F] font-normal"
            />

            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[1px] h-[60%] bg-[#BFBEBE]" />

            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
              <FaSearch />
            </div>
          </div>
          <div className="relative w-full md:w-fit">
            <select className="border border-[#A7A39C] rounded-[8px] cursor-pointer appearance-none outline-0 px-3 pr-10 py-[10px] w-full md:w-[190px] text-[#274F45] text-[14px] font-normal">
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 6 Month">Last 6 Month</option>
              <option value="Last Year">Last Year</option>
            </select>

            <FaAngleDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 pointer-events-none" />
          </div>
        </div> */}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-start sm:flex-nowrap gap-2.5 sm:gap-5 md:gap-x-10">
        {tabs?.map(tab => (
          <h3
            key={tab}
            onClick={() => {
              setIsActive(tab);
              setStatus(
                tab === "orders" || tab === "purchased from another shop"
                  ? ""
                  : tab
              );
            }}
            className={`cursor-pointer px-3 capitalize text-[16px] md:text-[20px] font-semibold ${
              isActive === tab
                ? "border-b-2 border-[#13141D] text-[#13141D]"
                : "text-[#77978F]"
            }`}
          >
            {tab}
          </h3>
        ))}
      </div>

      {isActive === "purchased from another member" ? (
        <VendorOrders />
      ) : (
        <div className="w-full pt-10">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 text-[#13141D] text-[15px] xl:text-[16px] font-semibold">
                  <th className="py-3 px-4 text-left">Order #</th>
                  <th className="py-3 px-4 text-left">Order Date</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Items</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">FullFillment</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((_, idx) => (
                    <OrderRowSkeleton key={idx} />
                  ))
                ) : allOrders?.data?.data?.length > 0 ? (
                  allOrders?.data?.data?.map((order: orderItem, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-gray-300 text-[#13141D] text-[14px] font-semibold last:border-b-0 hover:bg-gray-100 duration-200 transition-all"
                    >
                      <td className="py-4 px-4">{order?.order_number}</td>
                      <td className="py-4 px-4">
                        {moment(order?.created_at).format("ll")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span>
                            {order?.user?.first_name} {order?.user?.last_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {order?.user?.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">{order?.total_quantity}</td>
                      <td className="py-4 px-4">${order?.total_amount}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`min-w-[100px] text-white capitalize inline-block text-center px-3 py-1 rounded-full text-sm font-semibold ${
                            order?.status === "delivered"
                              ? "bg-primary-green"
                              : order?.status === "pending"
                              ? "bg-accent-red"
                              : order?.status === "pending"
                              ? "bg-blue-500"
                              : order?.status === "cancelled"
                              ? "bg-primary-red"
                              : "bg-gray-500"
                          }`}
                        >
                          {order?.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 capitalize">
                        {order?.shipping_option}
                      </td>

                      <td className="py-4 px-4 capitalize">
                        <button
                          disabled={!order?.note}
                          onClick={() => {
                            setNote(order?.note);
                            setShowNote(true);
                          }}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border-2 text-accent-red ${
                            order?.note
                              ? "border-accent-red cursor-pointer hover:bg-accent-red hover:text-white duration-300 transition-all"
                              : "opacity-70 bg-gray-200 cursor-not-allowed"
                          }`}
                        >
                          View
                        </button>
                      </td>

                      <td className="py-4 px-4 flex justify-center items-center relative">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setOrderId(order?.id);
                            setOpenPopup(!openPopup);
                          }}
                          className="cursor-pointer"
                        >
                          <BsThreeDotsVertical />
                        </button>

                        {openPopup && orderId === order.id && (
                          <div
                            onClick={e => e.stopPropagation()}
                            className={`absolute right-16 px-1 py-2 w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 ${
                              i === allOrders?.data?.data?.length - 1 &&
                              allOrders?.data?.data?.length > 5
                                ? "-top-20"
                                : "top-8"
                            }`}
                          >
                            <Link
                              href={`/dashboard/${user?.membership?.membership_type}/orders/${order?.id}`}
                              className="w-full text-left px-3 py-1.5 hover:bg-gray-100 cursor-pointer block"
                            >
                              View Details
                            </Link>

                            <button
                              disabled={isPending}
                              onClick={() =>
                                updateStatusMutation(
                                  {
                                    endpoint: `/api/order-status-update/${order?.id}`,
                                    status: "cancelled",
                                  },
                                  {
                                    onSuccess: () => {
                                      setOpenPopup(false);
                                    },
                                  }
                                )
                              }
                              className={`w-full text-left px-3 py-1.5 hover:bg-gray-100 text-red-500 block ${
                                isPending
                                  ? "cursor-not-allowed opacity-85"
                                  : "cursor-pointer"
                              }`}
                            >
                              {isPending ? "Cancelling..." : " Cancel Order"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <p className="text-red-500 font-semibold text-lg mt-5">
                    No orders found
                  </p>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {!isLoading && (
              <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                {allOrders?.data?.links?.map((item: any, idx: number) => (
                  <button
                    key={idx}
                    disabled={!item.url}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                    onClick={() => item.url && setPage(item.url.split("=")[1])}
                    className={`px-3 py-1 rounded border transition-all duration-200  ${
                      item.active
                        ? "bg-primary-green text-white"
                        : "bg-white text-gray-700"
                    } ${
                      !item.url
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Card */}
          {/* <div className="lg:hidden space-y-4">
                 {paginatedData.map((order, i) => (
                   <div key={i} className=" rounded-lg  overflow-hidden relative">
                     <div className="flex justify-between items-center  px-4 py-2">
                       <div>
                         <p className="font-semibold">#{order.id}</p>
                         <p className="text-xs text-gray-500">{order.date}</p>
                       </div>
     
                       <div className="flex items-center gap-2">
                         <span
                           className={`px-2 py-1 rounded-full text-xs font-medium ${
                             statusColors[order.status] ?? "bg-gray-300 text-black"
                           }`}
                         >
                           {order.status}
                         </span>
     
                         <div className="relative">
                           <BsThreeDotsVertical
                             onClick={() => toggleDropdown(i)}
                             className="cursor-pointer"
                           />
                           {openRow === i && (
                             <div className="absolute right-0 mt-2 w-28 bg-white rounded shadow-lg z-10">
                               <button
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                 onClick={() => setOpenRow(null)}
                               >
                                 Edit
                               </button>
                               <button
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                 onClick={() => {
                                   router.push(`/dashboard/pro/orders/${order.id}`);
                                 }}
                               >
                                 View Details
                               </button>
                               <button
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                                 onClick={() => setOpenRow(null)}
                               >
                                 Canceled
                               </button>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
     
                     <div className="text-sm">
                       <div className="flex justify-between px-4 py-2 bg-[#F0EEE9]">
                         <span className="text-gray-600">Customer</span>
                         <span className="font-medium">{order.customer}</span>
                       </div>
                       <div className="flex justify-between px-4 py-2">
                         <span className="text-gray-600">Email</span>
                         <span className="text-gray-800">{order.email}</span>
                       </div>
                       <div className="flex justify-between px-4 py-2 bg-[#F0EEE9]">
                         <span className="text-gray-600">Opt In</span>
                         <span className="font-medium">{order.optIn}</span>
                       </div>
                       <div className="flex justify-between px-4 py-2">
                         <span className="text-gray-600">Items</span>
                         <span className="font-medium">{order.items}</span>
                       </div>
                       <div className="flex justify-between px-4 py-2 bg-[#F0EEE9]">
                         <span className="text-gray-600">Amount</span>
                         <span className="font-medium">{order.amount}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div> */}
        </div>
      )}

      <Modal open={showNote} onClose={() => setShowNote(false)}>
        <h3 className="text-xl font-semibold text-primary-green mb-2">
          Order Note
        </h3>
        <p className="leading-[164%] text-gray-700">"{note}"</p>
      </Modal>
    </>
  );
};

export default page;
