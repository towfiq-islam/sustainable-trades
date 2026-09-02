type Attachment = {
  id: number;
  file_name: string;
  file_path: string;
  isLocal: boolean;
  file_type: string;
};

type CartProductImage = { id: number; product_id: number; image: string };

type CartProduct = {
  id: number;
  product_name: string;
  product_price: number;
  images: CartProductImage[];
};

type OrderItem = {
  id: number;
  cart_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  product: CartProduct;
};

type Order = { id: number; order_items: OrderItem[] };

export type MessageItem = {
  id: number;
  sender_id: number;
  receiver_id?: number;
  conversation_id?: number;
  message: string;
  message_type: string;
  created_at: string;
  status?: string;
  cart?: {
    id: number;
    quantity: number;
    product: {
      id: number;
      images: { image: string }[];
      product_price: number;
      product_name: string;
    };
  };
  order?: Order | null;
  attachments?: Attachment[];
  sender?: {
    first_name: string;
    last_name: string | null;
    avatar: string | null;
  };
};
