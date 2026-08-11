"use client";
import {
  AddToCartSvg,
  DollarSvg,
  MinSvg,
  MyLocationSvg,
  MyMsgSvg,
  SignSvg,
} from "@/Components/Svg/SvgContainer";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useState } from "react";
import Modal from "@/Components/Common/Modal";
import { FaHeart, FaStar } from "react-icons/fa";
import { LuLoaderPinwheel } from "react-icons/lu";
import TradeOfferModal from "@/Components/Modals/TradeOfferModal";
import MessageToSellerModal from "@/Components/Modals/MessageToSellerModal";
import Link from "next/link";
import { useAddFavoriteMutation } from "@/redux/api/productApi";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { normalizeFulfillment } from "@/lib/fulfillment";
import { setBuyNowItem } from "@/redux/slices/checkoutSlice";
import { addToCart } from "@/redux/slices/cartSlice";

type descriptionItem = {
  id: number;
  is_favorite: boolean;
  product_name: string;
  product_price: string;
  description: string;
  reviews_avg_rating: string;
  distance_in_miles: number;
  shop_info_id: number;
  fulfillment: string;
  selling_option: string;
  unlimited_stock: boolean;
  out_of_stock: boolean;
  product_quantity: number;
  images: { image: string }[];
  shop: {
    id: number;
    user_id: number;
    shop_name: string;
    shop_image: string;
    user: {
      id: number;
      onboarded: boolean;
      membership: {
        membership_type: string;
      };
    };
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

const ProductDescription = ({ data }: descriptionProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [sellingOption, setSellingOption] = useState<boolean>(Boolean);

  // States
  const [id, setId] = useState<number | null>(null);
  const [productId, setProductId] = useState<number | null>(null);
  const [tradeOpen, setTradeOpen] = useState<boolean>(false);
  const [msgOpen, setMsgOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Mutations
  const [addFavoriteMutation, { isLoading: isPending }] =
    useAddFavoriteMutation();

  // Func for Increase & Decrease
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Func for add to favorite
  const handleAddFavorite = (product_id: any) => {
    if (!user) {
      return toast.error("Please login first to proceed");
    }

    addFavoriteMutation(product_id)
      .unwrap()
      .then(res => {
        toast.success(res?.message);
      })
      .catch(err => {
        toast.error(err?.data?.message);
      });
  };

  const handleAddToCart = () => {
    const payload = {
      vendor_id: data?.shop?.user?.id,
      shop_id: data?.shop?.id,
      shop_name: data?.shop?.shop_name,
      shop_image: data?.shop?.shop_image,

      products: [
        {
          id: data?.id,
          name: data?.product_name,
          image: data?.images?.[0]?.image,
          price: Number(data?.product_price),
          quantity: 1,
          fulfillment: normalizeFulfillment(data.fulfillment),
        },
      ],
    };

    dispatch(addToCart(payload));
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    const buyNowItem = {
      vendor_id: data?.shop?.user?.id,
      shop_id: data?.shop?.id,
      shop_name: data?.shop?.shop_name,
      shop_image: data?.shop?.shop_image,
      products: [
        {
          id: data?.id,
          name: data?.product_name,
          image: data?.images?.[0]?.image,
          price: Number(data?.product_price),
          quantity: 1,
          fulfillment: normalizeFulfillment(data.fulfillment),
        },
      ],
    };

    dispatch(setBuyNowItem(buyNowItem));
    router.push("/checkout?mode=buy-now&step=delivery-options");
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
      <div className="flex gap-5 justify-between items-start mb-5">
        {/* Product Name */}
        <h3 className="text-lg md:text-xl font-semibold text-secondary-black">
          {data?.product_name}
        </h3>

        {/* Add To Cart */}
        <button
          disabled={
            (!data?.unlimited_stock && data?.out_of_stock) ||
            (!data?.unlimited_stock && data?.product_quantity === 0) ||
            data?.selling_option === "trade/barter"
          }
          onClick={() => handleAddToCart()}
          className={`border border-primary-green rounded-lg px-4 py-2 enabled:hover:bg-primary-green enabled:hover:text-accent-white duration-500 transition-all shrink-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:border-gray-300 disabled:bg-gray-100 cursor-pointer`}
        >
          <p className="flex gap-2 items-center">
            <span>Add to Cart</span>
            <AddToCartSvg />
          </p>
        </button>
      </div>

      {/* Product Description */}
      <p className="text-primary-green md:text-lg lg:text-xl font-semibold mb-3">
        Product Description
      </p>
      <p className="text-secondary-gray text-sm md:text-base mb-5">
        {data?.description}
      </p>
      <div className="flex gap-3 items-center mb-2">
        {/* Shop Name */}
        <Link
          href={`/shop-details?view=${"customer"}&id=${
            data?.shop?.user_id
          }&listing_id=${data?.shop?.id}`}
          className="text-sm md:text-lg underline font-semibold text-secondary-black"
        >
          {data?.shop?.shop_name}
        </Link>

        {/* Shop Reviews */}
        <div className="flex gap-1 items-center">
          {Array.from({ length: +data?.reviews_avg_rating }).map((_, index) => (
            <FaStar
              key={index}
              className="text-primary-green text-xs md:text-sm"
            />
          ))}
        </div>
      </div>
      {/* Location */}
      <p className="flex gap-2 text-sm md:text-base items-center underline font-semibold text-secondary-black mb-5">
        <MyLocationSvg />
        <span>
          {data?.shop?.address?.display_my_address
            ? data?.shop?.address?.address_line_1
            : `${data?.shop?.address?.city}, ${data?.shop?.address?.state}`}
        </span>
      </p>

      {/* Selling Option & Fulfillment */}
      <div>
        <h3 className="md:text-lg text-primary-green font-semibold mb-2">
          This product is available for:
        </h3>

        <p className="mb-2 font-semibold text-sm md:text-base">
          {data?.fulfillment === "arrange_local_pickup"
            ? "Arrange Local Pickup"
            : data?.fulfillment === "shipping"
              ? "Shipping"
              : "Arrange Local Pickup and Shipping"}
        </p>

        {/* Selling Option */}
        <div>
          {data?.selling_option === "trade/barter" && (
            <p className="size-6 shrink-0 rounded-full bg-off-green grid place-items-center">
              <SignSvg />
            </p>
          )}
          {data?.selling_option === "for_sale" && (
            <p className="size-6 shrink-0 rounded-full bg-accent-red grid place-items-center">
              <DollarSvg />
            </p>
          )}
          {data?.selling_option === "for_sale_or_trade_barter" && (
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
      </div>

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
      <button
        disabled={!!user || data?.selling_option === "trade/barter"}
        onClick={() => handleBuyNow()}
        className="mb-3 md:mb-5 block w-full text-center duration-500 transition-all border-2 md:text-lg cursor-pointer py-2 md:py-3 bg-primary-green text-accent-white rounded-lg shadow enabled:hover:text-primary-green enabled:hover:bg-transparent font-medium border-primary-green disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Buy it now
      </button>

      {/* Trade btn */}
      <button
        disabled={
          user?.role === "customer" ||
          user?.shop_info?.user_id === data?.shop?.user_id
        }
        onClick={() => {
          if (!user) {
            toast.error("Please login first to proceed");
            router.push("/auth/login");
            return;
          }

          if (data?.selling_option === "for_sale") {
            setSellingOption(true);
          }

          setId(data?.shop_info_id);
          setProductId(data?.id);
          setTradeOpen(true);
        }}
        className="mb-3 md:mb-5 block w-full text-center duration-500 transition-all border-2 border-off-green md:text-lg cursor-pointer py-2 md:py-3 bg-off-green text-primary-green rounded-lg shadow hover:text-primary-green enabled:hover:bg-transparent font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Trade
      </button>

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
      <Modal
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
        className={`${sellingOption && "max-w-lg"}`}
      >
        <TradeOfferModal
          id={id}
          productId={productId}
          shopInfo={data}
          setTradeOpen={setTradeOpen}
          sellingOption={sellingOption}
          onClose={() => setTradeOpen(false)}
        />
      </Modal>

      <Modal open={msgOpen} onClose={() => setMsgOpen(false)}>
        <MessageToSellerModal id={id} shopInfo={data} setMsgOpen={setMsgOpen} />
      </Modal>
    </>
  );
};

export default ProductDescription;
