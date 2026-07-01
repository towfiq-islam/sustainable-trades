export interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
  phone: string;
  postal_code: string;
  username: string;
  street_address: string;
  apt: string;
  city: string;
  state: string;
  role: "customer" | "vendor";
  onboarded: boolean;
  selling_option: string;
  shop_info: {
    id: number;
    user_id: number;
    shop_name: string;
    shipping_setting: string;
    tax_provider: string;
    shippo_connected: boolean;
  };
  cart: {
    cart_items: {
      id: number;
      product_id: number;
      quantity: number;
    }[];
  };
  membership?: {
    type: string;
    status: string;
    membership_type: "basic" | "pro";
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  agree_to_terms: number;
  role: string | null;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
}
