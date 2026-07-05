"use client";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { OrderRowSkeleton } from "@/Components/Loader/Loader";
import useAuth from "@/Hooks/useAuth";
import Link from "next/link";
import Modal from "@/Components/Common/Modal";
import { Download } from "@/Components/Svg/SvgContainer";
import { IoSearchOutline } from "react-icons/io5";
import { CSVLink } from "react-csv";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import OrdersList from "@/Components/PageComponents/dashboardPages/Orders/OrdersList";
import {
  useCancelOrderMutation,
  useGetVendorOrdersQuery,
} from "@/redux/api/orderApi";
import toast from "react-hot-toast";
const filters = [
  {
    label: "Last 30 Days",
    value: "last_30_days",
  },
  {
    label: "Year to Date",
    value: "year_to_date",
  },
  {
    label: "Custom Date Range",
    value: "custom_date_range",
  },
  {
    label: "Specific Year",
    value: "specific_year",
  },
];

type orderItem = {
  id: number;
  order_number: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  total_quantity: number;
  subscribe_website: number;
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
  const [filter, setFilter] = useState("last_30_days");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState("");
  const tabs = [
    "orders",
    "pending",
    "confirmed",
    "delivered",
    "cancelled",
    "purchased from another member",
  ];

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const { data: allOrders, isLoading } = useGetVendorOrdersQuery({
    status,
    search,
    page,
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
    allOrders?.data?.data?.map((order: orderItem) => ({
      order_number: order?.order_number,
      order_date: moment(order?.created_at).format("ll"),
      customer: `${order?.user?.first_name || ""} ${order?.user?.last_name || ""}`,
      email: order?.user?.email,
      opt: order?.subscribe_website ? "Yes" : "No",
      total_quantity: order?.total_quantity,
      total_amount: `$${order?.total_amount}`,
      payment_method:
        order?.payment_method === "paypal" ? "Paypal" : "Cash On Delivery",
      payment_status: order?.payment_status,
      status:
        order?.status === "local_pickup_requested"
          ? "Local pickup requested"
          : order?.status === "awaiting_payment"
            ? "Awaiting Payment"
            : order?.status,
      shipping_option:
        order?.shipping_option === "local_pickup" ? "Local Pickup" : "Shipping",
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

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3.5 lg:gap-0 mb-7">
        <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-secondary-black">
          Orders
        </h2>

        <div className="flex flex-wrap gap-2.5 md:gap-x-4 items-center">
          <div className="flex flex-wrap gap-3 md:gap-6 items-center w-full md:w-fit">
            <CSVLink
              data={csvData}
              headers={headers}
              filename={"orders-report.csv"}
              className="w-full md:w-fit px-5 rounded-[8px] border border-light-green font-semibold text-secondary-black cursor-pointer duration-300 ease-in-out flex gap-x-2 items-center h-11.5 justify-center"
            >
              <Download />
              Download File
            </CSVLink>
          </div>

          <div className="relative w-full md:w-fit">
            <input
              placeholder="Search Orders"
              type="search"
              onChange={e => setSearch(e.target.value)}
              className="w-full lg:w-[300px] px-3 py-2.5 pl-9 outline-0 border border-gray-300 rounded-lg"
            />

            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-lg">
              <IoSearchOutline />
            </div>
          </div>

          <Select value={filter} onValueChange={value => setFilter(value)}>
            <SelectTrigger className="w-full sm:w-[200px] border ring-0 shadow-none cursor-pointer rounded-lg px-3 py-5.5 border-gray-300 outline-none">
              <SelectValue placeholder="Select Filter" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className=" bg-white border-0 shadow-none ring-gray-200"
            >
              <SelectGroup className="border-0">
                {filters?.map(item => (
                  <SelectItem
                    key={item?.label}
                    value={item?.value}
                    className="cursor-pointer py-2 hover:bg-gray-100"
                  >
                    {item?.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* <select
            className="w-full sm:w-[200px] border rounded-lg px-3 h-11.5 border-gray-300 outline-none"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="last_30_days">Last 30 Days</option>
            <option value="year_to_date">Year to Date</option>
            <option value="custom_date_range">Custom Date Range</option>
            <option value="specific_year">Specific Year</option>
          </select> */}

          {/* Date range */}
          {filter === "custom_date_range" && (
            <div className="flex gap-2 mt-2">
              <input
                type="date"
                onChange={e => setDateRange({ from: e.target.value, to: "" })}
                className="border p-2 rounded"
              />

              <input
                type="date"
                onChange={e =>
                  setDateRange(prev => ({ ...prev, to: e.target.value }))
                }
                className="border p-2 rounded"
              />
            </div>
          )}

          {/* Year */}
          {filter === "specific_year" && (
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="border p-2 rounded mt-2"
              placeholder="Enter year (e.g. 2024)"
            />
          )}
        </div>
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
                  : tab,
              );
            }}
            className={`cursor-pointer px-3 capitalize text-[16px] md:text-[20px] font-semibold ${
              isActive === tab
                ? "border-b-2 border-secondary-black text-secondary-black"
                : "text-light-green"
            }`}
          >
            {tab}
          </h3>
        ))}
      </div>

      {isActive === "purchased from another member" ? (
        <OrdersList
          role="pro"
          reviewBasePath="/dashboard/pro/reviews"
          orderBasePath="/dashboard/pro/orders/details"
        />
      ) : (
        <div className="w-full pt-10">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse text-nowrap">
              <thead>
                <tr className="border-b-2 border-gray-300 text-secondary-black text-[15px] xl:text-[16px] font-semibold">
                  <th className="py-3 px-4 text-left">Order #</th>
                  <th className="py-3 px-4 text-left">Order Date</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Opt In</th>
                  <th className="py-3 px-4 text-left">Items</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Payment Method</th>
                  <th className="py-3 px-4 text-left">Payment Status</th>
                  <th className="py-3 px-4 text-left">Order Status</th>
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
                      className="border-b border-gray-300 text-secondary-black text-[14px] font-semibold last:border-b-0 hover:bg-gray-100 duration-200 transition-all"
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

                      <td className="py-4 px-4">
                        {order?.subscribe_website ? "Yes" : "No"}
                      </td>
                      <td className="py-4 px-4">{order?.total_quantity}</td>
                      <td className="py-4 px-4">${order?.total_amount}</td>
                      <td className="py-4 px-4">
                        {order?.payment_method === "paypal"
                          ? "Paypal"
                          : "Cash On Delivery"}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`min-w-[100px] capitalize inline-block text-center px-3 py-1 rounded-full text-sm font-semibold ${
                            order?.payment_status === "pending"
                              ? "text-red-500"
                              : "text-primary-green"
                          }`}
                        >
                          {order?.payment_status}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`min-w-[100px] ${order?.status === "processing" ? "text-primary-green" : order?.status === "shipped" ? "text-secondary-gray" : "text-white"} capitalize inline-block text-center px-3 py-1 rounded-full text-sm font-semibold ${
                            order?.status === "delivered"
                              ? "bg-primary-green"
                              : order?.status === "pending" ||
                                  order?.status === "local_pickup_requested"
                                ? "bg-accent-red"
                                : order?.status === "confirmed"
                                  ? "bg-dark-green"
                                  : order?.status === "processing"
                                    ? "bg-off-green"
                                    : order?.status === "cancelled"
                                      ? "bg-primary-red"
                                      : order?.status === "shipped"
                                        ? "bg-accent-blue"
                                        : order?.status === "paid"
                                          ? "bg-light-green"
                                          : "bg-gray-500"
                          }`}
                        >
                          {order?.status === "local_pickup_requested"
                            ? "Local pickup requested"
                            : order?.status === "awaiting_payment"
                              ? "Awaiting Payment"
                              : order?.status}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {order?.shipping_option === "local_pickup"
                          ? "Local pickup"
                          : "Shipping"}
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
                              disabled={isCancelling}
                              onClick={() => {
                                try {
                                  const res: any = cancelOrder(
                                    order?.id,
                                  ).unwrap();
                                  if (res?.success) {
                                    toast.success(res?.message);
                                  }
                                } catch (err: any) {
                                  toast.error(err?.data?.message);
                                }
                                setOpenPopup(false);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-red-500 block disabled:cursor-not-allowed disabled:opacity-85 cursor-pointer"
                            >
                              {isCancelling ? "Cancelling..." : " Cancel Order"}
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
