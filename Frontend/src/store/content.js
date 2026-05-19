import { create } from "zustand";

export const useContentStore = create((set) => ({
  contentType: localStorage.getItem("contentType") || "movie",
  setContentType: (type) => {
    localStorage.setItem("contentType", type);
    set({ contentType: type });
  }
}));