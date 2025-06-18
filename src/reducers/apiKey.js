import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('apiKey')

const apiKeySlice = createSlice({
  name: 'apiKey',
  initialState: initialState,
  reducers: {
    setApiKey(state, action) {
      return action.payload
    },
  },
})

export const { setApiKey } = apiKeySlice.actions
export default apiKeySlice.reducer
