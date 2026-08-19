"use client";
import Link from "next/link";
import moment from "moment";
import { useState } from "react";
import { useGetMyOrdersQuery } from "@/redux/api/ordersApi";
import { FiShoppingCart, FiPackage } from "react-icons/fi";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";
import PaginationControl from "@/Components/Common/PaginationControl";
import { CustomerOrderTableSkeleton } from "@/Components/Loader/Loader";

type OrdersListProps = {
  role: "customer" | "pro";
  showHeader?: boolean;
  showTabs?: boolean;
  orderBasePath: string;
};

type OrderRow = {
  id: number;
  order_number: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  status: string;
  created_at: string;
  vendor_count: number;
  item_count: number;
};

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    delivered: "bg-primary-green",
    pending: "bg-accent-red",
    confirmed: "bg-dark-green",
    paid: "bg-light-green",
    shipped: "bg-accent-blue",
    processing: "bg-off-green",
    cancelled: "bg-primary-red",
  };
  return `inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
    map[status] ?? "bg-gray-100 text-gray-600"
  }`;
};

const TABS = [
  { key: "orders", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const OrdersList = ({
  showHeader,
  showTabs,
  orderBasePath,
}: OrdersListProps) => {
  const [isActive, setIsActive] = useState("orders");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { data: myOrders, isFetching: isLoading } = useGetMyOrdersQuery({
    status,
    page,
  });
  const orders = myOrders?.data ?? [];
  const meta = myOrders?.meta;

  const handleTabClick = (tabKey: string) => {
    setIsActive(tabKey);
    setStatus(tabKey === "orders" ? "" : tabKey);
    setPage(1);
  };

  return (
    <>
      {showHeader && (
        <DashBoardHeader heading="All Orders" placeholder="Search Orders" />
      )}

      {showTabs && (
        <ul className="flex flex-wrap md:flex-nowrap gap-2 lg:gap-x-6 py-6 w-full">
          {TABS.map(tab => (
            <li
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`text-[15px] text-center font-semibold border-b-2 text-black px-3 py-2 flex-1 cursor-pointer ${
                isActive === tab.key
                  ? "text-primary-green border-light-green"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      )}

      {isLoading ? (
        <CustomerOrderTableSkeleton />
      ) : orders.length > 0 ? (
        <div className="border border-[#EDEDED] rounded-[12px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAF9] text-[15px] text-[#67645F] font-semibold">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order: OrderRow) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#EDEDED] hover:bg-[#FAFAF9] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-black text-[15px] pb-1">
                        #{order.order_number}
                      </p>
                      <p className="text-sm text-[#67645F]">
                        {order.vendor_count}{" "}
                        {order.vendor_count === 1 ? "vendor" : "vendors"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-black text-sm">
                        <FiPackage className="text-[#67645F]" />
                        <span>
                          {order.item_count}{" "}
                          {order.item_count === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-secondary-black">
                      ${order.total_amount}
                    </td>

                    <td className="px-6 py-4">
                      <span className={statusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#67645F]">
                      <p>{moment(order.created_at).format("MMM D, YYYY")}</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`${orderBasePath}/${order?.id}`}
                        className="inline-block px-4 py-2 rounded-[8px] border border-gray-300 text-sm font-medium text-primary-green transition duration-300 hover:bg-primary-green hover:text-white"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pe-5">
            <PaginationControl
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={setPage}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="size-14 rounded-full bg-accent-red/10 grid place-items-center mb-5">
            <FiShoppingCart className="text-accent-red text-2xl" />
          </div>

          <h6 className="text-secondary-black font-semibold">
            {status ? `No ${status} orders` : "No orders yet"}
          </h6>

          <p className="text-sm text-gray-500 font-normal mt-2 max-w-[280px]">
            {status
              ? "Try checking a different tab."
              : "Orders you place will show up here."}
          </p>
        </div>
      )}
    </>
  );
};

export default OrdersList;
