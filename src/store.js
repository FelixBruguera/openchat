import { configureStore } from '@reduxjs/toolkit'
import availableModelsReducer from './reducers/availableModels.js'
import selectedModelReducer from './reducers/selectedModel.js'
import apiKeyReducer from './reducers/apiKey.js'
import systemPromptReducer from './reducers/systemPrompt.js'

const store = configureStore({
  reducer: {
    availableModels: availableModelsReducer,
    selectedModel: selectedModelReducer,
    apiKey: apiKeyReducer,
    systemPrompt: systemPromptReducer,
  },
})

export default store
