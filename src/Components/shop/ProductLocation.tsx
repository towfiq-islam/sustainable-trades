"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { LuFileQuestion } from "react-icons/lu";
import Container from "@/Components/Common/Container";
import { ShopListSkeleton } from "@/Components/Loader/Loader";
import useAuth from "@/Hooks/useAuth";
import dynamic from "next/dynamic";

const ProductMap = dynamic(() => import("./ProductMap"), { ssr: false });
import { DollarSvg, SignSvg } from "@/Components/Svg/SvgContainer";
import { useGetAllProductsQuery } from "@/redux/api/productApi";

const ProductLocation = () => {
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const { search, latitude, longitude } = useAuth();
  const [hoveredProduct, setHoveredProduct] = useState<any>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data: allProducts,
    isLoading: productLoading,
    isFetching,
  } = useGetAllProductsQuery({
    search,
    lat: latitude,
    lng: longitude,
    page,
    per_page: 5,
  });

  // Reset accumulated list whenever the search / location changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [search, latitude, longitude]);

  // Append the newly fetched page onto the accumulated list
  useEffect(() => {
    if (!allProducts?.data?.data) return;

    setProducts(prev => {
      if (page === 1) return allProducts.data.data;

      const existingIds = new Set(prev.map((p: any) => p.id));
      const newItems = allProducts.data.data.filter(
        (p: any) => !existingIds.has(p.id),
      );
      return [...prev, ...newItems];
    });
  }, [allProducts, page]);

  const hasMore = Boolean(allProducts?.data?.next_page_url);

  // Observe the sentinel to trigger loading the next page
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isFetching) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 },
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, isFetching, products]);

  return (
    <section className="mt-5 md:mt-10 mb-10 xl:mb-16">
      <Container>
        <div className="grid lg:grid-cols-2 gap-5 border border-gray-100 rounded-lg p-3">
          {/* Left - Product List */}
          {search ? (
            <div className="space-y-1 xl:space-y-2 h-[400px] md:h-[450px] xl:h-[550px] overflow-y-auto">
              {productLoading && page === 1 ? (
                Array.from({ length: 7 }).map((_, idx) => (
                  <ShopListSkeleton key={idx} />
                ))
              ) : products.length === 0 ? (
                <div className="text-gray-700 font-semibold text-lg text-center flex justify-center flex-col gap-2 items-center h-full p-2 lg:p-8 bg-[#d4e2cb2f]">
                  <LuFileQuestion className="text-5xl text-gray-600" />
                  No Product Found
                </div>
              ) : (
                <>
                  {products.map((product: any) => (
                    <Link
                      key={product?.id}
                      href={`/product-details/${product?.id}`}
                      className="flex flex-row gap-4 xl:gap-5 md:items-center border-b last:border-b-0 border-gray-300 py-2 xl:py-3 cursor-pointer hover:bg-green-50"
                      onMouseEnter={() => setHoveredProduct(product)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* Product Image */}
                      <figure className="size-20 xl:size-24 shrink-0 rounded-lg relative">
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
                          <h3 className="font-semibold text-primary-green text-sm xl:text-base">
                            {product?.product_name}
                          </h3>

                          {/* Product Review */}
                          <div className="flex gap-1 items-center py-1">
                            {Array.from({
                              length: +product?.reviews_avg_rating,
                            }).map((_, idx) => (
                              <FaStar
                                key={idx}
                                className="text-primary-green text-xs xl:text-sm"
                              />
                            ))}

                            {Array.from({
                              length: 5 - +product?.reviews_avg_rating,
                            }).map((_, index) => (
                              <FaRegStar
                                key={index}
                                className="text-primary-green text-xs xl:text-sm"
                              />
                            ))}
                          </div>

                          {/* Distance */}
                          <p className="text-secondary-gray font-semibold text-xs xl:text-sm mb-0.5">
                            {Number(product?.distance).toFixed(1)} mi
                          </p>

                          {/* Selling Option */}
                          <div className="text-secondary-gray text-xs md:text-sm mt-2">
                            <div>
                              {product?.selling_option === "trade/barter" && (
                                <p className="size-5.5 shrink-0 rounded-full bg-off-green grid place-items-center">
                                  <SignSvg />
                                </p>
                              )}
                              {product?.selling_option === "for_sale" && (
                                <p className="size-5.5 shrink-0 rounded-full bg-accent-red grid place-items-center">
                                  <DollarSvg />
                                </p>
                              )}
                              {product?.selling_option ===
                                "for_sale_or_trade_barter" && (
                                <div className="flex gap-2 items-center">
                                  <p className="size-5.5 shrink-0 rounded-full bg-accent-red grid place-items-center">
                                    <DollarSvg />
                                  </p>
                                  <p className="size-5.5 shrink-0 rounded-full bg-off-green grid place-items-center">
                                    <SignSvg />
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Sentinel that triggers loading the next page */}
                  {hasMore && (
                    <div ref={sentinelRef} className="py-4">
                      {isFetching && <ShopListSkeleton />}
                    </div>
                  )}

                  {!hasMore && products.length > 0 && (
                    <p className="text-center text-secondary-gray text-sm py-4">
                      No more products
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-700 font-semibold xl:text-lg text-center flex justify-center flex-col gap-2 items-center h-full p-2 lg:p-8 bg-[#d4e2cb2f]">
              <LuFileQuestion className="text-4xl xl:text-5xl text-gray-600" />
              No Product Found
            </div>
          )}

          {/* Right - Google Map */}
          <div className="h-[350px] md:h-[450px] xl:h-[550px] overflow-hidden rounded">
            {products.length > 0 ? (
              <ProductMap
                products={products}
                hoveredProduct={hoveredProduct}
                productLoading={productLoading && page === 1}
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
