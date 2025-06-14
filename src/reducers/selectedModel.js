import { createSlice } from '@reduxjs/toolkit'

const selectedModelSlice = createSlice({
  name: 'selectedModel',
  initialState: {
    "id": "google/gemma-3-4b-it:free"
  },
  reducers: {
    setSelectedModel(state, action) {
      return action.payload
    },
  },
})

export const { setSelectedModel } = selectedModelSlice.actions
export default selectedModelSlice.reducer