import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useStreamState = create(
  devtools((set) => ({
    streaming: false,
    startStream: () => set({ streaming: true }),
    stopStream: () => set({ streaming: false }),
  })),
)
