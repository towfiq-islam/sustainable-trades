"use client";
import {
  AddToCartSvg,
  MinSvg,
  MyLocationSvg,
  MyMsgSvg,
} from "@/Components/Svg/SvgContainer";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import React, { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import Modal from "@/Components/Common/Modal";
import { FaHeart, FaStar } from "react-icons/fa";
import { LuLoaderPinwheel } from "react-icons/lu";
import { useAddFavorite, useAddToCart } from "@/Hooks/api/cms_api";
import TradeOfferModal from "@/Components/Modals/TradeOfferModal";
import MessageToSellerModal from "@/Components/Modals/MessageToSellerModal";
import Link from "next/link";

type descriptionItem = {
  id: number;
  is_favorite: boolean;
  product_name: string;
  product_price: string;
  description: string;
  selling_option: string;
  reviews_avg_rating: string;
  distance_in_miles: number;
  shop_info_id: number;
  shop: {
    id: number;
    user_id: number;
    shop_name: string;
    address: {
      address_line_1: string;
      address_10_mile: string;
      display_my_address: string;
      city: string;
      state: string;
    };
  };
  category: {
    name: string;
  };
};

interface descriptionProps {
  data: descriptionItem;
}

const handleBuyNow = () => {
  toast.error("Development is ongoing");
};

const ProductDescription = ({ data }: descriptionProps) => {
  // Hook
  const { user } = useAuth();

  // States
  const [id, setId] = useState<number | null>(null);
  const [productId, setProductId] = useState<number | null>(null);
  const [tradeOpen, setTradeOpen] = useState<boolean>(false);
  const [msgOpen, setMsgOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Mutations
  const { mutate: addFavoriteMutation, isPending } = useAddFavorite();
  const { mutate: addToCartMutation, isPending: addCardPending } = useAddToCart(
    data?.id
  );

  // Func for Increase & Decrease
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Func for add to favorite
  const handleAddFavorite = (product_id: any) => {
    if (!user) {
      return toast.error("Please login first to proceed");
    }
    addFavoriteMutation({ endpoint: `/api/add-favorites/${product_id}` });
  };

  // Func for add to cart
  const handleAddToCart = () => {
    if (!user) {
      return toast.error("Please login first to proceed");
    }
    addToCartMutation({ quantity: quantity });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        {/* Product Category */}
        <h2 className="text-primary-green text-lg md:text-xl font-semibold">
          {data?.category?.name}
        </h2>

        {/* Wishlist */}
        <button
          onClick={() => handleAddFavorite(data?.id)}
          className="cursor-pointer"
        >
          {isPending ? (
            <LuLoaderPinwheel className="animate-spin text-primary-green" />
          ) : (
            <FaHeart
              className={`${
                data?.is_favorite ? "text-accent-red" : "text-primary-green"
              }`}
            />
          )}
        </button>
      </div>

      <div className="flex justify-between items-center mb-5">
        {/* Product Name */}
        <h3 className="text-xl md:text-2xl font-semibold text-secondary-black">
          {data?.product_name}
        </h3>

        {/* Add To Cart */}
        <button
          disabled={addCardPending}
          onClick={user ? handleAddToCart : handleBuyNow}
          className={`border border-primary-green rounded-lg px-4 py-2 hover:bg-primary-green hover:text-accent-white duration-500 transition-all ${
            addCardPending ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {addCardPending ? (
            <p className="flex gap-2 items-center justify-center">
              <CgSpinnerTwo className="animate-spin text-lg md:text-xl" />
              <span>Adding...</span>
            </p>
          ) : (
            <p className="flex gap-2 items-center">
              <span>{user ? "Add to Cart" : "Buy Now"}</span>
              <AddToCartSvg />
            </p>
          )}
        </button>
      </div>

      {/* Product Description */}
      <p className="text-primary-green text-lg md:text-xl font-semibold mb-3">
        Product Description
      </p>

      <p className="text-secondary-gray mb-5">{data?.description}</p>

      <div className="flex gap-3 items-center mb-2">
        {/* Shop Name */}
        <Link
          href={`/shop-details?view=${"customer"}&id=${
            data?.shop?.user_id
          }&listing_id=${data?.shop?.id}`}
          className="md:text-lg underline font-semibold text-secondary-black"
        >
          {data?.shop?.shop_name}
        </Link>

        {/* Shop Reviews */}
        <div className="flex gap-1 items-center">
          {Array.from({ length: +data?.reviews_avg_rating }).map((_, index) => (
            <FaStar key={index} className="text-primary-green text-sm" />
          ))}
        </div>
      </div>

      {/* Location */}
      <p className="flex gap-2 items-center underline font-semibold text-secondary-black mb-10">
        <MyLocationSvg />
        <span>
          {data?.shop?.address?.display_my_address
            ? data?.shop?.address?.address_line_1
            : `${data?.shop?.address?.city}, ${data?.shop?.address?.state}`}
        </span>
      </p>

      <div className="flex items-center justify-between mb-7">
        {/* Price */}
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          ${data?.product_price}
        </p>

        {/* Quantity */}
        <div className="flex gap-3 items-center border rounded-lg px-4 md:px-7 py-2 font-semibold border-primary-green">
          <button onClick={handleDecrease} className="cursor-pointer">
            <MinSvg />
          </button>
          <p className="text-secondary-gray">Qty:</p>
          <p className="text-secondary-gray">{quantity}</p>
          <button onClick={handleIncrease} className="cursor-pointer">
            +
          </button>
        </div>
      </div>

      {/* Buy btn */}
      <button className="mb-3 md:mb-5 block w-full text-center duration-500 transition-all border-2 md:text-lg cursor-pointer py-2 md:py-3 bg-primary-green text-accent-white rounded-lg shadow hover:text-primary-green hover:bg-transparent font-semibold border-primary-green">
        Buy it now
      </button>

      {/* Trade btn */}
      {user?.role !== "customer" &&
        data?.selling_option !== "For Sale" &&
        user?.shop_info?.user_id !== data?.shop?.user_id && (
          <button
            onClick={() => {
              if (!user) {
                return toast.error("Please login first to proceed");
              }
              setId(data?.shop_info_id);
              setProductId(data?.id);
              setTradeOpen(true);
            }}
            className="mb-3 md:mb-5 block w-full text-center duration-500 transition-all border-2 border-[#D4E2CB] md:text-lg cursor-pointer py-2 md:py-3 bg-[#D4E2CB] text-primary-green rounded-lg shadow hover:text-primary-green hover:bg-transparent font-semibold"
          >
            Trade
          </button>
        )}

      {/* Message btn */}
      {user?.shop_info?.user_id !== data?.shop?.user_id && (
        <button
          onClick={() => {
            if (!user) {
              return toast.error("Please login first to proceed");
            }
            setId(data?.shop?.user_id);
            setProductId(data?.id);
            setMsgOpen(true);
          }}
          className="mb-5 w-full text-center duration-500 transition-all border-2 md:text-lg cursor-pointer py-2 md:py-3 text-primary-green rounded-lg shadow hover:text-accent-white hover:bg-primary-green font-semibold border-primary-green flex gap-2 items-center justify-center"
        >
          <MyMsgSvg />
          <span> Message Seller</span>
        </button>
      )}

      {/* Modals */}
      <Modal open={tradeOpen} onClose={() => setTradeOpen(false)}>
        <TradeOfferModal
          id={id}
          productId={productId}
          shopInfo={data}
          setTradeOpen={setTradeOpen}
        />
      </Modal>

      <Modal open={msgOpen} onClose={() => setMsgOpen(false)}>
        <MessageToSellerModal id={id} shopInfo={data} setMsgOpen={setMsgOpen} />
      </Modal>
    </>
  );
};

export default ProductDescription;
