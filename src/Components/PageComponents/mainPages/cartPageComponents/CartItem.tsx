import Image from "next/image";
import { useState } from "react";
import { LocationTwoSvg, MinSvg } from "@/Components/Svg/SvgContainer";
import Modal from "@/Components/Common/Modal";
import SuccessModal from "@/Components/Modals/SuccessModal";
import ShippingAddress from "@/Components/Modals/ShippingAddress";
import ShippingOptionsModal from "@/Components/Modals/ShippingOptionsModal";
import CheckoutPaypalModal from "@/Components/Modals/CheckoutPaypalModal";
import OrderReviewModal from "@/Components/Modals/OrderReviewModal";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/store";
import { removeFromCart, updateCartQuantity } from "@/redux/slices/cartSlice";

const CartItem = ({ item }: any) => {
  // States
  const dispatch = useAppDispatch();
  const [shippingOptionsOpen, setShippingOptionsOpen] =
    useState<boolean>(false);
  const [orderReviewModal, setOrderReviewModal] = useState<boolean>(false);
  const [shippingAddressOpen, setShippingAddressOpen] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const [paypalOpen, setPaypalOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const [fulfillmentType, setFulfillmentType] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [taxData, setTaxData] = useState({});

  // Func for update cart quantity
  const handleUpdateCart = (quantity: number, type: string, id: number) => {
    if (type === "decrease" && quantity > 1) {
      dispatch(updateCartQuantity({ id, type: "decrease" }));
    }
    if (type === "increase") {
      dispatch(updateCartQuantity({ id, type: "increase" }));
    }
  };

  // Func for remove from cart
  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart({ id }));
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg bg-white relative">
      {/* Product Info */}
      <div key={item?.id} className="flex flex-col sm:flex-row gap-5">
        {/* Product Image */}
        <figure className="w-full sm:w-[180px] h-[140px] shrink-0 rounded-lg border border-gray-100 relative">
          <div className="absolute inset-0 bg-black/20 rounded-lg" />
          <Image
            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.image}`}
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
              href={`/product-details/${item?.id}`}
              className="text-xl font-semibold text-secondary-black block hover:underline"
            >
              {item?.name}
            </Link>

            {/* Product Price */}
            <p className="text-2xl font-bold">
              ${item?.price * item?.quantity}
            </p>
          </div>

          {/* Product Quantity */}
          <div className="flex gap-3 items-center border rounded-lg px-7 py-2 font-semibold border-gray-300 w-fit mb-3">
            <button
              onClick={() => {
                handleUpdateCart(item?.quantity, "decrease", item?.id);
              }}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              <MinSvg />
            </button>

            <p>Qty:</p>
            <p>{item?.quantity}</p>

            <button
              onClick={() => {
                handleUpdateCart(item?.quantity, "increase", item?.id);
              }}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Remove item */}
          <button
            onClick={() => handleRemoveFromCart(item?.id)}
            className="font-semibold text-primary-green cursor-pointer text-[15px] hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Add to cart */}
      {/* <div className="flex justify-end">
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
      </div> */}

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
          subTotal={0}
          // subTotal={vendorSubtotal}
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
