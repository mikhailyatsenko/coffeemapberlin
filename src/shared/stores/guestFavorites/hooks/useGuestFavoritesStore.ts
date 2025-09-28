import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type GuestFavoritesState } from '../types';

export const useGuestFavoritesStore = create<GuestFavoritesState>()(
  persist<GuestFavoritesState>(
    () => ({
      ids: [],
      infoShown: false,
    }),
    {
      name: 'guest-favorites-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
