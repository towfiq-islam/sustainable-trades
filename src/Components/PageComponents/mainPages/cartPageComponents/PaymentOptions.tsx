"use client";
import CartItem from "./CartItem";
import emptyAnimation from "@/Assets/cart.json";
import Lottie from "lottie-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { TiDelete } from "react-icons/ti";
import { clearCart } from "@/redux/slices/cartSlice";
import { useState } from "react";
import FulfillmentModal from "@/app/(main)/cart/_components/FulfillmentModal";
import Modal from "@/Components/Common/Modal";

const PaymentOptions = () => {
  const [openFulfillment, setOpenFulfillment] = useState(false);
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalPrice } = useAppSelector(
    state => state.cart,
  );

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="section_sub_title !mb-0">
          {totalQuantity
            ? `${totalQuantity} Items In Your Cart`
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

      <p className="text-secondary-gray mb-5">
        Shipping and sales tax will be added at checkout if applicable.
      </p>

      {items?.length > 0 ? (
        <div className="grid grid-cols-12 gap-5 items-start">
          <div className="space-y-5 col-span-8">
            {items?.map((item: any) => (
              <CartItem key={item?.vendor_id} item={item} />
            ))}
          </div>

          <div className="col-span-4 border border-gray-300 rounded-lg p-5 space-y-3">
            <h3 className="text-lg font-semibold text-secondary-black">
              Order Summary
            </h3>
            <p className="text-sm text-gray-500">
              Subtotal: ${(totalPrice ?? 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Shipping and tax calculated at next step
            </p>
            <hr />
            <p className="text-lg font-bold text-secondary-black">
              Total: ${(totalPrice ?? 0).toFixed(2)}
            </p>

            <button
              disabled={!items?.length}
              onClick={() => setOpenFulfillment(true)}
              className="w-full mt-2 py-3 rounded-[5px] bg-primary-green text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-95 transition-all duration-300"
            >
              Proceed to Checkout
            </button>
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

      <Modal open={openFulfillment} onClose={() => setOpenFulfillment(false)}>
        <FulfillmentModal
          open={openFulfillment}
          vendors={items}
          onClose={() => setOpenFulfillment(false)}
          onContinue={fulfillments => {
            console.log(fulfillments);
            setOpenFulfillment(false);
          }}
        />
      </Modal>
    </section>
  );
};

export default PaymentOptions;
