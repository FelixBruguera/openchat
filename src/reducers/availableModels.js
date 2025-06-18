import { createSlice } from '@reduxjs/toolkit'
import modelList from '../lib/models.json'

const initialState = [
  {
    id: 'google/gemma-3-4b-it:free',
    name: 'Google: Gemma 3 4B (free)',
  },
]

const availableModelsSlice = createSlice({
  name: 'availableModels',
  initialState: initialState,
  reducers: {
    setAvailableModels(state, action) {
      return action.payload
    },
  },
})

export const { setAvailableModels } = availableModelsSlice.actions
export default availableModelsSlice.reducer
