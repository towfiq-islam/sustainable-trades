"use client";
import CartItem from "./CartItem";
import { TiDelete } from "react-icons/ti";
import { getProductCart, useClearCart } from "@/Hooks/api/cms_api";
import { CgSpinnerTwo } from "react-icons/cg";
import { CartItemSkeleton } from "@/Components/Loader/Loader";

const PaymentOptions = () => {
  // Mutation + Query
  const { data: cartData, isLoading } = getProductCart();
  console.log(cartData);
  // console.log(cartData?.data?.fulfillment_type);
  const { mutate: clearCartMutation, isPending, refetch } = useClearCart();

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between">
        <h3 className="section_sub_title">
          {cartData?.data?.total_cart_items
            ? `${cartData?.data?.total_cart_items} Items In Your Cart`
            : "Cart is empty"}
        </h3>

        {cartData?.data && (
          <button
            disabled={isPending}
            onClick={() => {
              clearCartMutation();
              refetch();
            }}
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
      </div>

      <div className="space-y-7">
        {isLoading
          ? [1, 2].map((_, idx) => <CartItemSkeleton key={idx} />)
          : !cartData?.data || cartData?.data?.length === 0
          ? "No Cart Found"
          : cartData?.data?.cart?.map((item: any) => (
              <CartItem key={item?.id} item={item} />
            ))}
      </div>
    </section>
  );
};

export default PaymentOptions;
