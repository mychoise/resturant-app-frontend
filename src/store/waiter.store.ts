import { create } from "zustand";

export type Table = {
  id: string;
  table_number: number;
  is_occupied: boolean;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type WaiterStore = {
  table: Table | null;
  cart: CartItem[];
  setTable: (table: Table | null) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  increaseQantity: (id: string) => void;
  decreaseQantity: (id: string) => void;
  deleteItem: (id: string) => void;
};

export const useWaiterStore = create((set, get) => ({
  user: null,
  table: null,
  cart: [],
  setTable: (table) => set({ table }),
  addToCart: (item) => {
    const cart = get().cart;
    set({
      cart: [
        ...cart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ],
    });
  },
  increaseQantity: (id) => {
    const cart = get().cart;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    set({ cart: updatedCart });
  },
  decreaseQantity: (id) => {
    const cart = get().cart;
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item,
    );
    set({ cart: updatedCart });
  },
  deleteItem: (id) => {
    const cart = get().cart;
    const updatedCart = cart.filter((item) => item.id !== id);
    set({ cart: updatedCart });
  },
  setUser: (user) => {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
    console.log("Setting user in store with payload:", payload);
    set({ user: payload });
  },
}));
