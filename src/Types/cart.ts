import { Fulfillment } from "./fulfillment";

export interface ProductItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  fulfillment: Fulfillment[];
}

export interface CartItem {
  vendor_id: number;
  shop_id: number;
  shop_name: string;
  shop_image: string;
  selectedFulfillment?: "pickup" | "delivery" | "shipping";
  products: ProductItem[];
}
