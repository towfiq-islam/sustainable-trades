import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  price: number;
  quantity: number;
  image?: string;
  name?: string;
  fulfillment?: string;
  [key: string]: unknown;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

interface UpdateCartQuantityPayload {
  id: CartItem["id"];
  type: "increase" | "decrease";
}

const calculateTotalPrice = (items: CartItem[]): number => {
  const total = items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  return total ?? 0;
};

const calculateTotalQuantity = (items: CartItem[]): number => {
  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);
  return totalQty;
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
      const item = state.items.find(i => i?.id === action?.payload?.id);

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.totalPrice = calculateTotalPrice(state.items);
      state.totalQuantity = calculateTotalQuantity(state.items);
    },

    removeFromCart: (state, action: PayloadAction<{ id: CartItem["id"] }>) => {
      state.items = state.items.filter(i => i?.id !== action.payload.id);

      state.totalPrice = calculateTotalPrice(state.items);
      state.totalQuantity = calculateTotalQuantity(state.items);
    },

    updateCartQuantity: (
      state,
      action: PayloadAction<UpdateCartQuantityPayload>,
    ) => {
      const { id, type } = action.payload;
      const item = state.items.find(i => i?.id === id);

      if (item) {
        if (type === "increase") {
          item.quantity += 1;
        } else if (type === "decrease" && item.quantity > 1) {
          item.quantity -= 1;
        }
      }

      state.totalPrice = calculateTotalPrice(state.items);
      state.totalQuantity = calculateTotalQuantity(state.items);
    },

    clearCart: state => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
