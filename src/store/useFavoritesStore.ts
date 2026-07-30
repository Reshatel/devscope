import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: string[];
  addFavorite: (username: string) => void;
  removeFavorite: (username: string) => void;
  isFavorite: (username: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (username) =>
        set((state) => ({
          favorites: state.favorites.includes(username)
            ? state.favorites
            : [...state.favorites, username],
        })),

      removeFavorite: (username) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f !== username),
        })),

      isFavorite: (username) => get().favorites.includes(username),
    }),
    {
      name: "devscope-favorites",
    }
  )
);