import { create } from 'zustand'

export const useToastStore = create((set) => ({
  message: null,
  type: 'success',
  visible: false,
  notify: (message, type = 'success') => {
    set({ message, type, visible: true })
    setTimeout(() => set({ visible: false, message: null }), 3000)
  },
  clear: () => set({ visible: false, message: null }),
}))
