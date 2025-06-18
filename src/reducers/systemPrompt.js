import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('systemPrompt')

const systemPromptSlice = createSlice({
  name: 'systemPrompt',
  initialState: initialState,
  reducers: {
    setSystemPrompt(state, action) {
      return action.payload
    },
  },
})

export const { setSystemPrompt } = systemPromptSlice.actions
export default systemPromptSlice.reducer
