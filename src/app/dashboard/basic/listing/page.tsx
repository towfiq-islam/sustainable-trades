"use client";

import React, { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import ProductPlaceholder from "../../../../Assets/tomato.png";
import { getallListings } from "@/Hooks/api/dashboard_api";
import { PuffLoader } from "react-spinners";

interface ProductType {
  id: number;
  product_name: string;
  product_price: number | string;
  images: { id: number; image: string }[];
  status?: string;
}

const parsePrice = (price: string | number) => {
  if (typeof price === "number") return price;
  return Number(price.toString().replace(/[^0-9.]/g, "")) || 0;
};

const Page = () => {
  const [sortBy, setSortBy] = useState("a-z");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data, isLoading } = getallListings();

  const products: ProductType[] = data?.data || [];

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let temp = [...products];

    // Status filter
    if (statusFilter !== "All") {
      temp = temp.filter(
        p => p.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sorting
    switch (sortBy) {
      case "a-z":
        temp.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case "z-a":
        temp.sort((a, b) => b.product_name.localeCompare(a.product_name));
        break;
      case "low-high":
        temp.sort(
          (a, b) => parsePrice(a.product_price) - parsePrice(b.product_price)
        );
        break;
      case "high-low":
        temp.sort(
          (a, b) => parsePrice(b.product_price) - parsePrice(a.product_price)
        );
        break;
    }

    return temp;
  }, [products, statusFilter, sortBy]);

  return (
    <div>
      <h2 className="text-[25px] md:text-[40px] font-lato font-semibold text-[#000]">
        Listings
      </h2>

      {/* Filters + Button */}
      <div className="flex flex-col gap-3.5 md:gap-0 md:flex-row justify-between mt-6">
        <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-6">
          <div className="w-full md:w-fit">
            <p className="text-[#13141D] text-[16px] font-semibold">
              Sort by :
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="p-2 md:p-4 rounded-[10px] border border-[#A7A39C] mt-2 w-full md:w-[190px] cursor-pointer"
            >
              <option value="a-z">Name: A - Z</option>
              <option value="z-a">Name: Z - A</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="w-full md:w-fit">
            <p className="text-[#13141D] text-[16px] font-semibold">
              Listing Status
            </p>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2 md:p-4 rounded-[10px] border border-[#A7A39C] mt-2 w-full md:w-[190px] cursor-pointer"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <Link
            href="/dashboard/basic/create-listing"
            className="h-[45px] md:h-[60px] rounded-[8px] bg-[#E48872] text-[16px] font-semibold text-[#13141D] cursor-pointer hover:bg-transparent duration-500 ease-in-out border border-[#E48872] w-full md:w-[190px] flex gap-x-2 justify-center items-center"
          >
            <FaPlus />
            Add New Listing
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <PuffLoader color="#274F45" size={100} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="mt-10 text-center text-lg">No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 xl:gap-6 mt-10">
          {filteredProducts.map(product => (
            <Link
              href={`/dashboard/basic/view-listing/view-details/${product.id}`}
            >
              <div
                key={product.id}
                className="relative border border-[#e5e5e5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 group cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-[250px]">
                  <Image
                    src={
                      product.images[0]?.image
                        ? `${process.env.NEXT_PUBLIC_SITE_URL}/${product.images[0].image}`
                        : ProductPlaceholder
                    }
                    alt={product.product_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <Link
                    href={`/dashboard/basic/view-listing/edit-listing/${product.id}`}
                  >
                    <button
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow cursor-pointer border border-[#274F45] 
                      opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 
                      transition-all duration-300 ease-in-out"
                    >
                      <FiEdit2 size={18} className="text-[#274F45]" />
                    </button>
                  </Link>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-[18px] md:text-[20px] font-medium text-[#13141D] truncate">
                    {product.product_name}
                  </h3>
                  <p className="text-base md:text-[20px] font-semibold text-[#13141D] mt-1">
                    ${product.product_price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
