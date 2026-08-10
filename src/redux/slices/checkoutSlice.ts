import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PickupLocationSelection {
  id: number;
  location_name: string;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface VendorPricing {
  vendor_id: number;
  tax_amount: number;
  shipping_amount: number;
  delivery_amount: number;
  discount_amount: number;
  total_amount: number;
}

export interface MasterPricing {
  sub_total: number;
  tax_amount: number;
  shipping_amount: number;
  delivery_amount: number;
  discount_amount: number;
  total_amount: number;
}

export interface VendorExtras {
  coupon_code: string | null;
  subscribe_shop: boolean;
  discount_amount: number;
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number | null;
  pickup_location?: PickupLocationSelection | null;
}

interface CheckoutState {
  master: MasterPricing | null;
  vendor_orders: VendorPricing[];
  subscribe_website: boolean;
  terms_and_condition: boolean;
  vendors: Record<number, VendorExtras>;
}

const initialState: CheckoutState = {
  master: null,
  vendor_orders: [],
  subscribe_website: false,
  terms_and_condition: false,
  vendors: {},
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutPricing: (
      state,
      action: PayloadAction<{
        master: MasterPricing;
        vendor_orders: VendorPricing[];
      }>,
    ) => {
      state.master = action.payload.master;
      state.vendor_orders = action.payload.vendor_orders;
    },
    setSubscribeWebsite: (state, action: PayloadAction<boolean>) => {
      state.subscribe_website = action.payload;
    },
    setTermsAndCondition: (state, action: PayloadAction<boolean>) => {
      state.terms_and_condition = action.payload;
    },
    setVendorCoupon: (
      state,
      action: PayloadAction<{
        vendor_id: number;
        coupon_code: string | null;
        discount_amount?: number;
        discount_type?: "percentage" | "fixed" | null;
        discount_value?: number | null;
      }>,
    ) => {
      const existing = state.vendors[action.payload.vendor_id] ?? {
        coupon_code: null,
        subscribe_shop: false,
        discount_amount: 0,
        discount_type: null,
        discount_value: null,
      };
      state.vendors[action.payload.vendor_id] = {
        ...existing,
        coupon_code: action.payload.coupon_code,
        discount_amount: action.payload.discount_amount ?? 0,
        discount_type: action.payload.discount_type ?? null,
        discount_value: action.payload.discount_value ?? null,
      };
    },
    setVendorSubscribeShop: (
      state,
      action: PayloadAction<{ vendor_id: number; subscribe_shop: boolean }>,
    ) => {
      const existing = state.vendors[action.payload.vendor_id] ?? {
        coupon_code: null,
        subscribe_shop: false,
      };
      state.vendors[action.payload.vendor_id] = {
        ...existing,
        subscribe_shop: action.payload.subscribe_shop,
      };
    },

    setVendorPickupLocation: (
      state,
      action: PayloadAction<{
        vendor_id: number;
        location: PickupLocationSelection | null;
      }>,
    ) => {
      const existing = state.vendors[action.payload.vendor_id] ?? {
        coupon_code: null,
        subscribe_shop: false,
      };
      state.vendors[action.payload.vendor_id] = {
        ...existing,
        pickup_location: action.payload.location,
      };
    },

    clearCheckout: () => initialState,
  },
});

export const {
  setCheckoutPricing,
  setSubscribeWebsite,
  setTermsAndCondition,
  setVendorCoupon,
  setVendorSubscribeShop,
  setVendorPickupLocation,
  clearCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
