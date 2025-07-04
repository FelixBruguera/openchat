import { Button } from './ui/button'
import useChat from '../hooks/useChat'
import { usePGlite, useLiveQuery } from '@electric-sql/pglite-react'
import { useNavigate, useParams } from 'react-router'
import setTitle from '@/lib/setTitle'
import { Textarea } from './ui/textarea'
import DropdownWrapper from './DropdownWrapper'
import { useSelector } from 'react-redux'
import { useState, useCallback } from 'react'
import ChatMessages from './ChatMessages'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { format } from 'date-fns'

const Chat = ({ isNew = false }) => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const db = usePGlite()
  const messageQuery = useLiveQuery(
    `SELECT *
        FROM (
            SELECT *
            FROM messages
            WHERE chat_id = $1
            ORDER BY timestamp DESC)
            ORDER BY timestamp ASC;`,
    [params.id],
  )
  const messages = messageQuery === undefined ? [] : messageQuery.rows
  const message = useChat()
  const selectedModel = useSelector((state) => {
    return state.availableModels.find(
      (model) => model.name === state.selectedModel,
    )
  })
  const apiKey = useSelector((state) => state.apiKey)

  const formatMessages = (messages) =>
    messages.map((mes) =>
      mes.model
        ? { role: 'assistant', content: mes.message }
        : { role: 'user', content: mes.message },
    )
  const saveMessage = (fields) => {
    db.query(
      'INSERT INTO messages (timestamp, message, model, tokens, chat_id) VALUES ($1, $2, $3, $4, $5)',
      [
        format(new Date(), 'MM/dd/yyyy, HH:mm:ss'),
        fields.message,
        fields.model,
        fields.tokens,
        fields.chatId,
      ],
    )
  }
  const systemPrompt = useSelector((state) => state.systemPrompt)

  const handleSubmit = async (prompt) => {
    const formattedMessages = formatMessages(messages)
    formattedMessages.push({ role: 'user', content: prompt })
    if (systemPrompt) {
      formattedMessages.unshift({ role: 'system', content: systemPrompt })
    }
    let chatId = params.id
    if (isNew) {
      const newChat = await db.query(
        'INSERT INTO chats (title) VALUES ($1) RETURNING *',
        [' '],
      )
      chatId = newChat.rows[0].id
      setTitle(db, chatId, prompt, apiKey)
      navigate(`/${chatId}`)
    }
    saveMessage({
      message: prompt,
      chatId: chatId,
    })
    const response = await message(formattedMessages, selectedModel.id, apiKey)
    if (response.choices) {
      saveMessage({
        message: response.choices[0].message.content,
        model: selectedModel.name,
        tokens: response.usage.total_tokens,
        chatId: chatId,
      })
    } else {
      setError(response)
    }
    setLoading(false)
  }

  const retrySubmit = async () => {
    const formattedMessages = formatMessages(messages)
    if (systemPrompt) {
      formattedMessages.unshift({ role: 'system', content: systemPrompt })
    }
    const response = await message(formattedMessages, selectedModel.id, apiKey)
    let chatId = params.id
    if (response.choices) {
      saveMessage({
        message: response.choices[0].message.content,
        model: selectedModel.name,
        tokens: response.usage.total_tokens,
        chatId: chatId,
      })
    } else {
      setError(response)
    }
    setLoading(false)
  }

  const handleBranch = useCallback(
    async (messageId) => {
      const chatId = params.id
      const titleResult = await db.query(
        'SELECT title FROM chats WHERE id = $1',
        [chatId],
      )
      const previousTitle = titleResult.rows[0].title
      const newChat = await db.query(
        'INSERT INTO chats (title) VALUES ($1) RETURNING *',
        [`Branch from ${previousTitle}`],
      )
      const newId = newChat.rows[0].id
      db.query(
        `INSERT INTO messages (timestamp, message, model, tokens, chat_id)
             SELECT timestamp, message, model, tokens, $1
             FROM messages
             WHERE chat_id = $2 AND id <= $3
            `,
        [newId, chatId, messageId],
      )
      navigate(`/${newId}`)
    },
    [params.id, db, navigate],
  )

  const retry = () => {
    setError(false)
    setLoading(true)
    retrySubmit()
  }

  return (
    <div className="w-full h-dvh flex flex-col justify-between">
      <ChatMessages
        messages={messages}
        isNew={isNew}
        loading={loading}
        error={error}
        retry={retry}
        onBranch={handleBranch}
      />
      <div className="p-3 flex flex-col gap-3 bg-sidebar border-t-1 border-t-gray-300 dark:border-t-gray-900 h-fit dark:bg-sidebar">
        <form
          className="flex justify-start items-center"
          onSubmit={(e) => {
            e.preventDefault()
            if (!apiKey) {
              return null
            }
            const prompt = e.target.prompt.value
            e.target.prompt.value = ''
            setLoading(true)
            handleSubmit(prompt)
          }}
        >
          <Textarea
            className="border-1 bg-white border-gray-400 w-8/10 lg:w-9/10 max-w-300 h-fit max-h-45 field-sizing-content dark:bg-neutral-700 transition-all"
            name="prompt"
            id="prompt"
          />
          {apiKey ? (
            <Button type="submit" className="h-10 m-auto">
              Send
            </Button>
          ) : (
            <Popover>
              <PopoverTrigger className="h-10 m-auto">
                <Button type="submit" disabled={true}>
                  Send
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <p>Enter an API Key in Settings</p>
              </PopoverContent>
            </Popover>
          )}
        </form>
        <div className="flex items-center justify-start gap-5 transition-all">
          <DropdownWrapper selectedModel={selectedModel?.name} />
        </div>
      </div>
    </div>
  )
}

export default Chat
