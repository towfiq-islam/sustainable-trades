"use client";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ProductRowSkeleton } from "@/Components/Loader/Loader";
import { useGetAllProductsQuery } from "@/redux/api/productApi";

type ImageItem = {
  image: string;
};

type productItem = {
  id: number;
  product_name: string;
  product_price: number;
  images: ImageItem[];
  status: string;
  product_quantity: number;
  unlimited_stock: boolean;
  out_of_stock: boolean;
  sku: string;
  cost: string;
  image: string | StaticImageData;
};

export default function Page() {
  const [search, setSearch] = useState("");
  const { data: allListings, isFetching } = useGetAllProductsQuery({});
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest(".product-menu")) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id],
    );
  };

  return (
    <>
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row gap-5 justify-between items-start md:items-center ">
        <div className="relative w-full lg:max-w-[500px] ">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all listings..."
            type="search"
            className="py-[10px] pl-4 pr-12 outline-0 border-2 border-primary-green rounded-[8px] text-[16px] text-[#67645F] font-normal w-full"
          />
          {/* Divider */}
          <div className="absolute top-1/2 right-14 transform -translate-y-1/2 w-[2px] bg-primary-green h-full"></div>
          {/* Search Icon */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#67645F] cursor-pointer">
            <FaSearch />
          </div>
        </div>

        <div className="flex w-full lg:w-fit flex-wrap gap-2 lg:gap-4 lg:items-center">
          <Link href="/dashboard/pro/create-listing">
            <button
              className="h-[45px] lg:h-[50px] w-full lg:w-fit rounded-[8px] bg-accent-red text-[16px] font-semibold text-secondary-black cursor-pointer
             hover:bg-transparent duration-500 ease-in-out border border-accent-red px-6"
            >
              Add Product
            </button>
          </Link>

          {/* <button className="flex w-full lg:w-fit items-center justify-center gap-x-2 border border-primary-green text-primary-green px-6 h-[45px] lg:h-[50px] rounded-lg text-[16px]">
            Export
            <Export />
          </button>
          <button className="flex w-full lg:w-fit items-center justify-center gap-x-2 bg-primary-green text-white px-6 h-[45px] lg:h-[50px] rounded-lg text-[16px]">
            Import
            <Import />
          </button> */}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block mt-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-accent-gray">
              <th className="text-secondary-black font-semibold text-[16px] pb-5">
                Product
              </th>
              <th className="text-secondary-black font-semibold text-[16px] pb-5">
                Approval Status
              </th>
              <th className="text-secondary-black font-semibold text-[16px] pb-5">
                Stock
              </th>
              <th className="text-secondary-black font-semibold text-[16px] pb-5">
                Price
              </th>
              <th className="text-secondary-black font-semibold text-[16px] pb-5">
                Cost
              </th>
              <th className="text-secondary-black font-semibold text-[16px] pb-5">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {isFetching
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <ProductRowSkeleton key={idx} />
                ))
              : allListings?.data?.map((p: productItem) => (
                  <tr
                    key={p?.id}
                    className="border-b border-accent-gray hover:bg-gray-50"
                  >
                    <td className="py-3 text-secondary-black font-semibold text-[14px]">
                      <div className="flex items-center gap-5">
                        <figure className="h-[80px] w-[100px] rounded-lg relative">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${p?.images[0]?.image}`}
                            alt={p?.product_name}
                            fill
                            unoptimized
                            className="h-full w-full rounded-lg"
                          />
                        </figure>

                        <span>{p?.product_name}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-4 py-2 rounded-full text-sm capitalize`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="text-secondary-black font-semibold text-[14px]">
                      {p?.out_of_stock
                        ? "Out of Stock"
                        : p?.unlimited_stock
                          ? "Unlimited stock"
                          : p?.product_quantity}
                    </td>

                    <td className="text-secondary-black font-semibold text-[14px]">
                      ${p.product_price.toFixed(2)}
                    </td>

                    <td className="text-secondary-black font-semibold text-[14px]">
                      ${Number(p?.cost)?.toFixed(2)}
                    </td>

                    <td className="relative">
                      <button
                        className="cursor-pointer"
                        onClick={() =>
                          setOpenMenu(openMenu === p.id ? null : p.id)
                        }
                      >
                        <FiMoreVertical />
                      </button>
                      {openMenu === p.id && (
                        <div
                          ref={menuRef}
                          className="product-menu absolute right-0 mt-2 bg-white border border-gray-400 rounded shadow-lg w-28 z-10"
                        >
                          <Link href={`/dashboard/pro/view-listing/${p.id}`}>
                            <button
                              onClick={() => setOpenMenu(null)}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                          </Link>

                          {/* <button
                            onClick={() => {
                              setProducts(products.filter(x => x.id !== p.id));
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                          >
                            Delete
                          </button> */}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden space-y-4 mt-6">
        {allListings?.data.map((p: productItem) => (
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
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${p.image}`}
                alt={p?.product_name}
                height={50}
                width={50}
                className="rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-secondary-black text-sm">
                  {p?.product_name}
                </h3>
                <p className="text-xs text-gray-500">SKU: {p?.sku}</p>
                <p className="text-xs text-gray-500">
                  Stock:{" "}
                  {p?.out_of_stock
                    ? "Out of Stock"
                    : p?.unlimited_stock
                      ? "Unlimited stock"
                      : p?.product_quantity}
                </p>
                <p className="text-xs text-gray-500">
                  Price: ${p.product_price.toFixed(2)}
                </p>

                <p className="text-xs text-gray-500">Approval: {p?.status}</p>

                <p className="text-xs text-gray-500">
                  Cost: ${Number(p?.cost)?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                className="p-1"
              >
                <FiMoreVertical />
              </button>
              {openMenu === p.id && (
                <div className="product-menu absolute right-0 mt-2 bg-white border rounded shadow-lg w-32 z-10">
                  <Link href={`/dashboard/pro/listing/edit-inventory/${p.id}`}>
                    <button
                      onClick={() => setOpenMenu(null)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                  </Link>
                  {/* <button
                    onClick={() => {
                      setProducts(products.filter(x => x.id !== p.id));
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button> */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
