import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VendorPricing {
  vendor_id: number;
  tax_amount: number;
  shipping_amount: number;
  delivery_amount: number;
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

interface CheckoutPricingState {
  master: MasterPricing | null;
  vendor_orders: VendorPricing[];
}

const initialState: CheckoutPricingState = {
  master: null,
  vendor_orders: [],
};

const checkoutPricingSlice = createSlice({
  name: "checkoutPricing",
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
    clearCheckoutPricing: state => {
      state.master = null;
      state.vendor_orders = [];
    },
  },
});

export const { setCheckoutPricing, clearCheckoutPricing } =
  checkoutPricingSlice.actions;
export default checkoutPricingSlice.reducer;
