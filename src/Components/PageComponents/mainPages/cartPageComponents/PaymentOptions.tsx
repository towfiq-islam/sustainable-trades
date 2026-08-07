"use client";
import CartItem from "./CartItem";
import emptyAnimation from "@/Assets/cart.json";
import Lottie from "lottie-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { TiDelete } from "react-icons/ti";
import { clearCart } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";
import { MdLockOpen } from "react-icons/md";

const PaymentOptions = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalPrice } = useAppSelector(
    state => state.cart,
  );

  return (
    <section className="">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-xl md:text-2xl lg:text-[28px] text-secondary-black font-semibold">
          {totalQuantity
            ? `${totalQuantity} Items from ${items?.length} Sellers`
            : "Cart is empty"}
        </h3>

        {items?.length > 0 && (
          <button
            onClick={() => dispatch(clearCart())}
            className="px-3 py-1.5 text-sm rounded-full font-medium bg-primary-red cursor-pointer text-white flex gap-1 items-center"
          >
            <TiDelete className="text-lg" />
            Clear Cart
          </button>
        )}
      </div>

      {items?.length > 0 ? (
        <div className="grid grid-cols-12 gap-5 items-start">
          <div className="space-y-5 col-span-8">
            <div className="border border-off-green/40 bg-off-green/20 max-w-4xl rounded-lg p-3">
              <div className="flex gap-3">
                <div className="size-7 shrink-0 rounded-full bg-primary-green text-sm text-white flex items-center justify-center">
                  i
                </div>

                <p className="text-[#374151] leading-6 text-[14px]">
                  After you click Proceed to Checkout, you'll choose the
                  available delivery option for each seller. Available options
                  may include Local Pickup, Local Delivery, or Shipping.
                  Shipping or delivery fees and taxes will be calculated based
                  on your selections. This prepares the shopper before they
                  reach the next screen.
                </p>
              </div>
            </div>

            {items?.map((item: any) => (
              <CartItem key={item?.vendor_id} item={item} />
            ))}
          </div>

          <div className="col-span-4 border border-gray-300 rounded-xl p-5 space-y-4 sticky top-40">
            <h3 className="text-lg font-semibold text-secondary-black">
              Order Summary
            </h3>

            <div className="flex justify-between text-sm text-secondary-gray">
              <span className="font-semibold">Subtotal</span>
              <span>${(totalPrice ?? 0).toFixed(2)}</span>
            </div>

            <hr className="text-gray-300" />

            <p className="text-sm text-gray-500">
              Shipping, local delivery, and taxes (if applicable) will be
              applied at the next step.
            </p>

            <hr className="text-gray-300" />

            <div className="flex justify-between font-bold text-secondary-black">
              <span className="text-primary-green">Estimated total</span>
              <span>${(totalPrice ?? 0).toFixed(2)}</span>
            </div>

            <button
              disabled={!items?.length}
              onClick={() => router.push("/checkout")}
              className="w-full mt-2 py-3 rounded-[5px] bg-primary-green text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-95 transition-all duration-300"
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <MdLockOpen size={16} />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </section>
  );
};

export default PaymentOptions;
