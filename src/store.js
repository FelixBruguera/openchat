import { configureStore } from '@reduxjs/toolkit'
import availableModelsReducer from './reducers/availableModels.js'
import selectedModelReducer from './reducers/selectedModel.js'
import apiKeyReducer from './reducers/apiKey.js'

const store = configureStore({
  reducer: {
    availableModels: availableModelsReducer,
    selectedModel: selectedModelReducer,
    apiKey: apiKeyReducer,
  },
})

export default store