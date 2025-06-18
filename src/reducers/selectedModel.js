import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('defaultModel') || 'Google: Gemma 3 4B (free)'

const selectedModelSlice = createSlice({
  name: 'selectedModel',
  initialState: initialState,
  reducers: {
    setSelectedModel(state, action) {
      return action.payload
    },
  },
})

export const { setSelectedModel } = selectedModelSlice.actions
export default selectedModelSlice.reducer