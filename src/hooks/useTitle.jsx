import { db } from '@/db/db'
import { useApiKey } from '@/stores/useApiKey'
import { useSelectedModel } from '@/stores/useSelectedModel'

export default function useTitle() {
  const key = useApiKey((state) => state.key)
  const model = useSelectedModel((state) => state.model)
  const setTitle = async ({ chatId, prompt }) => {
    const systemPrompt = (prompt) => [
        { role: "system", "content": "You're a chat title generator. Only answer with a short and concise title. Use up to 50 characters. Return ONLY the text of the title. Do not answer the user's request"},
        { role: "user", "content": prompt }]
    if (key) {
      await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.id,
          messages: systemPrompt(prompt)
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          db.chats.update(chatId, { title: data.choices[0].message.content })
        })
    } else {
      await fetch('api/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model.id,
          messages: systemPrompt(prompt),
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
