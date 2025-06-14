import { createSlice } from '@reduxjs/toolkit'

const initialState = [
        {
            "id": "google/gemma-3-4b-it:free",
            "hugging_face_id": "google/gemma-3-4b-it",
            "name": "Google: Gemma 3 4B (free)",
            "created": 1741905510,
            "description": "Gemma 3 introduces multimodality, supporting vision-language input and text outputs. It handles context windows up to 128k tokens, understands over 140 languages, and offers improved math, reasoning, and chat capabilities, including structured outputs and function calling.",
            "context_length": 96000,
            "architecture": {
                "modality": "text+image-\u003Etext",
                "input_modalities": [
                    "text",
                    "image"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Gemini",
                "instruct_type": "gemma"
            },
            "pricing": {
              "prompt": "0",
              "completion": "0",
              "request": "0",
              "image": "0",
              "web_search": "0",
              "internal_reasoning": "0"
            },
        }
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