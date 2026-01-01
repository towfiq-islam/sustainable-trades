"use client";
import { useState } from "react";
import { getOrders } from "@/Hooks/api/dashboard_api";
import { useRouter } from "next/navigation";
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";
import { OrderRowSkeleton } from "@/Components/Loader/Loader";

type orderItem = {
  id: number;
  order_number: string;
  payment_method: string;
  created_at: string;
  total_quantity: number;
  total_amount: string;
  status: string;
  shipping_option: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    id: number;
  };
};

const ProordersTabs = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState("orders");
  const [status, setStatus] = useState<string>("");
  const tabs = ["orders", "pending", "confirmed", "delivered", "cancelled"];
  const { data: myOrders, isLoading } = getOrders(status);
  console.log(myOrders?.data);

  return (
    <div>
      <div className="flex flex-wrap justify-center sm:justify-start sm:flex-nowrap gap-2.5 sm:gap-5  md:gap-x-10">
        {tabs?.map(tab => (
          <h3
            key={tab}
            onClick={() => {
              setIsActive(tab);
              setStatus(tab === "orders" ? "" : tab);
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

      <div className="pt-5 md:pt-12">
        <div className="w-full">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-gray-300 text-[#13141D] text-[15px] xl:text-[16px] font-semibold">
                  <th className="py-3 px-4 text-left">Order #</th>
                  <th className="py-3 px-4 text-left">Order Date</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Items</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">FullFillment</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              
              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((_, idx) => (
                    <OrderRowSkeleton key={idx} />
                  ))
                ) : myOrders?.data?.length > 0 ? (
                  myOrders?.data?.map((order: orderItem, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-gray-300 text-[#13141D] text-[14px] font-semibold"
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
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {order?.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 capitalize">
                        {order?.shipping_option}
                      </td>

                      <td className="py-4 px-4 text-center relative">
                        <button>
                          <BsThreeDotsVertical className="inline-block cursor-pointer" />
                        </button>
                        {/* <div className="absolute right-0 mt-2 w-28 bg-white rounded shadow-lg z-10">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          View Details
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer">
                          Canceled
                        </button>
                      </div> */}
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
          </div>

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
      </div>
    </div>
  );
};

export default ProordersTabs;
