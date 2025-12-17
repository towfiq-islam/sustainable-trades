"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { LuFileQuestion } from "react-icons/lu";
import { getAllProducts } from "@/Hooks/api/cms_api";
import Container from "@/Components/Common/Container";
import { ShopListSkeleton } from "@/Components/Loader/Loader";
import useAuth from "@/Hooks/useAuth";
import ProductMap from "./ProductMap";

const ProductLocation = () => {
  // Hook
  const { search, latitude, longitude } = useAuth();

  // States
  const [hoveredProduct, setHoveredProduct] = useState<any>(null);

  // Query
  const { data: allProducts, isLoading: productLoading } = getAllProducts(
    search,
    latitude,
    longitude
  );

  return (
    <section className="mt-10 mb-16">
      <Container>
        <div className="grid lg:grid-cols-2 gap-5 border border-gray-100 rounded-lg p-3">
          {/* Left - Product List */}
          {search ? (
            <div className="space-y-2 md:h-[550px] overflow-y-auto">
              {productLoading ? (
                Array.from({ length: 7 }).map((_, idx) => (
                  <ShopListSkeleton key={idx} />
                ))
              ) : allProducts?.data?.length === 0 || !allProducts ? (
                <div className="text-gray-700 font-semibold text-lg text-center flex justify-center flex-col gap-2 items-center h-full p-2 lg:p-8 bg-[#d4e2cb2f]">
                  <LuFileQuestion className="text-5xl text-gray-600" />
                  No Product Found
                </div>
              ) : (
                allProducts?.data?.map((product: any) => (
                  <Link
                    key={product?.id}
                    href={`/product-details/${product?.id}`}
                    className="flex flex-row gap-2.5 md:gap-5 md:items-center border-b last:border-b-0 border-gray-300 py-2 md:py-3 cursor-pointer hover:bg-green-50"
                    onMouseEnter={() => setHoveredProduct(product)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Product Image */}
                    <figure className="size-16 md:size-22 shrink-0 rounded-lg relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${product?.images[0]?.image}`}
                        alt="product_image"
                        fill
                        unoptimized
                        className="size-full object-cover rounded-lg"
                      />
                    </figure>

                    <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:items-center grow">
                      <div className="grow">
                        {/* Product Name */}
                        <h3 className="font-semibold text-primary-green text-sm md:text-base">
                          {product?.product_name}
                        </h3>

                        {/* Product Review */}
                        <div className="flex gap-1 items-center py-1">
                          {Array.from({
                            length: +product?.reviews_avg_rating,
                          }).map((_, idx) => (
                            <FaStar
                              key={idx}
                              className="text-primary-green text-xs md:text-sm"
                            />
                          ))}

                          {Array.from({
                            length: 5 - +product?.reviews_avg_rating,
                          }).map((_, index) => (
                            <FaRegStar
                              key={index}
                              className="text-primary-green text-xs md:text-sm"
                            />
                          ))}
                        </div>

                        {/* Distance */}
                        <p className="text-secondary-gray font-semibold text-xs md:text-sm mb-0.5">
                          {Number(product?.distance).toFixed(1)} mi
                        </p>

                        {/* Selling Option */}
                        <p className="text-secondary-gray text-xs md:text-sm">
                          {product?.selling_option}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : (
            <div className="text-gray-700 font-semibold text-lg text-center flex justify-center flex-col gap-2 items-center h-full p-2 lg:p-8 bg-[#d4e2cb2f]">
              <LuFileQuestion className="text-5xl text-gray-600" />
              No Product Found
            </div>
          )}

          {/* Right - Google Map */}
          <div className="md:h-[550px]">
            {allProducts?.data && allProducts?.data?.length > 0 ? (
              <ProductMap
                products={allProducts?.data}
                hoveredProduct={hoveredProduct}
                productLoading={productLoading}
              />
            ) : (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b54a1f5678ef%3A0x1234567890abcdef!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1691261744101!5m2!1sen!2sus"
                loading="lazy"
                className="h-full w-full border-0"
              ></iframe>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductLocation;
