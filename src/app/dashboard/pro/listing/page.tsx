"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import {
  FiMoreVertical,
  FiEdit2,
  FiGrid,
  FiList,
  FiPackage,
} from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import {
  ProductRowSkeleton,
  ProductSkeleton,
} from "@/Components/Loader/Loader";
import { useGetProductsQuery } from "@/redux/api/productApi";

const allStatus = ["pending", "confirmed", "shipped", "approved", "cancelled"];

type ImageItem = { id?: number; image: string };

type ProductItem = {
  id: number;
  product_name: string;
  product_price: number | string;
  images: ImageItem[];
  status: string;
  product_quantity: number;
  unlimited_stock: boolean;
  out_of_stock: boolean;
  sku: string;
  cost: string | number;
};

type ViewMode = "table" | "grid";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  approved: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
      statusStyles[status] ?? "bg-gray-100 text-gray-600"
    }`}
  >
    {status}
  </span>
);

const StockLabel = (p: ProductItem) =>
  p.out_of_stock
    ? "Out of Stock"
    : p.unlimited_stock
      ? "Unlimited stock"
      : p.product_quantity;

export default function Page() {
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const { data: allListings, isLoading } = useGetProductsQuery({
    status: statusFilter,
    short_by: sortBy,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest(".product-menu")) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const products: ProductItem[] = useMemo(() => {
    const list = allListings?.data ?? [];
    if (!search) return list;
    return list.filter((p: ProductItem) =>
      p.product_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allListings, search]);

  const toggleSelect = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id],
    );
  };

  const isFiltered = !!search || !!statusFilter;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[25px] md:text-[36px] font-lato font-semibold text-secondary-black">
          Listings
        </h2>

        {/* View toggle */}
        <div className="hidden sm:flex gap-2 items-center border border-gray-300 rounded-lg p-1 w-fit self-start sm:self-auto">
          <button
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`p-2 rounded-[6px] cursor-pointer transition-colors duration-200 ${
              view === "grid"
                ? "bg-primary-green text-white"
                : "text-secondary-black hover:bg-gray-100"
            }`}
            aria-label="Grid view"
          >
            <FiGrid size={18} />
          </button>

          <button
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
            className={`p-2 rounded-[6px] cursor-pointer transition-colors duration-200 ${
              view === "table"
                ? "bg-primary-green text-white"
                : "text-secondary-black hover:bg-gray-100"
            }`}
            aria-label="Table view"
          >
            <FiList size={18} />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mt-6">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 flex-1">
          {/* Search */}
          <div className="relative w-full sm:max-w-[320px]">
            <p className="text-secondary-black text-[15px] font-semibold mb-2 sm:hidden">
              Search
            </p>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search listings..."
              type="search"
              className="py-[10px] pl-4 pr-10 outline-0 border border-accent-gray focus:border-primary-green rounded-[8px] text-[15px] text-[#67645F] font-normal w-full transition-colors duration-200"
            />
            <FaSearch className="absolute top-1/2 right-4 -translate-y-1/2 text-[#67645F] text-sm pointer-events-none" />
          </div>

          {/* Status */}
          <div className="w-full sm:w-fit">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2.5 rounded-[8px] border border-accent-gray w-full sm:w-[180px] cursor-pointer capitalize text-[15px]"
            >
              <option value="">All</option>
              {allStatus.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Link
          href="/dashboard/pro/create-listing"
          className="h-[45px] lg:h-[48px] rounded-[8px] bg-accent-red text-[15px] font-semibold text-secondary-black cursor-pointer hover:bg-transparent duration-300 ease-in-out border border-accent-red w-full lg:w-fit px-6 flex gap-x-2 justify-center items-center shrink-0"
        >
          <FaPlus />
          Add New Listing
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        view === "table" ? (
          <table className="w-full border-collapse mt-10 hidden lg:table">
            <thead>
              <tr className="text-left border-b border-accent-gray">
                {[
                  "Product",
                  "Approval Status",
                  "Stock",
                  "Price",
                  "Cost",
                  "Action",
                ].map(h => (
                  <th
                    key={h}
                    className="text-secondary-black font-semibold text-[16px] pb-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, idx) => (
                <ProductRowSkeleton key={idx} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 xl:gap-6 mt-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        )
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 mt-10 border border-gray-200 rounded-[8px]">
          <div className="size-14 rounded-full bg-accent-red/10 grid place-items-center mb-5">
            <FiPackage className="text-accent-red text-2xl" />
          </div>
          <h6 className="text-secondary-black font-semibold">
            {isFiltered ? "No matching listings" : "No listings yet"}
          </h6>
          <p className="text-sm text-gray-500 font-normal mt-2 max-w-xs">
            {isFiltered
              ? "Try a different search term or filter."
              : "Products you add to your store will show up here."}
          </p>
          {isFiltered && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
              className="mt-4 px-5 py-2 rounded-[8px] text-[13px] font-semibold text-secondary-black border border-accent-red hover:bg-accent-red duration-300 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : view === "grid" ? (
        /* Grid view */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 xl:gap-6 mt-10">
          {products.map(product => (
            <div
              key={product.id}
              className="relative border border-[#e5e5e5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 group"
            >
              <div className="relative w-full h-[270px]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${product.images?.[0]?.image}`}
                  alt={product.product_name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={product.status} />
                </div>
                <Link href={`/dashboard/pro/listing/${product.id}`}>
                  <button
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow cursor-pointer border border-primary-green
                      opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
                      transition-all duration-300 ease-in-out"
                    aria-label="Edit listing"
                  >
                    <FiEdit2 size={16} className="text-primary-green" />
                  </button>
                </Link>
              </div>

              <div className="p-4">
                <h3 className="text-[16px] md:text-[18px] font-medium text-secondary-black truncate">
                  {product.product_name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-base md:text-[18px] font-semibold text-secondary-black">
                    ${Number(product.product_price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table view (desktop) + card fallback (mobile) */
        <>
          <div className="hidden lg:block mt-10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-gray-300">
                  {[
                    "Product",
                    "Approval Status",
                    "Stock",
                    "Price",
                    "Cost",
                    "Action",
                  ].map(h => (
                    <th
                      key={h}
                      className="text-secondary-black font-semibold text-[16px] pb-5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-300 hover:bg-off-green/15"
                  >
                    <td className="py-3 text-secondary-black font-semibold text-[14px]">
                      <div className="flex items-center gap-5">
                        <figure className="h-[80px] w-[100px] rounded-lg relative shrink-0">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${p.images?.[0]?.image}`}
                            alt={p.product_name}
                            fill
                            unoptimized
                            className="h-full w-full rounded-lg object-cover"
                          />
                        </figure>
                        <span>{p.product_name}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="text-secondary-black font-semibold text-[14px]">
                      {StockLabel(p)}
                    </td>
                    <td className="text-secondary-black font-semibold text-[14px]">
                      ${Number(p.product_price).toFixed(2)}
                    </td>
                    <td className="text-secondary-black font-semibold text-[14px]">
                      ${Number(p.cost).toFixed(2)}
                    </td>

                    <td className="relative">
                      <Link
                        href={`/dashboard/pro/listing/${p.id}`}
                        className="w-fit block"
                      >
                        <button
                          className="cursor-pointer text-xl"
                          aria-label="Edit listing"
                        >
                          <TbEdit />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card fallback */}
          <div className="block lg:hidden space-y-4 mt-6">
            {products.map(p => (
              <div
                key={p.id}
                className="flex items-start justify-between border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="mt-2"
                  />
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${p.images?.[0]?.image}`}
                    alt={p.product_name}
                    height={50}
                    width={50}
                    unoptimized
                    className="rounded-md object-cover size-[50px]"
                  />
                  <div>
                    <h3 className="font-semibold text-secondary-black text-sm">
                      {p.product_name}
                    </h3>
                    <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                    <p className="text-xs text-gray-500">
                      Stock: {StockLabel(p)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Price: ${Number(p.product_price).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <StatusBadge status={p.status} />
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Cost: ${Number(p.cost).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                    className="p-1"
                    aria-label="More actions"
                  >
                    <FiMoreVertical />
                  </button>
                  {openMenu === p.id && (
                    <div className="product-menu absolute right-0 mt-2 bg-white border rounded shadow-lg w-32 z-10">
                      <Link
                        href={`/dashboard/pro/listing/edit-inventory/${p.id}`}
                      >
                        <button
                          onClick={() => setOpenMenu(null)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
