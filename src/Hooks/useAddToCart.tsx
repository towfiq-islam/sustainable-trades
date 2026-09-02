import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/store";
import { addToCart } from "@/redux/slices/cartSlice";
import { Fulfillment, normalizeFulfillment } from "@/lib/fulfillment";

type CartProduct = {
  id: number;
  product_name?: string;
  product_price?: string;
  fulfillment?: Fulfillment[];
  product_quantity?: number;
  images?: { image: string }[];
  shop?: {
    id: number;
    user_id?: number;
    shop_name: string;
    shop_image: string;
  };
};

export function useAddToCart() {
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: CartProduct) => {
    const payload = {
      vendor_id: product?.shop?.user_id as number,
      shop_id: product?.shop?.id as number,
      shop_name: product?.shop?.shop_name as string,
      shop_image: product?.shop?.shop_image as string,
      products: [
        {
          id: product?.id,
          name: product?.product_name ?? "",
          image: product?.images?.[0]?.image ?? "",
          price: Number(product?.product_price),
          quantity: 1,
          fulfillment: normalizeFulfillment(product?.fulfillment),
        },
      ],
    };

    dispatch(addToCart(payload));
    toast.success("Added to cart");
  };

  return { handleAddToCart };
}
