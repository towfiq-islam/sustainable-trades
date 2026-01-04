"use client";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Delete, Pen } from "@/Components/Svg/SvgContainer";
import {
  useDiscountget,
  useBulkDeleteDiscount,
  useDiscountStatusChange,
} from "@/Hooks/api/dashboard_api";
import { DiscountSkeleton } from "@/Components/Loader/Loader";

const DiscountsPage = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [selected, setSelected] = useState<string[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [singleDiscountId, setSingleDiscountId] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const { data: getdiscountdata, refetch, isLoading } = useDiscountget();
  console.log(getdiscountdata);

  const bulkDelete = useBulkDeleteDiscount();
  const discountStatusChange = useDiscountStatusChange(singleDiscountId);

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (getdiscountdata?.data) {
      const mapped = getdiscountdata.data.map((item: any) => {
        let desc = "";
        if (item.promotion_type === "percentage") {
          desc = `${item.amount}% off`;
        } else {
          desc = `$${parseFloat(item.amount).toFixed(2)} off`;
        }
        if (item.applies === "any_order") {
          desc += " the shopper’s entire order";
        } else {
          const productName = item.product?.product_name || "selected product";
          desc += ` ${productName}`;
        }

        const status =
          item.status.charAt(0).toUpperCase() + item.status.slice(1);

        const ends =
          item.never_expires || !item.end_date
            ? "Never Expires"
            : `${formatDate(item.end_date)} at ${item.end_time || "00:00:00"}`;

        const uses =
          item.discount_limits === 0
            ? "Unlimited Uses"
            : `0 of ${item.discount_limits} Uses`;

        return {
          id: item.id.toString(),
          title: item.name,
          description: desc,
          starts: `${formatDate(item.start_date)} at ${item.start_time}`,
          ends,
          code: item.code,
          uses,
          status,
        };
      });
      setDiscounts(mapped);
    }
  }, [getdiscountdata]);

  const filtered = discounts.filter((d: any) => d.status === activeTab);

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (selected.length === 0) return;
    bulkDelete.mutate(
      { ids: selected },
      {
        onSuccess: () => {
          setDiscounts(prev => prev.filter(d => !selected.includes(d.id)));
          setSelected([]);
          refetch();
        },
      }
    );
  };

  const toggleOpen = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Status change function uses the hook properly
  const handleChangeStatus = (id: string, newStatus: string) => {
    discountStatusChange.mutate(
      { id, status: newStatus.toLowerCase() },
      {
        onSuccess: () => {
          setDiscounts(prev =>
            prev.map(d => (d.id === id ? { ...d, status: newStatus } : d))
          );
          toggleOpen(id);
          refetch();
        },
      }
    );
  };

  const tabs = [
    { label: "Active" },
    { label: "Inactive" },
    { label: "", icon: <Delete className="w-5 h-5" />, action: handleDelete },
  ];

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
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() =>
              tab.action ? tab.action() : setActiveTab(tab.label)
            }
            className={`flex items-center justify-center gap-2 border-2 font-semibold border-[#274F45] rounded-[6px] px-4 py-1 text-[13px] text-base md:py-2 duration-300 cursor-pointer ${
              activeTab === tab.label
                ? "bg-[#D4E2CB] text-[#274F45]"
                : "text-[#274F45] hover:bg-[#D4E2CB]"
            }`}
          >
            {tab.icon ? tab.icon : tab.label}
          </button>
        ))}
      </div>

      {/* Discounts list */}
      <div>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <DiscountSkeleton key={i} />)
        ) : filtered?.length === 0 ? (
          <p className="py-6 text-center text-red-500 font-semibold">
            No discounts found in {activeTab}.
          </p>
        ) : (
          filtered?.map((d: any) => (
            <div
              key={d.id}
              className="py-4 flex flex-col md:flex-row md:items-start md:justify-between border-b border-gray-300"
            >
              {/* Left side */}
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(d.id)}
                  onChange={() => {
                    toggleSelect(d.id);
                  }}
                  className="self-start mt-2 scale-110"
                />
                <div>
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#13141D]">
                    Discount Name: {d.title}
                  </h3>

                  <p className="text-[#67645F] font-bold text-[16px]">
                    {d.description}
                  </p>

                  <div className="mt-3 md:mt-7 text-[14px] md:text-[16px] flex gap-1 items-center">
                    <span className="font-bold text-[12px] md:text-[16px] text-[#13141D]">
                      STARTS:
                    </span>
                    {d.starts}

                    <span className="sm:ml-4 font-bold text-[14px] md:text-[16px] text-[#13141D]">
                      ENDS:
                    </span>
                    {d.ends}
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-end w-full md:w-fit md:justify-end flex-col space-y-2 relative">
                <div className="text-[15px] md:text-[20px] font-bold text-[#13141D]">
                  {d.code}
                </div>

                <div className="flex justify-end my-0.5 md:my-1">
                  <Link
                    href={`/dashboard/pro/discounts/create-discount/${d.id}`}
                  >
                    <button className="py-2 px-2 md:text-sm rounded bg-[#D4E2CB] text-[#274F45] cursor-pointer flex gap-x-2 font-semibold">
                      <Pen />
                      Edit
                    </button>
                  </Link>
                </div>

                <div className="text-[16px] text-[#13141D] font-bold">
                  {d.uses}
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setSingleDiscountId(d.id);
                      toggleOpen(d.id);
                    }}
                    className={`px-2 py-1 rounded text-sm font-semibold cursor-pointer ${
                      d.status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {d.status}
                  </button>

                  {openDropdowns[d.id] && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg z-10">
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-green-100"
                        onClick={() => handleChangeStatus(d.id, "Active")}
                      >
                        Active
                      </div>
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-red-100"
                        onClick={() => handleChangeStatus(d.id, "Inactive")}
                      >
                        Inactive
                      </div>
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
