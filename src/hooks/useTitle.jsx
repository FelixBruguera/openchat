import { db } from '@/db/db'
import { useApiKey } from '@/stores/useApiKey'
import { useSelectedModel } from '@/stores/useSelectedModel'

export default function useTitle() {
  const key = useApiKey((state) => state.key)
  const model = useSelectedModel((state) => state.model)
  const setTitle = async ({ chatId, prompt }) => {
    if (key) {
      await fetch('https://openrouter.ai/api/v1/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.id,
          prompt: `Generate a chat title from this prompt: ${prompt}.
                    Use the same language as the prompt. Make it concise, easy to understand and less than 50 characters long. 
                    Answer only with the title"}`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          db.chats.update(chatId, { title: data.choices[0].text })
        })
    } else {
      await fetch('api/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model.id,
          prompt: `Generate a chat title from this prompt: ${prompt}.
                Use the same language as the prompt. Make it concise, easy to understand and less than 50 characters long.  
                Answer only with the title`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          db.chats.update(chatId, { title: data.choices[0].message.content })
        })
    }
  }
  return setTitle
}
