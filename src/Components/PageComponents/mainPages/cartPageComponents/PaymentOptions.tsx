"use client";
import CartItem from "./CartItem";
import { TiDelete } from "react-icons/ti";
import { useClearCart } from "@/Hooks/api/cms_api";
import { CgSpinnerTwo } from "react-icons/cg";
import { CartItemSkeleton } from "@/Components/Loader/Loader";

const PaymentOptions = ({ data, isLoading }: any) => {
  // Mutation
  const { mutate: clearCartMutation, isPending } = useClearCart();

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between">
        <h3 className="section_sub_title">
          {data?.total_cart_items
            ? `${data?.total_cart_items} Items In Your Cart`
            : "Card is empty"}
        </h3>

        {data && (
          <button
            disabled={isPending}
            onClick={() => clearCartMutation()}
            className={`px-3 py-1.5 text-sm rounded-full font-semibold bg-red-500 text-white flex gap-1 items-center ${
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
          : !data || data?.length === 0
          ? "No Cart Found"
          : data?.cart?.map((item: any) => (
              <CartItem key={item?.id} item={item} />
            ))}
      </div>
    </section>
  );
};

export default PaymentOptions;
