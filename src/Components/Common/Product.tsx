"use client";
import "swiper/css";
import Link from "next/link";
import Image from "next/image";
import "swiper/css/pagination";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { FaHeart } from "react-icons/fa";
import { Pagination } from "swiper/modules";
import { CgSpinnerTwo } from "react-icons/cg";
import { LuLoaderPinwheel } from "react-icons/lu";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  AddToCartSvg,
  DollarSvg,
  LocationTwoSvg,
  SignSvg,
} from "../Svg/SvgContainer";
import { useAddFavoriteMutation } from "@/redux/api/productApi";
import { useAddToCartMutation } from "@/redux/api/cartApi";

type imageItem = {
  id: number;
  image: string;
};

type ProductData = {
  id?: number;
  distance: number;
  images?: imageItem[];
  product_name?: string;
  product_price?: string;
  is_favorite?: boolean;
  selling_option?: string;
  product_quantity?: number;
  unlimited_stock?: boolean;
  out_of_stock?: boolean;
};

type ProductProps = {
  product: ProductData;
  is_feathered?: boolean;
  has_wishlist?: boolean;
  has_cart?: boolean;
  has_slider?: boolean;
  isMiles?: boolean;
};

const Product = ({
  product,
  is_feathered = false,
  has_wishlist = true,
  has_cart = true,
  isMiles = false,
}: ProductProps) => {
  const { user } = useAuth();
  const [addFavoriteMutation, { isLoading: isPending }] =
    useAddFavoriteMutation();
  const [addToCartMutation, { isLoading: addCardPending }] =
    useAddToCartMutation();

  // Func for add to favorite
  const handleAddFavorite = (product_id: any) => {
    if (!user) {
      return toast.error("Please login first to proceed");
    }
    try {
      const res: any = addFavoriteMutation(product_id).unwrap();
      if (res?.success) {
        toast.success(res?.message);
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };
  // Func for add to cart
  const handleAddToCart = () => {
    if (!user) {
      return toast.error("Please login first to proceed");
    }

    addToCartMutation({ id: product?.id, data: { quantity: 1 } })
      .unwrap()
      .then(res => {
        toast.success(res?.message);
      })
      .catch(err => {
        toast.error(err?.data?.message);
      });
  };

  return (
    <div className="rounded-t-lg relative">
      {/* Wishlist btn */}
      {has_wishlist && (
        <button
          onClick={() => handleAddFavorite(product?.id)}
          className="absolute z-40 top-4 right-5 size-9 rounded-full border border-gray-300 grid place-items-center bg-primary-green cursor-pointer"
        >
          {isPending ? (
            <LuLoaderPinwheel className="animate-spin text-white" />
          ) : (
            <FaHeart
              className={`${
                product?.is_favorite ? "text-accent-red" : "text-accent-white"
              }`}
            />
          )}
        </button>
      )}

      {/* Stock Info */}
      {product?.unlimited_stock ? (
        <button className="absolute top-3 left-3 shadow-lg font-medium px-3 py-1 rounded-full bg-primary-green text-white z-10 text-sm">
          In Stock
        </button>
      ) : !product?.out_of_stock && Number(product?.product_quantity) > 0 ? (
        <button className="absolute top-3 left-3 shadow-lg font-medium px-3 py-1 rounded-full bg-primary-green text-white z-10 text-sm">
          In Stock
        </button>
      ) : (
        <button className="absolute top-3 left-3 shadow-lg font-medium px-3 py-1 rounded-full bg-accent-red text-white z-10 text-sm">
          Out of Stock
        </button>
      )}

      {/* Product Image Gallery */}
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        pagination={{ clickable: true }}
        className="product_swiper rounded-lg"
      >
        {product?.images?.map((img, idx) => (
          <SwiperSlide key={idx}>
            <figure
              className={`w-full rounded-lg border border-gray-100 relative ${
                is_feathered ? "h-[350px]" : "h-[270px]"
              }`}
            >
              <div className="absolute inset-0 bg-black/20 rounded-lg" />
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${img?.image}`}
                alt="product image"
                fill
                unoptimized
                className="w-full h-full object-cover rounded-lg"
              />
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Product Name */}
      <Link
        href={`/product-details/${product?.id}`}
        className="text-primary-green md:text-lg sm:text-base text-sm lg:text-xl font-semibold py-3 truncate hover:underline block"
      >
        {product?.product_name}
      </Link>

      <div className="flex gap-2 items-center justify-between mb-3">
        {/* Selling Option */}
        <div>
          {product?.selling_option === "trade/barter" && (
            <p className="size-6 shrink-0 rounded-full bg-off-green grid place-items-center">
              <SignSvg />
            </p>
          )}
          {product?.selling_option === "for_sale" && (
            <p className="size-6 shrink-0 rounded-full bg-accent-red grid place-items-center">
              <DollarSvg />
            </p>
          )}
          {product?.selling_option === "for_sale_or_trade_barter" && (
            <div className="flex gap-2 items-center">
              <p className="size-6 shrink-0 rounded-full bg-accent-red grid place-items-center">
                <DollarSvg />
              </p>
              <p className="size-6 shrink-0 rounded-full bg-off-green grid place-items-center">
                <SignSvg />
              </p>
            </div>
          )}
        </div>

        {/* Distance */}
        {isMiles && (
          <p className="font-semibold text-sm text-secondary-gray flex gap-1.5 items-center">
            <LocationTwoSvg />
            {product?.distance.toFixed(1)} miles
          </p>
        )}
      </div>

      <div className="flex  justify-between mt-2 items-center">
        {/* Product Price */}
        <p className="md:text-lg sm:text-base text-sm lg:text-xl font-semibold text-secondary-black">
          ${product?.product_price}
        </p>

        {/* Cart btn */}
        {has_cart && (
          <button
            onClick={handleAddToCart}
            disabled={
              addCardPending ||
              product?.selling_option === "trade/barter" ||
              (!product?.unlimited_stock && product?.out_of_stock) ||
              (!product?.unlimited_stock && product?.product_quantity === 0)
            }
            className={`flex gap-2 items-center px-3 py-1.5 rounded-[5px] border font-semibold text-secondary-gray duration-500 transition-all sm:text-base text-sm ${
              addCardPending ||
              product?.selling_option === "trade/barter" ||
              (!product?.unlimited_stock && product?.out_of_stock) ||
              (!product?.unlimited_stock && product?.product_quantity === 0)
                ? "cursor-not-allowed opacity-75 border-gray-400"
                : "cursor-pointer border-secondary-gray hover:bg-primary-green hover:text-accent-white hover:scale-95"
            }
              `}
          >
            {addCardPending ? (
              <p className="flex gap-2 items-center justify-center">
                <CgSpinnerTwo className="animate-spin text-xl" />
                <span>Adding...</span>
              </p>
            ) : (
              <p className="flex gap-2 items-center">
                <span>{user ? "Add to Cart" : "Buy Now"}</span>
                <AddToCartSvg />
              </p>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
