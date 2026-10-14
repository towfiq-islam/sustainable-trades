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
    delivered: "bg-primary-green text-gray-100",
    pending: "bg-accent-red text-gray-100",
    confirmed: "bg-dark-green text-gray-100",
    paid: "bg-light-green",
    shipped: "bg-accent-blue text-gray-100",
    processing: "bg-off-green",
    cancelled: "bg-primary-red text-white",
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
  role,
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
        <ul className="flex flex-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-2 lg:gap-x-6 py-4 md:py-6 w-full">
          {TABS.map(tab => (
            <li
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`text-[15px] text-center font-semibold border-b-2 text-black px-3 py-2 flex-1 shrink-0 whitespace-nowrap cursor-pointer ${
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
        <div className={`w-full ${role === "pro" ? "mt-6 md:mt-10" : ""}`}>
          {/* Mobile Card Format (shown below md) */}
          <div className="block md:hidden space-y-3.5">
            {orders.map((order: OrderRow) => (
              <div
                key={order.id}
                className="border border-light-gray rounded-[12px] p-4 bg-white space-y-3 shadow-xs"
              >
                {/* Header: Order Number, Shops & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-black text-[15px]">
                      #{order.order_number}
                    </p>
                    <p className="text-xs text-muted-gray mt-0.5">
                      {order.vendor_count}{" "}
                      {order.vendor_count === 1 ? "shop" : "shops"}
                    </p>
                  </div>

                  <span className={statusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs border-y border-light-gray py-3 bg-table-header/40 -mx-4 px-4">
                  <div>
                    <span className="text-muted-gray block text-[11px] uppercase tracking-wide">
                      Date
                    </span>
                    <span className="font-medium text-secondary-black mt-0.5 block">
                      {moment(order.created_at).format("MMM D, YYYY")}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-gray block text-[11px] uppercase tracking-wide">
                      Items
                    </span>
                    <div className="flex items-center gap-1.5 font-medium text-secondary-black mt-0.5">
                      <FiPackage className="text-muted-gray text-xs shrink-0" />
                      <span>
                        {order.item_count}{" "}
                        {order.item_count === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-gray block text-[11px] uppercase tracking-wide">
                      Total
                    </span>
                    <span className="font-bold text-secondary-black text-sm mt-0.5 block">
                      ${order.total_amount}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-gray block text-[11px] uppercase tracking-wide">
                      Payment
                    </span>
                    <span className="font-medium text-secondary-black capitalize mt-0.5 block">
                      {order.payment_status || "Paid"}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-0.5">
                  <Link
                    href={`${orderBasePath}/${order?.id}`}
                    className="block w-full text-center py-2 px-4 rounded-[8px] border border-gray-300 text-sm font-medium text-primary-green transition duration-300 hover:bg-primary-green hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Format (hidden on mobile, shown on md and above) */}
          <div className="hidden md:block border border-light-gray rounded-[12px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left border-collapse text-nowrap">
                <thead>
                  <tr className="bg-table-header text-[15px] text-muted-gray font-semibold">
                    <th className="px-5 lg:px-6 py-4">Order</th>
                    <th className="px-5 lg:px-6 py-4">Items</th>
                    <th className="px-5 lg:px-6 py-4">Total</th>
                    <th className="px-5 lg:px-6 py-4">Status</th>
                    <th className="px-5 lg:px-6 py-4">Date</th>
                    <th className="px-5 lg:px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order: OrderRow) => (
                    <tr
                      key={order.id}
                      className="border-t border-light-gray hover:bg-table-header transition-colors"
                    >
                      <td className="px-5 lg:px-6 py-4">
                        <p className="font-bold text-black text-[15px] pb-1">
                          #{order.order_number}
                        </p>
                        <p className="text-sm text-muted-gray">
                          {order.vendor_count}{" "}
                          {order.vendor_count === 1 ? "shop" : "shops"}
                        </p>
                      </td>

                      <td className="px-5 lg:px-6 py-4">
                        <div className="flex items-center gap-2 text-black text-sm">
                          <FiPackage className="text-muted-gray" />
                          <span>
                            {order.item_count}{" "}
                            {order.item_count === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 lg:px-6 py-4 font-bold text-secondary-black">
                        ${order.total_amount}
                      </td>

                      <td className="px-5 lg:px-6 py-4">
                        <span className={statusBadgeClass(order.status)}>
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 lg:px-6 py-4 text-sm text-muted-gray">
                        <p>{moment(order.created_at).format("MMM D, YYYY")}</p>
                      </td>

                      <td className="px-5 lg:px-6 py-4 text-right">
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
          </div>

          {/* Pagination */}
          {meta && (
            <div className="mt-4 md:mt-6 pe-0 md:pe-5 flex justify-center md:justify-end">
              <PaginationControl
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
              />
            </div>
          )}
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
