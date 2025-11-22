import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const fallbackModel = {
  name: 'Google: Gemma 3n 27B (free)',
  id: 'google/gemma-3-27b-it:free',
}

export const useSelectedModel = create(
  devtools((set) => ({
    model: fallbackModel,
    setModel: (model) => set({ model: model }),
  })),
)
