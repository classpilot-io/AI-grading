import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (userDetails: any) => set({ user: userDetails }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'user-storage', 
        }
    )
);

export default useUserStore;