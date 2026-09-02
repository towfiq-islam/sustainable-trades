import { StaticImageData } from "next/image";

export type TradeItem = {
  image: StaticImageData | string;
  product: ProductInfo;
  store: string;
  quantity: string;
  type: string;
};

export type ShopData = {
  id: Number;
  shop_name: String;
  user_id: Number;
};

export type ProductInfo = {
  description: string;
  id: number;
  product_name: string;
  product_price: number;
  images: ImageArr[];
  shop: ShopData;
  shop_info_id: string;
};

export type ImageArr = {
  id: number;
  image: string;
  product_id: number;
};

export type TradeRequest = {
  id: number;
  created_at: string;
  inquiry: number;
  status: string;
  items: TradeItem[];
  sender_id: number;
  receiver_id: number;
};
