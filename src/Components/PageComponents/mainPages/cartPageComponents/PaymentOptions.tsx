"use client";
import CartItem from "./CartItem";
import { TiDelete } from "react-icons/ti";
import { CgSpinnerTwo } from "react-icons/cg";
import { CartItemSkeleton } from "@/Components/Loader/Loader";
import {
  useClearCartMutation,
  useGetProductCartQuery,
} from "@/redux/api/cartApi";
import emptyAnimation from "@/Assets/cart.json";
import Lottie from "lottie-react";

const PaymentOptions = () => {
  const { data: cartData, isLoading } = useGetProductCartQuery();
  const [clearCartMutation, { isLoading: isPending }] = useClearCartMutation();

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="section_sub_title !mb-0">
          {cartData?.data?.total_cart_items
            ? `${cartData?.data?.total_cart_items} Items In Your Cart`
            : "Cart is empty"}
        </h3>

        {cartData?.data?.total_cart_items && (
          <p className="text-lg text-secondary-black font-semibold">
            Subtotal: ${cartData?.data?.total_price?.toFixed(2)}
          </p>
        )}
      </div>

      <p className="text-secondary-gray mb-5">
        Shipping and sales tax will be added at checkout if applicable.
      </p>

      {cartData?.data?.length > 0 && (
        <button
          disabled={isPending}
          onClick={() => clearCartMutation().unwrap()}
          className={`px-3 py-1.5 text-sm rounded-full font-semibold bg-primary-red text-white flex gap-1 items-center ${
            isPending ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isPending ? (
            <span className="flex gap-2 items-center justify-center">
              <CgSpinnerTwo className="animate-spin" />
              <span>Clearing...</span>
            </span>
          ) : (
            <span className="flex gap-1 items-center">
              <TiDelete className="text-lg" />
              Clear Cart
            </span>
          )}
        </button>
      )}

      <div className="space-y-7">
        {isLoading ? (
          [1, 2].map((_, idx) => <CartItemSkeleton key={idx} />)
        ) : !cartData?.data || cartData?.data?.length === 0 ? (
          <div className="flex flex-col gap-2 md:gap-3 items-center">
            <div className="w-40 md:w-48 lg:w-54 mx-auto">
              <Lottie
                animationData={emptyAnimation}
                loop={true}
                autoplay={true}
              />
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-medium mb-1">
              Your Cart is Empty
            </h3>
            <h3 className="text-sm md:text-base italic text-gray-500 text-center max-w-md mx-auto">
              Add some awesome products to your cart to get started on your next
              mission.
            </h3>
          </div>
        ) : (
          cartData?.data?.cart?.map((item: any) => (
            <CartItem key={item?.id} item={item} />
          ))
        )}
      </div>
    </section>
  );
};

export default PaymentOptions;
