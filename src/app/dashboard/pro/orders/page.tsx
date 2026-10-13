"use client";
import {
  useCancelOrderMutation,
  useGetVendorOrdersQuery,
} from "@/redux/api/ordersApi";
import moment from "moment";
import Link from "next/link";
import { CSVLink } from "react-csv";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Download } from "@/Components/Svg/SvgContainer";
import { OrderRowSkeleton } from "@/Components/Loader/Loader";
import PaginationControl from "@/Components/Common/PaginationControl";
import OrdersList from "@/Components/order/OrdersList";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";

type orderItem = {
  id: number;
  order_number: string;
  payment_method: string;
  payment_status: string;
  order_date: string;
  total_quantity: number;
  items: number;
  opt_in: string;
  amount: string;
  status: string;
  fulfillment_type: string;
  note: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    id: number;
  };
};

const getOrderStatusBadge = (status: string) => {
  const normalized = status?.toLowerCase();
  switch (normalized) {
    case "delivered":
      return "bg-primary-green text-white";
    case "confirmed":
      return "bg-primary-green/80 text-white";
    case "processing":
      return "bg-off-green text-primary-green font-semibold";
    case "shipped":
      return "bg-accent-blue/30 text-primary-green border border-accent-blue/50";
    case "pending":
      return "bg-accent-red/20 text-accent-red-hover border border-accent-red/40";
    case "cancelled":
      return "bg-primary-red/10 text-primary-red border border-primary-red/30";
    case "out_for_delivery":
    case "picked_up":
    case "ready_for_pickup":
      return "bg-light-green/20 text-primary-green border border-light-green/40";
    default:
      return "bg-gray-100 text-secondary-black";
  }
};

const formatOrderStatus = (status: string) => {
  if (!status) return "Unknown";
  return status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
};

const page = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState("orders");
  const [status, setStatus] = useState<string>("");
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState("last_30_days");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [year, setYear] = useState(2026);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const tabs = [
    "orders",
    "pending",
    "confirmed",
    "delivered",
    "cancelled",
    "purchased from another member",
  ];

  // Debounced search to prevent excessive API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const { data: allOrders, isFetching: isLoading } = useGetVendorOrdersQuery({
    status,
    search,
    page,
    per_page: 10,
    filter,
    date_from: filter === "custom_date_range" ? dateRange.from : undefined,
    date_to: filter === "custom_date_range" ? dateRange.to : undefined,
    year: filter === "specific_year" ? year : undefined,
  });

  const headers = [
    { label: "Order Number #", key: "order_number" },
    { label: "Order Date", key: "order_date" },
    { label: "Customer", key: "customer" },
    { label: "Email", key: "email" },
    { label: "Opt In", key: "opt" },
    { label: "Items", key: "total_quantity" },
    { label: "Amount", key: "total_amount" },
    { label: "Payment Method", key: "payment_method" },
    { label: "Payment Status", key: "payment_status" },
    { label: "Order Status", key: "status" },
    { label: "FullFillment", key: "shipping_option" },
    { label: "Notes", key: "note" },
  ];

  const csvData =
    allOrders?.data?.map((order: orderItem) => ({
      order_number: order?.order_number,
      order_date: moment(order?.order_date).format("ll"),
      customer: `${order?.customer?.first_name || ""} ${order?.customer?.last_name || ""}`,
      email: order?.customer?.email,
      opt: order?.opt_in ? "Yes" : "No",
      total_quantity: order?.items,
      total_amount: `$${order?.amount}`,
      payment_method: "paypal",
      payment_status: order?.payment_status,
      status: order?.status,
      shipping_option: order?.fulfillment_type,
      note: order?.note || "",
    })) || [];

  useEffect(() => {
    const handleWindowClick = () => {
      setOpenPopup(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleCancel = (id: number) => {
    cancelOrder(id)
      .unwrap()
      .then(res => {
        if (res?.success) {
          toast.success(res?.message || "Order cancelled");
        }
      })
      .catch(err => {
        toast.error(err?.data?.message || "Failed to cancel order");
      });
    setOpenPopup(false);
  };

  return (
    <>
      {/* Top Header & Action Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <DashBoardHeader heading="Orders" />

          <CSVLink
            data={csvData}
            headers={headers}
            filename={"orders-report.csv"}
            className="w-full sm:w-auto px-4 py-2.5 rounded-[8px] border border-light-green text-sm sm:text-base font-semibold text-secondary-black cursor-pointer hover:bg-off-green/30 duration-200 flex gap-2 items-center justify-center shrink-0 self-start sm:self-auto"
          >
            <Download />
            Download File
          </CSVLink>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
            <input
              placeholder="Search Orders..."
              type="search"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full px-3 py-2 pl-9 outline-0 border border-gray-300 rounded-lg text-sm focus:border-primary-green transition-colors"
            />
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-base text-muted-gray pointer-events-none">
              <IoSearchOutline />
            </div>
          </div>

          <select
            className="border rounded-lg px-3 py-2 text-sm border-gray-300 outline-none cursor-pointer bg-white"
            value={filter}
            onChange={e => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="last_30_days">Last 30 Days</option>
            <option value="year_to_date">Year to Date</option>
            <option value="custom_date_range">Custom Date Range</option>
            <option value="specific_year">Specific Year</option>
          </select>

          {/* Date range */}
          {filter === "custom_date_range" && (
            <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
              <input
                type="date"
                value={dateRange.from}
                onChange={e => {
                  setDateRange({ from: e.target.value, to: "" });
                  setPage(1);
                }}
                className="border border-gray-300 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm bg-white"
              />
              <span className="text-xs text-muted-gray">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={e => {
                  setDateRange(prev => ({ ...prev, to: e.target.value }));
                  setPage(1);
                }}
                className="border border-gray-300 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm bg-white"
              />
            </div>
          )}

          {/* Specific Year */}
          {filter === "specific_year" && (
            <input
              type="number"
              value={year}
              onChange={e => {
                setYear(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 px-3 py-1.5 rounded-lg text-xs sm:text-sm w-28 bg-white"
              placeholder="e.g. 2026"
            />
          )}
        </div>
      </div>

      {/* Horizontally Scrollable Tabs */}
      <div className="flex overflow-x-auto no-scrollbar scrollbar-none gap-2 sm:gap-6 border-b border-gray-200 pb-0 mb-6">
        {tabs?.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setIsActive(tab);
              setStatus(
                tab === "orders" || tab === "purchased from another member"
                  ? ""
                  : tab,
              );
              setPage(1);
            }}
            className={`cursor-pointer pb-2.5 px-1 capitalize text-sm sm:text-base font-medium whitespace-nowrap transition-colors duration-200 border-b-2 ${
              isActive === tab
                ? "border-secondary-black text-secondary-black font-semibold"
                : "border-transparent text-light-green hover:text-secondary-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isActive === "purchased from another member" ? (
        <OrdersList role="pro" orderBasePath="/dashboard/pro/orders/details" />
      ) : (
        <div className="w-full">
          {isLoading ? (
            /* Loading Skeletons */
            <>
              {/* Desktop skeleton */}
              <div className="hidden lg:block w-full overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-nowrap">
                  <thead>
                    <tr className="border-b border-gray-200 text-secondary-black text-sm font-semibold">
                      <th className="py-3 px-4 text-left">Order #</th>
                      <th className="py-3 px-4 text-left">Order Date</th>
                      <th className="py-3 px-4 text-left">Customer</th>
                      <th className="py-3 px-4 text-left">Opt In</th>
                      <th className="py-3 px-4 text-left">Items</th>
                      <th className="py-3 px-4 text-left">Amount</th>
                      <th className="py-3 px-4 text-left">Payment Method</th>
                      <th className="py-3 px-4 text-left">Order Status</th>
                      <th className="py-3 px-4 text-left">Fulfillment</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((_, idx) => (
                      <OrderRowSkeleton key={idx} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile skeleton */}
              <div className="block lg:hidden space-y-3">
                {[1, 2, 3].map(idx => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 animate-pulse bg-white/50"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-28 bg-gray-200 rounded" />
                      <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-3 w-40 bg-gray-200 rounded" />
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : allOrders?.data?.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block w-full overflow-x-auto border border-gray-200 rounded-[8px] bg-white/40">
                <table className="w-full min-w-[900px] border-collapse text-nowrap">
                  <thead>
                    <tr className="border-b border-gray-200 text-secondary-black text-sm font-semibold bg-gray-50/70">
                      <th className="py-3 px-4 text-left">Order #</th>
                      <th className="py-3 px-4 text-left">Order Date</th>
                      <th className="py-3 px-4 text-left">Customer</th>
                      <th className="py-3 px-4 text-left">Opt In</th>
                      <th className="py-3 px-4 text-left">Items</th>
                      <th className="py-3 px-4 text-left">Amount</th>
                      <th className="py-3 px-4 text-left">Payment</th>
                      <th className="py-3 px-4 text-left">Order Status</th>
                      <th className="py-3 px-4 text-left">Fulfillment</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allOrders?.data?.map((order: orderItem, i: number) => (
                      <tr
                        key={order.id || i}
                        className="border-b last:border-b-0 border-gray-200 text-secondary-black text-sm hover:bg-off-green/10 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-semibold">
                          {order?.order_number}
                        </td>
                        <td className="py-3.5 px-4 text-secondary-gray">
                          {moment(order?.order_date).format("ll")}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-secondary-black">
                              {order?.customer?.first_name}{" "}
                              {order?.customer?.last_name}
                            </span>
                            <span className="text-xs text-muted-gray max-w-[170px] truncate">
                              {order?.customer?.email}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-secondary-gray">
                          {order?.opt_in ? "Yes" : "No"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {order?.items}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-primary-green">
                          ${order?.amount}
                        </td>
                        <td className="py-3.5 px-4 capitalize text-secondary-gray">
                          {order?.payment_method || "Paypal"}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${getOrderStatusBadge(
                              order?.status,
                            )}`}
                          >
                            {formatOrderStatus(order?.status)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 capitalize text-secondary-gray">
                          {order?.fulfillment_type || "Standard"}
                        </td>

                        <td className="py-3.5 px-4 text-center relative">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setOrderId(order?.id);
                              setOpenPopup(!openPopup);
                            }}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-secondary-black cursor-pointer inline-flex items-center justify-center"
                            aria-label="Actions"
                          >
                            <BsThreeDotsVertical />
                          </button>

                          {openPopup && orderId === order.id && (
                            <div
                              onClick={e => e.stopPropagation()}
                              className="absolute right-4 top-10 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-left text-xs"
                            >
                              <Link
                                href={`/dashboard/${user?.membership?.membership_type}/orders/${order?.id}`}
                                className="w-full px-3 py-2 hover:bg-off-green/20 text-secondary-black font-medium block"
                              >
                                View Details
                              </Link>

                              {order?.status !== "delivered" &&
                                order?.status !== "cancelled" && (
                                  <button
                                    disabled={isCancelling}
                                    onClick={() => handleCancel(order?.id)}
                                    className="w-full text-left px-3 py-2 hover:bg-red-50 text-primary-red font-medium block disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                                  >
                                    {isCancelling
                                      ? "Cancelling..."
                                      : "Cancel Order"}
                                  </button>
                                )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3">
                {allOrders?.data?.map((order: orderItem) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-[8px] p-4 bg-white/70 space-y-3 shadow-xs"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-xs font-bold text-secondary-black block">
                          {order.order_number}
                        </span>
                        <h4 className="text-sm font-semibold text-secondary-black mt-0.5">
                          {order.customer?.first_name} {order.customer?.last_name}
                        </h4>
                        <span className="text-xs text-muted-gray">
                          {order.customer?.email}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${getOrderStatusBadge(
                          order.status,
                        )}`}
                      >
                        {formatOrderStatus(order.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-y border-gray-100 py-2.5">
                      <div>
                        <span className="text-muted-gray block">Date</span>
                        <span className="font-medium text-secondary-black">
                          {moment(order.order_date).format("ll")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-gray block">Amount</span>
                        <span className="font-semibold text-primary-green">
                          ${order.amount} ({order.items}{" "}
                          {order.items === 1 ? "item" : "items"})
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-gray block">Payment</span>
                        <span className="font-medium text-secondary-black capitalize">
                          {order.payment_method || "Paypal"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-gray block">Fulfillment</span>
                        <span className="font-medium text-secondary-black capitalize">
                          {order.fulfillment_type || "Standard"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <Link
                        href={`/dashboard/${user?.membership?.membership_type}/orders/${order.id}`}
                        className="text-xs font-semibold text-primary-green hover:underline flex items-center gap-1"
                      >
                        View Details →
                      </Link>

                      {order.status !== "delivered" &&
                        order.status !== "cancelled" && (
                          <button
                            disabled={isCancelling}
                            onClick={() => handleCancel(order.id)}
                            className="text-xs font-semibold text-primary-red hover:underline cursor-pointer disabled:opacity-50"
                          >
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {allOrders?.meta && (
                <div className="mt-6">
                  <PaginationControl
                    currentPage={allOrders.meta.current_page}
                    lastPage={allOrders.meta.last_page}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-14 border border-gray-200 rounded-[8px] bg-white/40">
              <div className="size-14 rounded-full bg-off-green/40 grid place-items-center mb-4">
                <FiShoppingBag className="text-primary-green text-2xl" />
              </div>
              <h6 className="text-base text-secondary-black font-semibold">
                No orders found
              </h6>
              <p className="text-xs sm:text-sm text-muted-gray font-normal mt-1.5 max-w-xs">
                {search || status
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Orders will show up here once customers start purchasing."}
              </p>
              {(search || status) && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setStatus("");
                    setIsActive("orders");
                  }}
                  className="mt-4 px-5 py-2 rounded-[8px] text-xs sm:text-sm font-semibold text-secondary-black border border-accent-red hover:bg-accent-red duration-300 cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default page;
