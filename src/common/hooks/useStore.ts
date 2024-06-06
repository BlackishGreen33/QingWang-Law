import { create } from 'zustand';

type State = {
  activeMenu: boolean;
  setActiveMenu: (active: boolean) => void;
};

const useStore = create<State>((set) => ({
  activeMenu: true,

  setActiveMenu: (active) => set({ activeMenu: active }),
}));

export default useStore;
