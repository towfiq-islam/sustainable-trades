"use client";
import Link from "next/link";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Delete, Pen } from "@/Components/Svg/SvgContainer";
import {
  useBulkDeleteDiscount,
  useDiscountStatusChange,
  getDiscount,
} from "@/Hooks/api/dashboard_api";
import { DiscountSkeleton } from "@/Components/Loader/Loader";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

const DiscountsPage = () => {
  const [status, setStatus] = useState<string>("active");
  const [selected, setSelected] = useState<string[]>([]);
  const [singleDiscountId, setSingleDiscountId] = useState(null);
  const tabs = [{ label: "active" }, { label: "inactive" }];
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  // Mutation & Query
  const { mutate, isPending } = useBulkDeleteDiscount();
  const { mutate: discountStatusChange, isPending: isChanging } =
    useDiscountStatusChange(singleDiscountId);
  const { data: discountData, refetch, isLoading } = getDiscount(status);

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // For Delete
  const handleDelete = () => {
    if (selected?.length === 0) {
      return toast.error("Please select any discount");
    }

    mutate(
      { ids: selected },
      {
        onSuccess: () => {
          setSelected([]);
          refetch();
        },
      }
    );
  };

  const toggleOpen = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // For status change
  const handleChangeStatus = (id: string, newStatus: string) => {
    discountStatusChange(
      { id, status: newStatus.toLowerCase() },
      {
        onSuccess: () => {
          toggleOpen(id);
          refetch();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000]">
          Discounts
        </h2>

        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* Search */}
          <div className="relative">
            <input
              placeholder={"Search..."}
              type="search"
              className="py-1.5 md:py-3 pl-4 outline-0 border border-[#274F45] rounded-[8px] text-[16px] text-[#67645F] font-normal w-full md:w-[300px]"
            />
            <div className="absolute top-4 right-3">
              <FaSearch />
            </div>
            <div className="absolute top-0 right-10 w-[2px] bg-[#274F45] h-[45px]"></div>
          </div>

          {/* Create button */}
          <Link href="/dashboard/pro/discounts/create-discount">
            <button className="hover:border-[#D4E2CB] hover:border border hover:bg-transparent rounded-[8px] py-1.5 md:py-2 px-5 text-[178px] md:text-[20px] font-semibold cursor-pointer w-full md:w-fit bg-[#D4E2CB] text-[#274F45] duration-500 ease-in-out">
              Create Discount
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-t border-b border-[#BFBEBE] py-4">
        {tabs?.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setStatus(tab?.label)}
            className={`flex items-center justify-center gap-2 border-2 border-[#274F45] rounded-[6px] px-4 py-1 text-base md:py-2 duration-300 cursor-pointer font-semibold capitalize ${
              status === tab?.label
                ? "bg-[#D4E2CB] text-[#274F45]"
                : "text-[#274F45] hover:bg-[#D4E2CB]"
            }`}
          >
            {tab?.label}
          </button>
        ))}

        {/* For Delete */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className={`flex items-center justify-center gap-2 border-2 border-[#274F45] text-[#274F45] hover:bg-[#D4E2CB] rounded-[6px] px-4 py-1 text-base md:py-2 duration-300 font-semibold capitalize ${
            isPending ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isPending ? (
            <CgSpinnerTwo className="text-lg animate-spin" />
          ) : (
            <Delete className="size-5" />
          )}
        </button>
      </div>

      {/* Discounts list */}
      <div>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <DiscountSkeleton key={i} />)
        ) : discountData?.data?.length === 0 ? (
          <p className="py-6 text-center text-red-500 font-semibold">
            No discounts found
          </p>
        ) : (
          discountData?.data?.map((d: any) => (
            <div
              key={d.id}
              className="py-4 flex flex-col md:flex-row md:items-start md:justify-between border-b border-gray-300"
            >
              {/* Left side */}
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(d?.id)}
                  onChange={() => {
                    toggleSelect(d?.id);
                  }}
                  className="self-start mt-2 scale-110"
                />
                <div>
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#13141D]">
                    Discount Name: {d?.name}
                  </h3>

                  <p className="text-[#67645F] font-bold text-[16px]">
                    {d?.promotion_type === "percentage"
                      ? `${d?.amount}% off ${
                          d?.applies === "any_order"
                            ? "the shopper’s entire order"
                            : d?.product?.product_name
                        }`
                      : `${parseFloat(d?.amount).toFixed(2)} off ${
                          d?.applies === "any_order"
                            ? "the shopper’s entire order"
                            : d?.product?.product_name
                        }`}
                    {d.description}
                  </p>

                  <div className="mt-3 md:mt-7 text-[14px] md:text-[16px] flex gap-1 items-center">
                    <span className="font-bold text-[12px] md:text-[16px] text-[#13141D]">
                      STARTS:
                    </span>
                    <span className="text-gray-600">{`${moment(
                      d?.start_date
                    ).format("ll")} at ${d?.start_time}`}</span>

                    <span className="sm:ml-4 font-bold text-[14px] md:text-[16px] text-[#13141D]">
                      ENDS:
                    </span>
                    <span className="text-gray-600">
                      {d?.never_expires || !d?.end_date
                        ? "Never Expires"
                        : `${moment(d?.end_date).format("ll")} at ${
                            d?.end_time
                          }`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-end w-full md:w-fit md:justify-end flex-col space-y-2 relative">
                <div className="text-[15px] md:text-[20px] font-bold text-[#13141D]">
                  {d?.code}
                </div>

                <div className="flex justify-end my-0.5 md:my-1">
                  <Link
                    href={`/dashboard/pro/discounts/create-discount/${d?.id}`}
                  >
                    <button className="py-2 px-2 md:text-sm rounded bg-[#D4E2CB] text-[#274F45] cursor-pointer flex gap-x-2 font-semibold">
                      <Pen />
                      Edit
                    </button>
                  </Link>
                </div>

                <div className="text-[16px] text-[#13141D] font-bold">
                  {d?.discount_limits === 0
                    ? "Unlimited Uses"
                    : `0 of ${d?.discount_limits} Uses`}
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setSingleDiscountId(d?.id);
                      toggleOpen(d?.id);
                    }}
                    className={`px-2 py-1 rounded text-sm font-semibold cursor-pointer capitalize ${
                      d?.status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {d?.status}
                  </button>

                  {openDropdowns[d?.id] && (
                    <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-300 rounded shadow-lg z-10">
                      <button
                        disabled={isChanging}
                        className="px-4 py-1.5 cursor-pointer hover:bg-green-100 rounded block w-full text-left disabled:cursor-not-allowed"
                        onClick={() => handleChangeStatus(d?.id, "Active")}
                      >
                        Active
                      </button>

                      <button
                        disabled={isChanging}
                        className="px-4 py-1.5 cursor-pointer hover:bg-red-100 rounded block w-full text-left disabled:cursor-not-allowed"
                        onClick={() => handleChangeStatus(d?.id, "Inactive")}
                      >
                        Inactive
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscountsPage;
