import { create } from "zustand";

export const useWaiterStore = create((set) => ({
  table: null,
  setTable: (id: number) => set({ table: id }),
}));
