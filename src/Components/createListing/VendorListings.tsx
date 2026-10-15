"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { FiEdit2, FiGrid, FiList, FiPackage } from "react-icons/fi";
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

const ListingImage = ({
  src,
  alt,
  className = "object-cover size-full rounded-lg",
}: {
  src?: string;
  alt: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="size-full flex items-center justify-center bg-off-green/20 text-primary-green">
        <FiPackage className="text-xl sm:text-2xl" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      onError={() => setError(true)}
      className={className}
    />
  );
};

const statusBadgeStyles: Record<string, string> = {
  approved: "bg-primary-green text-white",
  pending: "bg-accent-red/20 text-accent-red-hover border border-accent-red/30",
  shipped: "bg-accent-blue/30 text-primary-green border border-accent-blue/50",
  confirmed: "bg-primary-green/80 text-white",
  cancelled: "bg-primary-red/10 text-primary-red border border-primary-red/30",
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status?.toLowerCase();
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap inline-block ${
        statusBadgeStyles[normalized] ?? "bg-gray-100 text-secondary-black"
      }`}
    >
      {status}
    </span>
  );
};

const StockLabel = (p: ProductItem) =>
  p.out_of_stock
    ? "Out of Stock"
    : p.unlimited_stock
      ? "Unlimited stock"
      : `${p.product_quantity} in stock`;

export default function VendorListings({
  variant,
}: {
  variant: "basic" | "pro";
}) {
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: allListings, isLoading } = useGetProductsQuery({
    status: statusFilter,
  });

  const products: ProductItem[] = useMemo(() => {
    const list = allListings?.data ?? [];
    if (!search) return list;
    return list.filter((p: ProductItem) =>
      p.product_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allListings, search]);

  const isFiltered = !!search || !!statusFilter;

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-semibold text-secondary-black">
          Listings
        </h2>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex gap-1 items-center border border-gray-200 rounded-lg p-1 bg-white">
            <button
              onClick={() => setView("table")}
              aria-pressed={view === "table"}
              className={`p-1.5 sm:p-2 rounded-md cursor-pointer transition-colors ${
                view === "table"
                  ? "bg-primary-green text-white"
                  : "text-secondary-black hover:bg-gray-100"
              }`}
              aria-label="Table view"
            >
              <FiList size={18} />
            </button>

            <button
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              className={`p-1.5 sm:p-2 rounded-md cursor-pointer transition-colors ${
                view === "grid"
                  ? "bg-primary-green text-white"
                  : "text-secondary-black hover:bg-gray-100"
              }`}
              aria-label="Grid view"
            >
              <FiGrid size={18} />
            </button>
          </div>

          <Link
            href={`/dashboard/${variant === "pro" ? "pro" : "basic"}/create-listing`}
            className="px-4 py-2 sm:py-2.5 rounded-[8px] bg-accent-red text-sm sm:text-base font-semibold text-secondary-black cursor-pointer hover:bg-transparent hover:text-accent-red duration-300 transition-all border border-accent-red flex gap-1.5 items-center shrink-0"
          >
            <FaPlus className="text-xs" />
            <span>Add New Listing</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search listings..."
            type="search"
            className="w-full py-2 pl-3.5 pr-9 outline-0 border border-gray-200 rounded-lg text-sm focus:border-primary-green transition-colors"
          />
          <FaSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-gray text-xs pointer-events-none" />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-pointer w-full sm:w-44 outline-none capitalize"
        >
          <option value="">All Statuses</option>
          {allStatus.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        view === "table" ? (
          <>
            {/* Desktop Table Skeletons */}
            <div className="hidden lg:block mt-6 border border-gray-200 rounded-[8px] overflow-hidden bg-white/40">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200 bg-gray-50/70">
                    {[
                      "Product",
                      "Approval Status",
                      "Stock",
                      "Price",
                      ...(variant === "pro" ? ["Cost"] : []),
                      "Action",
                    ].map(h => (
                      <th
                        key={h}
                        className="text-secondary-black font-semibold text-sm py-5 px-4"
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
            </div>

            {/* Mobile Skeleton Fallback */}
            <div className="block lg:hidden space-y-3 mt-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-gray-200 rounded-[8px] p-3.5 bg-white/50 animate-pulse"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="size-16 bg-gray-200 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 mt-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        )
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 mt-6 border border-gray-200 rounded-[8px] bg-white/40">
          <div className="size-14 rounded-full bg-off-green/40 grid place-items-center mb-4">
            <FiPackage className="text-primary-green text-2xl" />
          </div>
          <h6 className="text-base text-secondary-black font-semibold">
            {isFiltered ? "No matching listings" : "No listings yet"}
          </h6>
          <p className="text-xs sm:text-sm text-muted-gray font-normal mt-1.5 max-w-xs">
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
              className="mt-4 px-5 py-2 rounded-[8px] text-xs sm:text-sm font-semibold text-secondary-black border border-accent-red hover:bg-accent-red duration-300 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : view === "grid" ? (
        /* Grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 mt-6">
          {products.map(product => (
            <div
              key={product.id}
              className="relative border border-gray-200 rounded-lg overflow-hidden bg-white/70 shadow-xs hover:shadow-md transition duration-300 group flex flex-col justify-between"
            >
              <div className="relative w-full h-50 xl:h-60 bg-warm-beige/30">
                <ListingImage
                  src={
                    product.images?.[0]?.image
                      ? `${process.env.NEXT_PUBLIC_SITE_URL}/${product.images[0].image}`
                      : undefined
                  }
                  alt={product.product_name}
                />
                <div className="absolute top-2.5 left-2.5">
                  <StatusBadge status={product.status} />
                </div>
                <Link
                  href={`/dashboard/${variant === "pro" ? "pro" : "basic"}/listing/${product.id}`}
                  className="absolute top-2.5 right-2.5 bg-white/95 rounded-full p-2 shadow-sm border border-primary-green/50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 hover:bg-off-green/20"
                  aria-label="Edit listing"
                >
                  <FiEdit2 size={15} className="text-primary-green" />
                </Link>
              </div>

              <div className="p-3.5">
                <h3 className="text-sm sm:text-base font-semibold text-secondary-black truncate">
                  {product.product_name}
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs sm:text-sm">
                  <p className="font-bold text-primary-green">
                    ${Number(product.product_price).toFixed(2)}
                  </p>
                  <span className="text-muted-gray text-xs">
                    {StockLabel(product)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table view (desktop) + card list (mobile) */
        <>
          <div className="hidden lg:block mt-6 border border-gray-200 rounded-[8px] overflow-hidden bg-white/40">
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200 bg-gray-50/70">
                    {[
                      "Product",
                      "Approval Status",
                      "Stock",
                      "Price",
                      ...(variant === "pro" ? ["Cost"] : []),
                      "Action",
                    ].map(h => (
                      <th
                        key={h}
                        className="text-secondary-black font-semibold text-sm py-5 px-4"
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
                      className="border-b last:border-b-0 border-gray-200 hover:bg-off-green/10 transition-colors"
                    >
                      <td className="py-3 px-4 text-secondary-black font-semibold text-sm">
                        <div className="flex items-center gap-3.5">
                          <figure className="h-14 w-16 rounded-lg relative shrink-0 overflow-hidden bg-warm-beige/40 border border-gray-200">
                            <ListingImage
                              src={
                                p.images?.[0]?.image
                                  ? `${process.env.NEXT_PUBLIC_SITE_URL}/${p.images[0].image}`
                                  : undefined
                              }
                              alt={p.product_name}
                            />
                          </figure>
                          <span className="truncate max-w-xs">{p.product_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3 px-4 text-secondary-black text-sm">
                        {StockLabel(p)}
                      </td>
                      <td className="py-3 px-4 text-primary-green font-bold text-sm">
                        ${Number(p.product_price).toFixed(2)}
                      </td>
                      {variant === "pro" && (
                        <td className="py-3 px-4 text-muted-gray text-sm">
                          ${Number(p.cost).toFixed(2)}
                        </td>
                      )}

                      <td className="py-3 px-4">
                        <Link
                          href={`/dashboard/${variant === "pro" ? "pro" : "basic"}/listing/${p.id}`}
                          className="size-8 rounded-lg grid place-items-center text-primary-green hover:bg-off-green/30 transition-colors"
                          aria-label="Edit listing"
                        >
                          <TbEdit size={19} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card fallback */}
          <div className="block lg:hidden space-y-3 mt-6">
            {products.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-gray-200 rounded-[8px] p-3.5 bg-white/70 gap-3 shadow-xs"
              >
                <figure className="relative size-16 sm:size-20 rounded-lg shrink-0 overflow-hidden bg-warm-beige/40 border border-gray-200">
                  <ListingImage
                    src={
                      p.images?.[0]?.image
                        ? `${process.env.NEXT_PUBLIC_SITE_URL}/${p.images[0].image}`
                        : undefined
                    }
                    alt={p.product_name}
                  />
                </figure>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-secondary-black truncate">
                    {p.product_name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-secondary-gray mt-1">
                    <span>
                      Stock: <strong className="text-secondary-black font-semibold">{StockLabel(p)}</strong>
                    </span>
                    <span>
                      Price: <strong className="text-primary-green font-bold">${Number(p.product_price).toFixed(2)}</strong>
                    </span>
                    {variant === "pro" && (
                      <span>
                        Cost: <strong className="text-muted-gray">${Number(p.cost).toFixed(2)}</strong>
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <StatusBadge status={p.status} />
                  </div>
                </div>

                <Link
                  href={`/dashboard/${variant === "pro" ? "pro" : "basic"}/listing/${p.id}`}
                  className="size-9 rounded-lg bg-off-green/40 hover:bg-off-green text-primary-green grid place-items-center shrink-0 transition-colors"
                  aria-label="Edit listing"
                >
                  <TbEdit size={18} />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
