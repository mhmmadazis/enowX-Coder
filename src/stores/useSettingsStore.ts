import { create } from 'zustand';
import { Provider } from '@/types';

interface SettingsState {
  providers: Provider[];
  defaultProviderId: string | null;
  setProviders: (providers: Provider[]) => void;
  setDefaultProviderId: (id: string | null) => void;
  addProvider: (provider: Provider) => void;
  removeProvider: (id: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  providers: [],
  defaultProviderId: null,
  setProviders: (providers) => set({ providers }),
  setDefaultProviderId: (id) => set({ defaultProviderId: id }),
  addProvider: (provider) => set((state) => ({ providers: [...state.providers, provider] })),
  removeProvider: (id) => set((state) => ({ 
    providers: state.providers.filter((p) => p.id !== id),
    defaultProviderId: state.defaultProviderId === id ? null : state.defaultProviderId
  })),
}));
