import { createSlice } from '@reduxjs/toolkit'

const selectedModelSlice = createSlice({
  name: 'selectedModel',
  initialState: "Google: Gemma 3 4B (free)",
  reducers: {
    setSelectedModel(state, action) {
      return action.payload
    },
  },
})

export const { setSelectedModel } = selectedModelSlice.actions
export default selectedModelSlice.reducer