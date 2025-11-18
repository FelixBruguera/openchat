import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const defaultModel = JSON.parse(localStorage.getItem('defaultModel'))
const fallbackModel = {
  name: 'Google: Gemma 3n 2B (free)',
  id: 'google/gemma-3n-e2b-it:free',
  openrouter_id: 'google/gemma-3n-e2b-it:free',
}

export const useSelectedModel = create(
  devtools((set) => ({
    model: defaultModel || fallbackModel,
    setModel: (model) => set({ model: model }),
  })),
)
