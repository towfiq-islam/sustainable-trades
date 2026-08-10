import Image from "next/image";
import { useState } from "react";
import { MinSvg } from "@/Components/Svg/SvgContainer";
import Modal from "@/Components/Common/Modal";
import SuccessModal from "@/Components/Modals/SuccessModal";
import ShippingAddress from "@/Components/Modals/ShippingAddress";
import ShippingOptionsModal from "@/Components/Modals/ShippingOptionsModal";
import CheckoutPaypalModal from "@/Components/Modals/CheckoutPaypalModal";
import OrderReviewModal from "@/Components/Modals/OrderReviewModal";
import Link from "next/link";
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
  const handleUpdateCart = (
    quantity: number,
    type: string,
    product_id: number,
    vendor_id: number,
  ) => {
    if (type === "decrease" && quantity > 1) {
      dispatch(updateCartQuantity({ product_id, vendor_id, type: "decrease" }));
    }
    if (type === "increase") {
      dispatch(updateCartQuantity({ product_id, vendor_id, type: "increase" }));
    }
  };

  // Func for remove from cart
  const handleRemoveFromCart = (product_id: number, vendor_id: number) => {
    dispatch(removeFromCart({ product_id, vendor_id }));
  };

  return (
    <div className="border border-gray-300 rounded-xl bg-white relative">
      {/* Shop Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center px-3 pt-2 pb-1">
        <div className="flex gap-2 sm:gap-3 items-center">
          {/* Shop Image */}
          <figure className="size-12 rounded-full border border-gray-100 relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.shop_image}`}
              alt="shop_image"
              fill
              unoptimized
              className="size-full rounded-full object-cover"
            />
          </figure>

          {/* Shop Name */}
          <p className="font-semibold text-primary-green block">
            Sold by{" "}
            <Link
              href={`/shop-details?view=${"customer"}&id=${item?.vendor_id}&listing_id=${item?.shop_id}`}
              className="hover:underline"
            >
              {item?.shop_name}
            </Link>
          </p>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6 p-3">
        {item?.products?.map((product: any) => (
          <div key={product?.id} className="flex flex-col sm:flex-row gap-4">
            {/* Product Image */}
            <figure className="w-full sm:w-24 h-22 shrink-0 rounded-lg border border-gray-100 relative">
              <div className="absolute inset-0 bg-black/20 rounded-lg" />
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${product?.image}`}
                alt="product image"
                fill
                unoptimized
                className="w-full h-full object-cover rounded-lg"
              />
            </figure>

            <div className="grow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1.5">
                {/* Product Name */}
                <Link
                  href={`/product-details/${product?.id}`}
                  className="font-semibold text-[15px] text-secondary-black block hover:underline"
                >
                  {product?.name}
                </Link>

                {/* Product Price */}
                <p className="font-semibold">
                  ${product?.price * product?.quantity}
                </p>
              </div>

              {/* Product Quantity */}
              <div className="flex gap-2 items-center overflow-hidden border h-8 rounded-full font-semibold border-gray-300 w-fit mb-2">
                <button
                  onClick={() => {
                    handleUpdateCart(
                      product?.quantity,
                      "decrease",
                      product?.id,
                      item?.vendor_id,
                    );
                  }}
                  className="cursor-pointer disabled:cursor-not-allowed px-2.5 h-full inline-block hover:bg-gray-100 shrink-0"
                >
                  <MinSvg />
                </button>

                <p className="flex text-gray-700 items-center gap-1 text-sm">
                  <p>Qty:</p>
                  <p>{product?.quantity}</p>
                </p>

                <button
                  onClick={() => {
                    handleUpdateCart(
                      product?.quantity,
                      "increase",
                      product?.id,
                      item?.vendor_id,
                    );
                  }}
                  className="cursor-pointer disabled:cursor-not-allowed px-2.5 h-full inline-block hover:bg-gray-100 shrink-0"
                >
                  +
                </button>
              </div>

              {/* Remove item */}
              <button
                onClick={() =>
                  handleRemoveFromCart(product?.id, item?.vendor_id)
                }
                className="cursor-pointer text-primary-green font-medium text-sm flex gap-1.5 items-center hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
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
