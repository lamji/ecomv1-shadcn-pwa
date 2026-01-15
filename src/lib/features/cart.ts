import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  CartState, AddToCartPayload } from '@/lib/types/cart';

const initialState: CartState = {
  cart: [],
  temporaryCart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setTemporaryCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, quantity } = action.payload;
      state.temporaryCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        timestamp: new Date(),
      });
    },
    clearCart: (state) => {
      state.cart = [];
      state.temporaryCart = [];
    },
    clearTemporaryCart: (state) => {
      state.temporaryCart = [];
    },
    moveToCart: (state) => {
      state.cart = [...state.cart, ...state.temporaryCart];
      state.temporaryCart = [];
    },
  },
});

export const { setTemporaryCart, clearCart, clearTemporaryCart, moveToCart } = cartSlice.actions;
export default cartSlice.reducer;