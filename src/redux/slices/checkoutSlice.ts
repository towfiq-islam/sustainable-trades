import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CartItem,
  Fulfillment,
  MasterPricing,
  VendorPricing,
  VendorExtras,
  PickupLocationSelection,
} from "@/Types";

export interface UnavailableVendor {
  vendor_id: number;
  shop_name: string;
}

interface CheckoutState {
  master: MasterPricing | null;
  vendor_orders: VendorPricing[];
  subscribe_website: boolean;
  terms_and_condition: boolean;
  vendors: Record<number, VendorExtras>;
  buyNowItem: CartItem | null;
  deliveryUnavailableVendors: UnavailableVendor[];
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

const initialState: CheckoutState = {
  master: null,
  vendor_orders: [],
  subscribe_website: false,
  terms_and_condition: false,
  vendors: {},
  buyNowItem: null,
  deliveryUnavailableVendors: [],
  contact: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  },
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
    setBuyNowItem: (state, action: PayloadAction<CartItem | null>) => {
      state.buyNowItem = action.payload;
    },
    setBuyNowFulfillment: (
      state,
      action: PayloadAction<{ fulfillment: Fulfillment }>,
    ) => {
      if (state.buyNowItem) {
        state.buyNowItem.selectedFulfillment = action.payload.fulfillment;
      }
    },
    
    setDeliveryUnavailableVendors: (
      state,
      action: PayloadAction<UnavailableVendor[]>,
    ) => {
      state.deliveryUnavailableVendors = action.payload;
    },
    clearDeliveryUnavailableVendor: (state, action: PayloadAction<number>) => {
      state.deliveryUnavailableVendors =
        state.deliveryUnavailableVendors.filter(
          v => v.vendor_id !== action.payload,
        );
    },
    setContactInfo: (
      state,
      action: PayloadAction<{
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
      }>,
    ) => {
      state.contact = {
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        email: action.payload.email,
        phone: action.payload.phone ?? "",
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
  setBuyNowItem,
  setBuyNowFulfillment,
  setDeliveryUnavailableVendors,
  clearDeliveryUnavailableVendor,
  setContactInfo,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
