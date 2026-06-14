"use client";
import Link from "next/link";
import Container from "@/Components/Common/Container";
import { FaCheck } from "react-icons/fa";
import { getAllFollowList, getMyOrderDetails } from "@/Hooks/api/dashboard_api";
import Product from "@/Components/Common/Product";
import { ProductSkeleton } from "@/Components/Loader/Loader";
import { useSearchParams } from "next/navigation";
import { getAllListings } from "@/Hooks/api/cms_api";

export default function Page() {
  const searchParams = useSearchParams();
  const order_id = Number(searchParams.get("order_id"));
  const shop_id = Number(searchParams.get("shop_id"));
  const { data: myFavorites, isLoading: isFavoriteLoading } =
    getAllFollowList();
  const { data: singleOrder, isLoading } = getMyOrderDetails(order_id);
  const { data: products, isLoading: shopLoading } = getAllListings(shop_id);
  console.log(singleOrder?.data);

  return (
    <section className="py-12">
      <Container>
        {/* Header */}
        <div className="mb-6 flex gap-3 items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#222]">
            Thank You For Your Purchase.
          </h1>

          <Link
            href="/shop"
            className="rounded-md bg-primary-green cursor-pointer px-5 py-3 font-medium text-white hover:scale-105 duration-300 transition-transform"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg bg-[#F5F5F5] px-10 py-7 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left */}
            <div>
              <h3 className="mb-1.5 text-lg text-secondary-black/70 font-semibold">
                Order No.
              </h3>

              <p className="mb-5 font-medium text-secondary-black/70">
                {singleOrder?.data?.order_number}
              </p>

              <p className="max-w-md leading-7 text-gray-700">
                Your order has been processed! The seller will provide updates
                as they become available. For any questions or assistance,
                please contact the seller directly. If you're a member, check
                your messages. If you're a guest shopper, check your email. We
                sincerely appreciate your support. Thank you for choosing to
                shop local—together we rise, together we thrive!
              </p>
            </div>

            {/* Right */}
            <div>
              <div className="overflow-hidden h-[250px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b54a1f5678ef%3A0x1234567890abcdef!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1691261744101!5m2!1sen!2sus"
                  loading="lazy"
                  className="h-full w-4/5 mx-auto border-0 rounded-lg"
                ></iframe>
              </div>

              {/* Progress */}
              <div className="mt-5 flex items-center justify-center">
                <div className="flex w-full max-w-xs items-center justify-between relative">
                  {/* Connector */}
                  <div
                    className={`absolute top-5 left-0 w-full border-t border-dashed border-primary-green}`}
                  />

                  {/* Step 1 */}
                  <div className="flex flex-col items-start z-10">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#325b47] text-white">
                      <FaCheck />
                    </div>
                    <span className="mt-2 text-xs text-gray-500">Purchase</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center z-10">
                    <div className="size-8 rounded-full bg-[#6d8f80]" />
                    <span className="mt-2 text-xs text-gray-500">
                      Processed
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-end z-10">
                    <div className="size-8 rounded-full bg-[#b5d1c2]" />
                    <span className="mt-2 text-xs text-gray-500">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Items */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Your Saved Items</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10 mt-5">
            {isFavoriteLoading ? (
              [1, 2, 3, 4].map((_, index) => <ProductSkeleton key={index} />)
            ) : myFavorites?.data?.length > 0 ? (
              myFavorites?.data?.slice(0, 4)?.map((item: any) => (
                <Product
                  key={item?.id}
                  is_feathered={false}
                  product={
                    {
                      id: item?.product?.id,
                      product_name: item?.product?.product_name,
                      product_quantity: item?.product?.product_quantity,
                      product_price: item?.product?.product_price,
                      out_of_stock: item?.product?.out_of_stock,
                      unlimited_stock: item?.product?.unlimited_stock,
                      is_favorite: item?.product?.is_favorite,
                      selling_option: item?.product?.selling_option,
                      images: item?.product?.images || [],
                    } as any
                  }
                />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No products found in your wishlist.
              </p>
            )}
          </div>

          {/* <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-1 text-sm font-medium">
              View all
              <ChevronDown size={16} />
            </button>
          </div> */}
        </div>

        {/* More From Shop */}
        <div className="mt-14">
          <h2 className="text-xl font-semibold">More From This Shop</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10 mt-5">
            {shopLoading ? (
              [1, 2, 3, 4].map((_, index) => <ProductSkeleton key={index} />)
            ) : products?.data?.data?.length > 0 ? (
              products?.data?.data?.map((item: any) => (
                <Product
                  key={item?.id}
                  is_feathered={false}
                  product={
                    {
                      id: item?.id,
                      product_name: item?.product_name,
                      product_quantity: item?.product_quantity,
                      product_price: item?.product_price,
                      out_of_stock: item?.out_of_stock,
                      unlimited_stock: item?.unlimited_stock,
                      is_favorite: item?.is_favorite,
                      selling_option: item?.selling_option,
                      images: item?.images || [],
                    } as any
                  }
                />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No products found.
              </p>
            )}
          </div>

          {/* <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-1 text-sm font-medium">
              View all
              <ChevronDown size={16} />
            </button>
          </div> */}
        </div>
      </Container>
    </section>
  );
}
