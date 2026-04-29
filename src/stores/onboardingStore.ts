import { create } from 'zustand';

interface OnboardingState {
  categories: string[];
  pushEnabled: boolean;
  setCategories: (categories: string[]) => void;
  setPushEnabled: (enabled: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  categories: [],
  pushEnabled: true,
  setCategories: (categories) => set({ categories }),
  setPushEnabled: (pushEnabled) => set({ pushEnabled }),
}));
