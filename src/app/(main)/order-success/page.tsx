"use client";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import Container from "@/Components/Common/Container";
import Product from "@/Components/Common/Product";
import { ProductSkeleton } from "@/Components/Loader/Loader";
import { useSearchParams } from "next/navigation";
import ShopsMap from "@/Components/PageComponents/mainPages/shopPageComponents/ShopsMap";
import useAuth from "@/Hooks/useAuth";
import {
  useGetAllProductsUnderShopQuery,
  useGetMyFavoriteQuery,
} from "@/redux/api/productApi";
import { useGetOrderDetailsQuery } from "@/redux/api/orderApi";

export default function Page() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const order_id = Number(searchParams.get("order_id"));
  const shop_id = Number(searchParams.get("shop_id"));
  const { data: myFavorites, isLoading: isFavoriteLoading } =
    useGetMyFavoriteQuery(undefined, { skip: !user });
  const { data: singleOrder, isLoading } = useGetOrderDetailsQuery(order_id);
  const { data: products, isLoading: isShopLoading } =
    useGetAllProductsUnderShopQuery({
      id: shop_id,
    });

  const mapShops = singleOrder?.data?.shop
    ? [
        {
          id: singleOrder.data.shop.id,
          first_name: singleOrder.data.shop.user.first_name,
          last_name: singleOrder.data.shop.user.last_name,
          role: "vendor",
          shop_info: {
            id: singleOrder.data.shop.id,
            user_id: singleOrder.data.shop.user_id,
            shop_name: singleOrder.data.shop.shop_name,
            shop_image: singleOrder.data.shop.shop_image,
            address: {
              ...singleOrder.data.shop.address,
            },
          },
        },
      ]
    : [];

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
        <div className="rounded-lg bg-[#F5F5F5] px-6 py-5 shadow-sm">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left */}
            <div>
              <h3 className="mb-1 text-lg font-bold text-secondary-black">
                Order No.
              </h3>

              <Link
                href={`/dashboard/${user?.membership?.membership_type}/orders/${order_id}`}
                className="mb-5 text-sm font-medium text-secondary-black/60 block hover:underline"
              >
                {singleOrder?.data?.order_number}
              </Link>

              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-300">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-green text-white">
                  <FaCheck size={18} />
                </div>
                <p className="text-lg font-bold text-primary-green">
                  Your order has been processed!
                </p>
              </div>

              {/* Account holder */}
              <div className="flex gap-4 items-start mb-4 pb-4 border-b border-gray-300">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-off-green/50 text-primary-green">
                  {/* person icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#325b47] mb-1">
                    If you have a Sustainable Shopper account:
                  </p>
                  <p className="text-sm text-gray-600 leading-6">
                    Go to the Orders tab on your dashboard and find the order
                    and click View Details. You can track the status of your
                    order from there.
                  </p>
                </div>
              </div>

              {/* Guest shopper */}
              <div className="flex gap-4 items-start mb-6 pb-5 border-b border-gray-300">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-off-green/50 text-primary-green">
                  {/* email icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-5"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#325b47] mb-1">
                    If you were a guest shopper:
                  </p>
                  <p className="text-sm text-gray-600 leading-6">
                    Consider creating a free Sustainable Shopper account{" "}
                    <Link
                      href="/auth/register?role=customer"
                      className="underline font-medium"
                    >
                      here.
                    </Link>{" "}
                    If not, check your email for order details and updates.
                  </p>
                </div>
              </div>

              {/* Footer message */}
              <p className="text-gray-700 leading-7">
                Thank you for choosing to shop local.
                <br />
                <span className="flex gap-2 items-center">
                  Together we rise, together we thrive!
                  <FaHeart className="text-primary-green" />
                </span>
              </p>
            </div>

            {/* Right */}
            <div>
              <div className="overflow-hidden rounded-lg h-[300px] w-full">
                {mapShops.length > 0 && (
                  <ShopsMap
                    height="300px"
                    shops={mapShops}
                    shopLoading={isLoading}
                    shippingDistanceMiles={
                      singleOrder?.data?.shipping_distance_miles ?? null
                    }
                  />
                )}
              </div>

              {/* Progress */}
              <div className="mt-5 flex items-center justify-center">
                <div className="flex w-full max-w-sm items-center justify-between relative">
                  {/* Connector left */}
                  <div className="absolute top-5 left-[10%] w-[37%] border-t-2 border-dashed border-[#325b47]" />
                  {/* Connector right */}
                  <div className="absolute top-5 left-[53%] w-[37%] border-t-2 border-dashed border-gray-300" />

                  {/* Step 1 — Purchased */}
                  <div className="flex flex-col items-center z-10">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#325b47] text-white">
                      <FaCheck />
                    </div>
                    <span className="mt-2 text-xs text-gray-500">
                      Purchased
                    </span>
                  </div>

                  {/* Step 2 — Shipped */}
                  <div className="flex flex-col items-center z-10">
                    <div className="flex size-10 items-center justify-center rounded-full bg-off-green/50 text-primary-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                        <circle cx="5.5" cy="18.5" r="1.5" />
                        <circle cx="18.5" cy="18.5" r="1.5" />
                      </svg>
                    </div>
                    <span className="mt-2 text-xs text-gray-500">Shipped</span>
                  </div>

                  {/* Step 3 — Delivered */}
                  <div className="flex flex-col items-center z-10">
                    <div className="size-10 rounded-full bg-off-green/70" />
                    <span className="mt-2 text-xs text-gray-500">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Items */}
        {user && (
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
        )}

        {/* More From Shop */}
        <div className="mt-14">
          <h2 className="text-xl font-semibold">More From This Shop</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10 mt-5">
            {isShopLoading ? (
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
