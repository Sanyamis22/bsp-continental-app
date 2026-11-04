import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
}

const createSidebarStore = () =>
  create<SidebarState>((set) => ({
    collapsed: false,
    toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  }));

/** UI-only state (no server data): whether the sidebar of each shell is collapsed. */
export const useClientSidebar = createSidebarStore();
export const useSuperAdminSidebar = createSidebarStore();
