export interface ShopAddress {
  id: number;
  shop_info_id: number;
  address_line_1: string;
  address_line_2?: string | null;
  city: string | null;
  state: string | null;
  postal_code: string;
  latitude: string | null;
  longitude: string | null;
  display_my_address: boolean;
  address_10_mile: boolean;
  do_not_display: boolean;
}

export interface ShopInfo {
  id: number;
  user_id: number;
  shop_name: string;
  shop_image: string;
  shop_banner?: string;
  address: ShopAddress;
}

export interface ShopBannerData {
  rating_avg: string;
  is_followed: boolean;
  first_name: string;
  last_name: string;
  avatar: string;
  trade_offers_count: number;
  shop_info: {
    id: number;
    user_id: number;
    shop_banner: string;
    shop_image: string;
    shop_name: string;
    order_count: number;
    about: {
      statement: string;
    };
    address: {
      address_line_1: string;
      display_my_address: string;
      city: string;
      state: string;
    };
  };
}
