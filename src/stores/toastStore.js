import { create } from 'zustand'

export const useToastStore = create((set) => ({
  message: null,
  type: 'success',
  visible: false,
  favLink: false,
  notify: (message, type = 'success', favLink = false) => {
    set({ message, type, visible: true, favLink })
    setTimeout(() => set({ visible: false, message: null, favLink: false }), 3000)
  },
  clear: () => set({ visible: false, message: null, favLink: false }),
}))
