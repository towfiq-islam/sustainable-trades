"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getStatusColor, PaymentData } from "@/Components/Data/data";

type paymentdataprops = {
  data: PaymentData[];
  itemsPerPage?: number;
};

const PaymentTableReusable: React.FC<paymentdataprops> = ({
  data,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const router = useRouter();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const toggleDropdown = (index: number) => {
    setOpenRow(openRow === index ? null : index);
  };

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 text-[#13141D] text-[16px] font-semibold">
              <th className="py-3 px-4 text-left">Invoice #</th>
              <th className="py-3 px-4 text-left">Purchase Date</th>
              <th className="py-3 px-4 text-left">Billing to</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Payment Method</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((order, i) => (
              <tr
                key={i}
                className="border-b border-gray-300 text-[#13141D] text-[14px] font-semibold"
              >
                <td className="py-3 px-4">{order.invoice}</td>
                <td className="py-3 px-4">{order.purchaseDate}</td>
                <td className="py-3 px-4">{order.billingTo}</td>
                <td className="py-3 px-4">{order.amount}</td>
                <td className="py-3 px-4">{order.paymentMethod}</td>
                <td className="py-3 px-4">
                  <span
                    className={`min-w-[100px] inline-block text-center px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(order.status) ?? "bg-gray-300 text-black"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center relative">
                  <BsThreeDotsVertical
                    onClick={() => toggleDropdown(i)}
                    className="inline-block cursor-pointer"
                  />
                  {openRow === i && (
                    <div className="absolute right-0 mt-2 w-28 bg-white rounded shadow-lg z-10">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setOpenRow(null);
                          router.push(`/dashboard/pro/orders/${order.invoice}`);
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                        onClick={() => setOpenRow(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
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

            {/* Mobile actions */}
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
      </div>
    </div>
  );
};

export default PaymentTableReusable;
