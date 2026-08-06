import { Fulfillment } from "@/lib/fulfillment";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

interface UpdateCartQuantityPayload {
  vendor_id: number;
  product_id: number;
  type: "increase" | "decrease";
}

const calculateTotalPrice = (items: CartItem[]) => {
  return items.reduce((vendorTotal, vendor) => {
    return (
      vendorTotal +
      vendor.products.reduce(
        (productTotal, product) =>
          productTotal + product.price * product.quantity,
        0,
      )
    );
  }, 0);
};

const calculateTotalQuantity = (items: CartItem[]) => {
  return items.reduce((vendorTotal, vendor) => {
    return (
      vendorTotal +
      vendor.products.reduce(
        (productTotal, product) => productTotal + product.quantity,
        0,
      )
    );
  }, 0);
};

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const vendor = state.items.find(
        item => item.vendor_id === action.payload.vendor_id,
      );

      if (vendor) {
        const newProduct = action.payload.products[0];

        const existingProduct = vendor.products.find(
          p => p.id === newProduct.id,
        );

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          vendor.products.push(newProduct);
        }
      } else {
        state.items.push(action.payload);
      }

      state.totalPrice = calculateTotalPrice(state.items);
      state.totalQuantity = calculateTotalQuantity(state.items);
    },

    removeFromCart: (
      state,
      action: PayloadAction<{
        vendor_id: number;
        product_id: number;
      }>,
    ) => {
      const vendor = state.items.find(
        v => v.vendor_id === action.payload.vendor_id,
      );

      if (!vendor) return;

      vendor.products = vendor.products.filter(
        p => p.id !== action.payload.product_id,
      );

      state.items = state.items.filter(v => v.products.length > 0);
      state.totalPrice = calculateTotalPrice(state.items);
      state.totalQuantity = calculateTotalQuantity(state.items);
    },

    updateCartQuantity: (
      state,
      action: PayloadAction<UpdateCartQuantityPayload>,
    ) => {
      const { vendor_id, product_id, type } = action.payload;

      const vendor = state.items.find(v => v.vendor_id === vendor_id);

      if (!vendor) return;

      const product = vendor.products.find(p => p.id === product_id);

      if (!product) return;

      if (type === "increase") {
        product.quantity++;
      } else if (type === "decrease" && product.quantity > 1) {
        product.quantity--;
      }

      state.totalPrice = calculateTotalPrice(state.items);
      state.totalQuantity = calculateTotalQuantity(state.items);
    },

    clearCart: state => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },

    setVendorFulfillment: (
      state,
      action: PayloadAction<{
        vendor_id: number;
        fulfillment: Fulfillment;
      }>,
    ) => {
      const vendor = state.items.find(
        v => v.vendor_id === action.payload.vendor_id,
      );

      if (vendor) {
        vendor.selectedFulfillment = action.payload.fulfillment;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, setVendorFulfillment } =
  cartSlice.actions;

export default cartSlice.reducer;
