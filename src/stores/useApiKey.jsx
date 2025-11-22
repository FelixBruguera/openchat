import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const key = localStorage.getItem('apiKey')

export const useApiKey = create(
  devtools((set) => ({
    key: key,
    setKey: (key) => set({ key: key }),
  })),
)
