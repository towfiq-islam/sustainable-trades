import Image from "next/image";
import { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { LocationTwoSvg, MinSvg } from "@/Components/Svg/SvgContainer";
import Modal from "@/Components/Common/Modal";
import SuccessModal from "@/Components/Modals/SuccessModal";
import ShippingAddress from "@/Components/Modals/ShippingAddress";
import ShippingOptionsModal from "@/Components/Modals/ShippingOptionsModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import CheckoutPaypalModal from "@/Components/Modals/CheckoutPaypalModal";
import OrderReviewModal from "@/Components/Modals/OrderReviewModal";
import Link from "next/link";
import {
  useRemoveCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "@/redux/api/cartApi";
import toast from "react-hot-toast";

interface CartItem {
  id: number;
  fulfillment_type: string;
  shop: {
    id: number;
    user: {
      onboarded: boolean;
      membership: {
        membership_type: string;
      };
    };
    user_id: number;
    shop_name: string;
    shop_image: string;
    address: {
      display_my_address: boolean;
      address_line_1: string;
      city: string;
      state: string;
    };
  };
  cart_items: {
    id: number;
    quantity: number;
    product_id: number;
    price: string;
    product: {
      images: { image: string }[];
      product_name: string;
      product_price: string;
    };
  }[];
}

interface CartProps {
  item: CartItem;
}

const CartItem = ({ item }: CartProps) => {
  // States
  const [shippingOptionsOpen, setShippingOptionsOpen] =
    useState<boolean>(false);
  const [orderReviewModal, setOrderReviewModal] = useState<boolean>(false);
  const [shippingAddressOpen, setShippingAddressOpen] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const [paypalOpen, setPaypalOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [cartItemId, setCartItemId] = useState<number | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [fulfillmentType, setFulfillmentType] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [taxData, setTaxData] = useState({});

  // Query + Mutation
  const [removeCartItemMutation, { isLoading: cartItemPending }] =
    useRemoveFromCartMutation();
  const [updateCartItem, { isLoading: updateItemPending }] =
    useUpdateCartMutation();
  const [removeCartMutation, { isLoading: cartPending }] =
    useRemoveCartMutation();

  // Func for update cart quantity
  const handleUpdateCart = (quantity: number, type: string, id: number) => {
    if (type === "decrease" && quantity <= 1) return;
    const newQuantity = type === "increase" ? quantity + 1 : quantity - 1;
    updateCartItem({ cartId: id, data: { quantity: newQuantity } })
      .unwrap()
      .then(res => {
        toast.success(res?.message);
      })
      .catch(err => {
        toast.error(err?.data?.message);
      });
  };

  const vendorSubtotal = item.cart_items.reduce(
    (total, cart) => total + Number(cart.price),
    0,
  );

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
              className="size-full rounded-full object-cover"
            />
          </figure>

          {/* Shop Name */}
          <Link
            href={`/shop-details?view=${"customer"}&id=${item?.shop?.user_id}&listing_id=${item?.shop?.id}`}
            className="text-xl font-semibold text-primary-green block hover:underline"
          >
            {item?.shop?.shop_name}
          </Link>
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
            removeCartMutation(item?.id).unwrap();
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
        {item?.cart_items?.map(cart => (
          <div
            key={cart?.id}
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
                <Link
                  href={`/product-details/${cart?.product_id}`}
                  className="text-xl font-semibold text-secondary-black block hover:underline"
                >
                  {cart?.product?.product_name}
                </Link>

                {/* Product Price */}
                <p className="text-2xl font-bold">${cart?.price}</p>
              </div>

              {/* Product Quantity */}
              <div className="flex gap-3 items-center border rounded-lg px-7 py-2 font-semibold border-primary-green w-fit mb-3">
                <button
                  disabled={updateItemPending}
                  onClick={() => {
                    setCartItemId(cart?.id);
                    handleUpdateCart(cart?.quantity, "decrease", cart?.id);
                  }}
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  <MinSvg />
                </button>

                <p>Qty:</p>
                <p>{cart?.quantity}</p>

                <button
                  disabled={updateItemPending}
                  onClick={() => {
                    setCartItemId(cart?.id);
                    handleUpdateCart(cart?.quantity, "increase", cart?.id);
                  }}
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Remove item */}
              <button
                disabled={cartItemPending}
                onClick={() => {
                  setCartItemId(cart?.id);
                  removeCartItemMutation(cart?.id).unwrap();
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
            setFulfillmentType(item?.fulfillment_type);
            setShippingMethod(
              item?.shop?.user?.onboarded &&
                (item?.fulfillment_type === "shipping" ||
                  item?.fulfillment_type === "both_local_pickup_and_shipping" ||
                  item?.fulfillment_type === "both_shipping")
                ? "proceed"
                : "local",
            );
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
          cart_id={cartId}
          userId={item?.shop?.user_id}
          membershipType={item?.shop?.user?.membership?.membership_type}
          fulfillmentType={fulfillmentType}
          isConnected={item?.shop?.user?.onboarded}
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          setSuccessOpen={setSuccessOpen}
          onProceed={() => {
            setShippingOptionsOpen(false);
            setShippingAddressOpen(true);
          }}
          onSuccess={() => {
            setShippingOptionsOpen(false);
          }}
          onClose={() => setShippingOptionsOpen(false)}
        />
      </Modal>

      <Modal
        open={shippingAddressOpen}
        onClose={() => setShippingAddressOpen(false)}
      >
        <ShippingAddress
          shippingMethod={shippingMethod}
          setFormData={setFormData}
          formData={formData}
          setTaxData={setTaxData}
          cart_id={cartId}
          onNext={() => {
            setShippingAddressOpen(false);
            setOrderReviewModal(true);
          }}
        />
      </Modal>

      <Modal open={orderReviewModal} onClose={() => setOrderReviewModal(false)}>
        <OrderReviewModal
          setFormData={setFormData}
          formData={formData}
          cartItems={item}
          subTotal={vendorSubtotal}
          cart_id={cartId}
          taxData={taxData}
          shop_name={item?.shop?.shop_name}
          onClose={() => {
            setOrderReviewModal(false);
            setShippingAddressOpen(true);
          }}
          onProceed={() => {
            setOrderReviewModal(false);
            setPaypalOpen(true);
          }}
        />
      </Modal>

      <Modal open={paypalOpen} onClose={() => setPaypalOpen(false)}>
        <CheckoutPaypalModal cart_id={cartId} formData={formData} />
      </Modal>

      <Modal open={successOpen} onClose={() => setSuccessOpen(false)}>
        <SuccessModal />
      </Modal>
    </div>
  );
};

export default CartItem;
