import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useSystemPrompt = create(
  devtools((set) => ({
    prompt: '',
    setPrompt: (prompt) => set({ prompt: prompt }),
  })),
)
