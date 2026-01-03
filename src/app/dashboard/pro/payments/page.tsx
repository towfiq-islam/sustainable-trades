"use client";
import moment from "moment";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getPayments } from "@/Hooks/api/dashboard_api";
import { PaymentRowSkeleton } from "@/Components/Loader/Loader";

type orderItem = {
  payment_method: string;
  payment_status: string;
  amount: string;
  order: {
    order_number: string;
    created_at: string;
    user: {
      first_name: string;
      last_name: string;
    };
  };
};

const page = () => {
  const [isActive, setIsActive] = useState("All Payments");
  const [status, setStatus] = useState<string>("");
  const tabs = ["All Payments", "pending", "failed", "completed"];
  const { data: allPayments, isLoading } = getPayments(status);

  return (
    <>
      <div className="flex flex-col gap-2.5 md:gap-0 md:flex-row justify-between md:items-center">
        <h2 className="text-[40px] font-lato font-semibold text-[#000]">
          Payments
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-[300px]">
            <div className="flex items-center border border-[#BFBEBE] rounded-[8px] overflow-hidden">
              <input
                type="search"
                placeholder="Search Payments"
                className="flex-1 py-[10px] pl-4 pr-2 outline-0 text-[16px] text-[#67645F] font-normal"
              />
              {/* Divider */}
              <div className="w-[1px] h-6 bg-[#BFBEBE]" />
              {/* Icon */}
              <button className="p-3 text-[#67645F]">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start sm:flex-nowrap gap-2.5 sm:gap-5 md:gap-x-10">
          {tabs?.map(tab => (
            <h3
              key={tab}
              onClick={() => {
                setIsActive(tab);
                setStatus(tab === "All Payments" ? "" : tab);
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

        <div className="w-full mt-7">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 text-[#13141D] text-[16px] font-semibold">
                  <th className="py-3 px-4 text-left"># Order ID</th>
                  <th className="py-3 px-4 text-left">Purchase Date</th>
                  <th className="py-3 px-4 text-left">Billing to</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Payment Method</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <PaymentRowSkeleton key={idx} />
                  ))
                ) : allPayments?.data?.length > 0 ? (
                  allPayments?.data?.map((order: orderItem, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-gray-300 text-[#13141D] text-[15px] font-semibold"
                    >
                      <td className="py-4 px-4">
                        {order?.order?.order_number}
                      </td>
                      <td className="py-4 px-4">
                        {moment(order?.order?.created_at).format("ll")}
                      </td>
                      <td className="py-4 px-4">
                        {order?.order?.user?.first_name}{" "}
                        {order?.order?.user?.last_name}
                      </td>
                      <td className="py-4 px-4">${order?.amount}</td>
                      <td className="py-4 px-4 capitalize">
                        {order?.payment_method}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`min-w-[100px] inline-block border-2 text-center px-3 py-1 rounded-full text-sm capitalize font-semibold ${
                            order?.payment_status === "pending"
                              ? "border-accent-red text-accent-red"
                              : order?.payment_status === "failed"
                              ? "border-primary-red text-primary-red"
                              : order?.payment_status === "completed"
                              ? "border-primary-green text-primary-green"
                              : ""
                          }`}
                        >
                          {order?.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p className="text-red-500 text-lg pt-5 font-semibold">
                    No payment history found!
                  </p>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          {/* <div className="md:hidden space-y-4">
            {paginatedData.map((order, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow-sm text-sm text-[#13141D] font-medium relative"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">Invoice:</span>
                  <span>{order.invoice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Purchase Date:</span>
                  <span>{order.purchaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Billing To:</span>
                  <span>{order.billingTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Amount:</span>
                  <span>{order.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(order.status) ?? "bg-gray-300 text-black"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-col md:flex-row gap-2">
                  <button
                    className="flex-1 bg-[#274F45] text-white py-2 cursor-pointer rounded-lg"
                    onClick={() =>
                      router.push(`/dashboard/pro/orders/${order.invoice}`)
                    }
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 border border-red-500 text-black cursor-pointer py-2 rounded-lg"
                    onClick={() => {}}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default page;
