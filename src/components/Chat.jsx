import { Button } from './ui/button'
import { useNavigate, useParams } from 'react-router'
import { Textarea } from './ui/textarea'
import DropdownWrapper from './DropdownWrapper'
import { useState, useCallback } from 'react'
import ChatMessages from './ChatMessages'
import { ArrowUp } from 'lucide-react'
import { useSelectedModel } from '@/stores/useSelectedModel'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import ChatTitle from './ChatTitle'
import { useStreamState } from '@/stores/useStreamState'
import { useSystemPrompt } from '@/stores/useSystemPrompt'
import useChat from '@/hooks/useChat'
import useTitle from '@/hooks/useTitle'

const decodeChunk = (chunk) => {
  let decodedContent = ''
  let tokens = null
  const chunks = chunk.split('\n\n')
  chunks.forEach((decodedChunk) => {
    if (decodedChunk.startsWith('data: ')) {
      try {
        const data = JSON.parse(decodedChunk.slice(6))
        decodedContent += data.choices?.[0]?.delta?.content
        tokens = data.usage?.total_tokens || data.usage?.totalTokens
      } catch {}
    }
  })
  return { content: decodedContent, usage: tokens }
}

const Chat = ({ isNew = false }) => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const chatId = parseInt(params.id) || 0
  const message = useChat()
  const setTitle = useTitle()
  const [streamingMessage, setStreamingMessage] = useState('')
  const startStream = useStreamState((state) => state.startStream)
  const stopStream = useStreamState((state) => state.stopStream)
  const streaming = useStreamState((state) => state.streaming)
  const messages = useLiveQuery(
    async () => {
      const data = await db.messages.where('chat_id').equals(chatId).toArray()
      return data
    },
    [params.id],
    [],
  )
  const chat = useLiveQuery(
    async () => {
      const data = await db.chats.where('id').equals(chatId).first()
      return data
    },
    [params.id],
    [],
  )
  const selectedModel = useSelectedModel((state) => state.model)

  const mapMessages = (messages) =>
    messages.map((mes) =>
      mes.model
        ? { role: 'assistant', content: mes.message }
        : { role: 'user', content: mes.message },
    )
  const formatMessages = (messages, prompt, systemPrompt) => {
    const formattedMessages = mapMessages(messages)
    prompt && formattedMessages.push({ role: 'user', content: prompt })
    if (systemPrompt) {
      formattedMessages.unshift({ role: 'system', content: systemPrompt })
    }
    return formattedMessages
  }
  const saveMessage = async (fields) => {
    await db.messages.add({
      timestamp: new Date(),
      message: fields.message,
      model: fields.model,
      tokens: fields.tokens,
      chat_id: fields.chatId,
    })
  }
  const systemPrompt = useSystemPrompt((state) => state.prompt)

  const handleSubmit = async (prompt, chatId) => {
    const formattedMessages = formatMessages(messages, prompt, systemPrompt)
    const decoder = new TextDecoder()
    await saveMessage({
      message: prompt,
      chatId: chatId,
    })
    startStream()
    setLoading(false)
    try {
      const stream = await message({
        model: selectedModel.id,
        messages: formattedMessages,
      })
      let buffer = ''
      let fullMessage = ''
      for await (const chunk of stream) {
        const line = decoder.decode(chunk)
        buffer += line
        if (buffer.endsWith('\n\n')) {
          const { content, usage } = decodeChunk(buffer)
          buffer = ''
          setStreamingMessage((prev) => prev + content)
          fullMessage += content
          if (usage) {
            await saveMessage({
              message: fullMessage,
              model: selectedModel.id,
              tokens: usage,
              chatId: chatId,
            })
            stopStream()
            setStreamingMessage('')
          }
        } else {
          continue
        }
      }
    } catch (e) {
      console.log(e)
      stopStream()
      setStreamingMessage('')
      setError(e)
    }
  }

  const handleNewChat = async (prompt) => {
    const id = await db.chats.add({
      title: prompt,
    })
    setTitle({ prompt: prompt, chatId: id })
    navigate(`/${id}`)
    handleSubmit(prompt, id)
  }

  const retrySubmit = async () => {
    const formattedMessages = formatMessages(messages, '', systemPrompt)
    const decoder = new TextDecoder()
    startStream()
    setLoading(false)
    try {
      const stream = await message({
        model: selectedModel.id,
        messages: formattedMessages,
      })
      let buffer = ''
      let fullMessage = ''
      for await (const chunk of stream) {
        const line = decoder.decode(chunk)
        buffer += line
        if (buffer.endsWith('\n\n')) {
          const { content, usage } = decodeChunk(buffer)
          buffer = ''
          setStreamingMessage((prev) => prev + content)
          fullMessage += content
          if (usage) {
            await saveMessage({
              message: fullMessage,
              model: selectedModel.id,
              tokens: usage,
              chatId: chatId,
            })
            stopStream()
            setStreamingMessage('')
          }
        } else {
          continue
        }
      }
    } catch (e) {
      console.log(e)
      stopStream()
      setStreamingMessage('')
      setError(e)
    }
  }

  const handleBranch = useCallback(
    async (messageId) => {
      const [titleResult, messagesResult] = await Promise.all([
        await db.chats.where('id').equals(chatId).toArray(),
        await db.messages
          .filter((t) => t.chat_id === chatId && t.id <= messageId)
          .toArray(),
      ])
      const previousTitle = titleResult[0].title
      const newChatId = await db.chats.add({
        title: `Branch from ${previousTitle}`,
      })
      const mappedMessages = messagesResult.map((message) => {
        return {
          timestamp: message.timestamp,
          message: message.message,
          model: message.model,
          tokens: message.tokens,
          chat_id: newChatId,
        }
      })
      db.messages.bulkAdd(mappedMessages)
      navigate(`/${newChatId}`)
    },
    [chatId, navigate],
  )

  const retry = () => {
    setError(false)
    setLoading(true)
    retrySubmit()
  }

  return (
    <div className="w-full h-dvh flex flex-col justify-between bg-neutral-200 dark:bg-stone-900">
      <ChatTitle chat={chat} />
      <ChatMessages
        messages={messages}
        isNew={isNew}
        loading={loading}
        error={error}
        retry={retry}
        onBranch={handleBranch}
        streamingMessage={streamingMessage}
      />
      <div className="p-3 flex flex-col gap-3 bg-transparent h-fit w-full max-w-350 mx-auto">
        <form
          className="flex justify-start items-center"
          onSubmit={(e) => {
            e.preventDefault()
            const prompt = e.target.prompt.value
            e.target.prompt.value = ''
            setLoading(true)
            isNew ? handleNewChat(prompt) : handleSubmit(prompt, chatId)
          }}
        >
          <Textarea
            className="text-base! lg:text-lg! border border-gray-400 dark:border-gray-700 rounded-lg w-8/10 lg:w-9/10 max-w-300 h-fit min-h-20 max-h-45 field-sizing-content bg-transparent dark:bg-transparent transition-all"
            name="prompt"
            id="prompt"
            required
          />
          <Button
            type="submit"
            variant="ghost"
            disabled={streaming}
            className="size-fit p-3 text-stone-700 dark:text-gray-300 mx-auto border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 hover:cursor-pointer rounded-lg transition-colors"
          >
            <ArrowUp className="size-5" />
          </Button>
        </form>
        <div className="flex items-center justify-start gap-5 transition-all">
          <DropdownWrapper selectedModel={selectedModel} />
        </div>
      </div>
    </div>
  )
}

export default Chat
