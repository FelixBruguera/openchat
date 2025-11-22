import { useApiKey } from '@/stores/useApiKey'

const useChat = () => {
  const key = useApiKey((state) => state.key)
  const message = async ({ messages, model }) => {
    if (key) {
      return await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: true,
          streamOptions: { includeUsage: true },
        }),
      }).then((response) => response.body)
    } else {
      return await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: messages,
        }),
      }).then((response) => response.body)
    }
  }

  return message
}

export default useChat
