import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
  message: null,
  timeoutId: null,
  showNotification: (message) => {
    if (get().timeoutId) {
      clearTimeout(get().timeoutId)
    }
    const timeoutId = setTimeout(() => {
      set({ message: null, timeoutId: null })
    }, 5000)
    set({ message, timeoutId })
  }
}))

export default useNotificationStore