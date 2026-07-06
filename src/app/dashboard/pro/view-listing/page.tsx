"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { ProductSkeleton } from "@/Components/Loader/Loader";
import { useGetProductsQuery } from "@/redux/api/productApi";
const allStatus = ["pending", "confirmed", "shipped", "approved", "cancelled"];

interface ProductType {
  id: number;
  product_name: string;
  product_price: number | string;
  images: { id: number; image: string }[];
  status?: string;
}

const Page = () => {
  const [sortBy, setSortBy] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data: productList, isLoading } = useGetProductsQuery({
    status: statusFilter,
    short_by: sortBy,
  });

  return (
    <>
      <h2 className="text-[25px] md:text-[40px] font-lato font-semibold text-secondary-black">
        Listings
      </h2>

      {/* Filters  */}
      <div className="flex flex-col gap-3.5 md:gap-0 md:flex-row justify-between mt-6">
        <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-6">
          {/* Sort By */}
          <div className="w-full md:w-fit">
            <p className="text-secondary-black text-[16px] font-semibold">
              Sort by
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="p-2 md:p-4 rounded-[10px] border border-accent-gray mt-2 w-full md:w-[190px] cursor-pointer"
            >
              <option value="">All</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </select>
          </div>

          {/* Status */}
          <div className="w-full md:w-fit">
            <p className="text-secondary-black text-[16px] font-semibold">
              Listing Status
            </p>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2 md:p-4 rounded-[10px] border border-accent-gray mt-2 w-full md:w-[190px] cursor-pointer capitalize"
            >
              <option value="">All</option>
              {allStatus?.map(status => (
                <option value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <Link
          href="/dashboard/pro/create-listing"
          className="h-[45px] md:h-[60px] rounded-[8px] bg-accent-red text-[16px] font-semibold text-secondary-black cursor-pointer hover:bg-transparent duration-500 ease-in-out border border-accent-red w-full md:w-[190px] flex gap-x-2 justify-center items-center"
        >
          <FaPlus />
          Add New Listing
        </Link>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 xl:gap-6 mt-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : productList?.data?.length === 0 ? (
        <p className="mt-10 text-center text-lg">No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 xl:gap-6 mt-10">
          {productList?.data?.map((product: ProductType) => (
            <div
              key={product.id}
              className="relative border border-[#e5e5e5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 group"
            >
              {/* Image */}
              <div className="relative w-full h-[250px]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${product.images[0].image}`}
                  alt={product.product_name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <Link href={`/dashboard/pro/view-listing/${product.id}`}>
                  <button
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow cursor-pointer border border-primary-green 
                      opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 
                      transition-all duration-300 ease-in-out"
                  >
                    <FiEdit2 size={18} className="text-primary-green" />
                  </button>
                </Link>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-[18px] md:text-[20px] font-medium text-secondary-black truncate">
                  {product.product_name}
                </h3>
                <p className="text-base md:text-[20px] font-semibold text-secondary-black mt-1">
                  ${product.product_price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;
