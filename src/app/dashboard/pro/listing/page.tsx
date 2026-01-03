"use client";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { getallListings } from "@/Hooks/api/dashboard_api";
import {
  statusColorsinventory,
  visibilityColors,
} from "@/Components/Data/data";
import { ProductRowSkeleton } from "@/Components/Loader/Loader";

type Product = {
  id: number;
  name: string;
  status: "Approved" | "Pending" | "Denied";
  sku: string;
  stock: number;
  price: number;
  cost: number;
  visibility: "Active" | "Inactive";
  image: string | StaticImageData;
};

export default function Page() {
  const [search, setSearch] = useState("");
  const { data: allListings, isLoading } = getallListings();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    if (allListings?.data) {
      const mappedProducts: Product[] = allListings.data.map((item: any) => ({
        id: item.id,
        name: item.product_name,
        status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as
          | "Approved"
          | "Pending"
          | "Denied",
        sku: `SKU-${item.id}`,
        stock: item.product_quantity,
        price: item.product_price,
        cost: parseFloat(item.cost),
        visibility: "Active",
        image:
          item.images && item.images.length > 0 ? item.images[0].image : "",
      }));
      setProducts(mappedProducts);
    }
  }, [allListings]);

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
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
            className="py-[10px] pl-4 pr-12 outline-0 border-2 border-[#274F45] rounded-[8px] text-[16px] text-[#67645F] font-normal w-full"
          />
          {/* Divider */}
          <div className="absolute top-1/2 right-14 transform -translate-y-1/2 w-[2px] bg-[#274F45] h-full"></div>
          {/* Search Icon */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#67645F] cursor-pointer">
            <FaSearch />
          </div>
        </div>

        <div className="flex w-full lg:w-fit flex-wrap gap-2 lg:gap-4 lg:items-center">
          <Link href="/dashboard/pro/addnew-listing">
            <button
              className="h-[45px] lg:h-[50px] w-full lg:w-fit rounded-[8px] bg-[#E48872] text-[16px] font-semibold text-[#13141D] cursor-pointer
             hover:bg-transparent duration-500 ease-in-out border border-[#E48872] px-6"
            >
              Add Product
            </button>
          </Link>

          {/* <button className="flex w-full lg:w-fit items-center justify-center gap-x-2 border border-[#274F45] text-[#274F45] px-6 h-[45px] lg:h-[50px] rounded-lg text-[16px]">
            Export
            <Export />
          </button>
          <button className="flex w-full lg:w-fit items-center justify-center gap-x-2 bg-[#274F45] text-white px-6 h-[45px] lg:h-[50px] rounded-lg text-[16px]">
            Import
            <Import />
          </button> */}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block mt-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-[#A7A39C]">
              <th className="text-[#13141D] font-semibold text-[16px] pb-5">
                Product
              </th>
              <th className="text-[#13141D] font-semibold text-[16px] pb-5">
                Approval Status
              </th>
              <th className="text-[#13141D] font-semibold text-[16px] pb-5">
                SKU
              </th>
              <th className="text-[#13141D] font-semibold text-[16px] pb-5">
                Stock
              </th>
              <th className="text-[#13141D] font-semibold text-[16px] pb-5">
                Price
              </th>
              <th className="text-[#13141D] font-semibold text-[16px] pb-5">
                Cost
              </th>
              <th className="text-[#13141D] font-semibold text-[16px] pb-5">
                Visibility
              </th>
              <th />
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <ProductRowSkeleton key={idx} />
                ))
              : filteredProducts?.map(p => (
                  <tr
                    key={p.id}
                    className="border-b border-[#A7A39C] hover:bg-gray-50"
                  >
                    <td className="py-3 text-[#13141D] font-semibold text-[14px]">
                      <div className="flex items-center gap-5">
                        <figure className="h-[80px] w-[100px] rounded-lg relative">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${p.image}`}
                            alt={p.name}
                            fill
                            unoptimized
                            className="h-full w-full rounded-lg"
                          />
                        </figure>

                        <span>{p?.name}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-4 py-2 rounded-full text-sm ${
                          statusColorsinventory[p.status]
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="text-[#13141D] font-semibold text-[14px]">
                      {p.sku}
                    </td>
                    <td className="text-[#13141D] font-semibold text-[14px]">
                      {p.stock}
                    </td>
                    <td className="text-[#13141D] font-semibold text-[14px]">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="text-[#13141D] font-semibold text-[14px]">
                      ${p.cost.toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-2 rounded-full text-sm ${
                          visibilityColors[p.visibility]
                        }`}
                      >
                        {p.visibility}
                      </span>
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

                          <button
                            onClick={() => {
                              setProducts(products.filter(x => x.id !== p.id));
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                          >
                            Delete
                          </button>
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
        {filteredProducts.map(p => (
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
                alt={p.name}
                height={50}
                width={50}
                className="rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-[#13141D] text-sm">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                <p className="text-xs text-gray-500">Stock: {p.stock}</p>
                <p className="text-xs text-gray-500">
                  Price: ${p.price.toFixed(2)}
                </p>

                <p className="text-xs text-gray-500">Approval: {p.status}</p>

                <p className="text-xs text-gray-500">Cost: {p.cost}</p>

                <p className="text-xs text-gray-500">
                  Visibility: {p.visibility}
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
                  <button
                    onClick={() => {
                      setProducts(products.filter(x => x.id !== p.id));
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
