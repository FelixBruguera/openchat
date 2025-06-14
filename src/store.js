import { configureStore } from '@reduxjs/toolkit'
import availableModelsReducer from './reducers/availableModels.js'
import selectedModelReducer from './reducers/selectedModel.js'

const store = configureStore({
  reducer: {
    availableModels: availableModelsReducer,
    selectedModel: selectedModelReducer,
  },
})

export default store