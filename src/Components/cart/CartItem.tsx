import Image from "next/image";
import { MinSvg } from "@/Components/Svg/SvgContainer";
import Link from "next/link";
import { useAppDispatch } from "@/redux/store";
import { removeFromCart, updateCartQuantity } from "@/redux/slices/cartSlice";

const CartItem = ({ item }: any) => {
  const dispatch = useAppDispatch();

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
    </div>
  );
};

export default CartItem;
