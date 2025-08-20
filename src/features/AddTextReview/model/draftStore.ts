import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AddTextReviewDraftState {
  draftsByPlaceId: Record<string, string>;
  setDraft: (placeId: string, text: string) => void;
  clearDraft: (placeId: string) => void;
}

export const useAddTextReviewDraftStore = create<AddTextReviewDraftState>()(
  persist(
    (set) => ({
      draftsByPlaceId: {},
      setDraft: (placeId, text) => {
        set((state) => {
          if (text.trim().length === 0) {
            const { [placeId]: _omitted, ...rest } = state.draftsByPlaceId;
            return { draftsByPlaceId: rest };
          }
          return { draftsByPlaceId: { ...state.draftsByPlaceId, [placeId]: text } };
        });
      },
      clearDraft: (placeId) => {
        set((state) => {
          if (!(placeId in state.draftsByPlaceId)) return state;
          const { [placeId]: _omitted, ...rest } = state.draftsByPlaceId;
          return { draftsByPlaceId: rest };
        });
      },
    }),
    {
      name: 'add-text-review-drafts',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ draftsByPlaceId: state.draftsByPlaceId }),
    },
  ),
);
