import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAvailableModels = create(
  devtools((set) => ({
    models: [],
    setModels: (models) => set({ models: models }),
  })),
)
