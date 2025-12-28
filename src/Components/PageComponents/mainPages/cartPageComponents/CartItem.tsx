import {
  useRemoveCart,
  useRemoveFromCart,
  useUpdateCart,
} from "@/Hooks/api/cms_api";
import Image from "next/image";
import { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { LocationTwoSvg, MinSvg } from "@/Components/Svg/SvgContainer";
import Modal from "@/Components/Common/Modal";
import SuccessModal from "@/Components/Modals/SuccessModal";
import ShippingAddress from "@/Components/Modals/ShippingAddress";
import ShippingOptionsModal from "@/Components/Modals/ShippingOptionsModal";
import { RiDeleteBin6Line } from "react-icons/ri";

const CartItem = ({ item }: any) => {
  const [shippingOptionsOpen, setShippingOptionsOpen] =
    useState<boolean>(false);
  const [shippingAddressOpen, setShippingAddressOpen] =
    useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [cartItemId, setCartItemId] = useState<number | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const { mutate: removeCartItemMutation, isPending: cartItemPending } =
    useRemoveFromCart(cartItemId);
  const { mutate: updateCartItemMutation, isPending: updateItemPending } =
    useUpdateCart(cartItemId);
  const { mutate: removeCartMutation, isPending: cartPending } = useRemoveCart(
    item?.id
  );

  // Func for update cart quantity
  const handleUpdateCart = (quantity: number, type: string) => {
    if (type === "decrease" && quantity <= 1) return;
    const newQuantity = type === "increase" ? quantity + 1 : quantity - 1;
    updateCartItemMutation({ quantity: newQuantity });
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg bg-white relative">
      {/* Shop Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-3 mb-5">
        <div className="flex gap-2 sm:gap-5 items-center">
          {/* Shop Image */}
          <figure className="size-12 rounded-full border border-gray-100 relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.shop?.shop_image}`}
              alt="shop_image"
              fill
              unoptimized
              className="size-full rounded-full"
            />
          </figure>

          {/* Shop Name */}
          <h3 className="text-xl font-semibold text-primary-green">
            {item?.shop?.shop_name}
          </h3>
        </div>

        {/* Shop Location */}
        <div className="flex gap-2 items-center">
          <LocationTwoSvg />
          <p className="text-primary-green font-semibold">
            {item?.shop?.address?.display_my_address
              ? item?.shop?.address?.address_line_1
              : `${item?.shop?.address?.city}, ${item?.shop?.address?.state}`}
          </p>
        </div>

        {/* Remove Cart */}
        <button
          disabled={cartPending}
          onClick={() => {
            setCartId(item?.id);
            removeCartMutation();
          }}
          className={`absolute right-2 top-2 size-8 text-sm grid place-items-center rounded-full font-semibold bg-accent-red text-white ${
            cartPending ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {cartPending && cartId === item?.id ? (
            <p className="flex gap-2 items-center justify-center">
              <CgSpinnerTwo className="animate-spin" />
            </p>
          ) : (
            <RiDeleteBin6Line className="text-lg" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {item?.cart_items?.map((cart: any) => (
          <div
            key={cart.id}
            className="flex flex-col sm:flex-row gap-5 border-b last:border-b-0 border-gray-300 pb-7 last:pb-0"
          >
            {/* Product Image */}
            <figure className="w-full sm:w-[180px] h-[140px] shrink-0 rounded-lg border border-gray-100 relative">
              <div className="absolute inset-0 bg-black/20 rounded-lg" />
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${cart?.product?.images[0]?.image}`}
                alt="product image"
                fill
                unoptimized
                className="w-full h-full object-cover rounded-lg"
              />
            </figure>

            <div className="grow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                {/* Product Name */}
                <h3 className="text-xl font-semibold text-secondary-black">
                  {cart?.product?.product_name}
                </h3>

                {/* Product Price */}
                <p className="text-2xl font-bold">
                  ${cart?.product?.product_price}
                </p>
              </div>

              {/* Product Quantity */}
              <div className="flex gap-3 items-center border rounded-lg px-7 py-2 font-semibold border-primary-green w-fit mb-3">
                <button
                  onClick={() => {
                    setCartItemId(cart?.id);
                    handleUpdateCart(cart?.quantity, "decrease");
                  }}
                  className="cursor-pointer"
                >
                  <MinSvg />
                </button>
                <p>Qty:</p>
                <p>{cart?.quantity}</p>
                <button
                  onClick={() => {
                    setCartItemId(cart?.id);
                    handleUpdateCart(cart?.quantity, "increase");
                  }}
                  className="cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Remove item */}
              <button
                disabled={cartItemPending}
                onClick={() => {
                  setCartItemId(cart?.id);
                  removeCartItemMutation();
                }}
                className={`font-semibold text-primary-green cursor-pointer text-[15px] ${
                  cartItemPending ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {cartItemPending && cartItemId === cart?.id ? (
                  <p className="flex gap-2 items-center justify-center">
                    <CgSpinnerTwo className="animate-spin text-lg" />
                    <span>Removing...</span>
                  </p>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add to cart */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShippingOptionsOpen(true);
            setCartId(item?.id);
          }}
          className="bg-primary-green text-white cursor-pointer font-semibold rounded !w-fit px-4 !py-2 !text-sm"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Modals */}
      <Modal
        open={shippingOptionsOpen}
        onClose={() => setShippingOptionsOpen(false)}
      >
        <ShippingOptionsModal
          userId={item?.shop?.user_id}
          onProceed={() => {
            setShippingOptionsOpen(false);
            setShippingAddressOpen(true);
          }}
          onSuccess={() => {
            setShippingOptionsOpen(false);
            setSuccessOpen(true);
          }}
          onClose={() => setShippingOptionsOpen(false)}
        />
      </Modal>

      <Modal
        open={shippingAddressOpen}
        onClose={() => setShippingAddressOpen(false)}
      >
        <ShippingAddress
          cart_id={cartId}
          onClose={() => setShippingAddressOpen(false)}
        />
      </Modal>

      {/* <Modal open={successOpen} onClose={() => setSuccessOpen(false)}>
        <SuccessModal />
      </Modal> */}
    </div>
  );
};

export default CartItem;
