import { Button } from "./ui/button"
import { Input } from "./ui/input"
import useChat from "../hooks/useChat"
import { usePGlite, useLiveQuery } from "@electric-sql/pglite-react"
import { useNavigate, useParams } from "react-router"
import Message from "./Message"
import setTitle from "@/lib/setTitle"
import { Textarea } from "./ui/textarea"
import DropdownWrapper from "./DropdownWrapper"
import { ModeToggle } from "./mode-togle"
import { Brain, Globe, Search, SearchCheckIcon } from "lucide-react"
import { useSelector } from "react-redux"
import { useState } from "react"
import ErrorMessage from "./ErrorMessage"
import { Skeleton } from "./ui/skeleton"

const Chat = ({ isNew = false }) => {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [oldMessagesLimit, setOldMessagesLimit] = useState(0)
    const navigate = useNavigate()
    const params = useParams()
    const db = usePGlite()
    const messageQuery = useLiveQuery(`SELECT *
        FROM (
            SELECT *
            FROM messages
            WHERE chat_id = $1
            ORDER BY timestamp DESC
            LIMIT 20
        ) AS subquery
        ORDER BY timestamp DESC;`, [params.id] )
    const olderMessagesQuery = useLiveQuery(`
        SELECT *
        FROM (
            SELECT *
            FROM messages
            WHERE chat_id = $1
            ORDER BY timestamp DESC
            LIMIT $2
            OFFSET 20
        ) AS subquery
        ORDER BY timestamp DESC;`, 
        [params.id, oldMessagesLimit])
    const titleRequest = useLiveQuery(`SELECT title FROM chats WHERE id = $1`, [params.id] )
    const messages = messageQuery === undefined ? [] : messageQuery.rows
    let olderMessages = olderMessagesQuery === undefined ? [] : olderMessagesQuery.rows
    const loadMoreMessages = async (scrollTop) => {
        console.log(scrollTop)
        if (scrollTop <= 100) {
            setOldMessagesLimit((oldValue) => oldValue + 20 )
        }
    }
    const chatTitle = titleRequest === undefined ? [] : titleRequest.rows
    const message = useChat()
    const selectedModel = useSelector((state) => {
        const modelId = state.selectedModel.id
        return state.availableModels.find(model => model.id === modelId)
    })
    console.log(chatTitle)
    console.log(messages)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const prompt = e.target.prompt.value
        e.target.prompt.value = ''
        const formattedMessages = messages.reverse().map(mes => mes.model ? {role: 'assistant', content: mes.message } : {role: 'user', content: mes.message})
        formattedMessages.push({role: 'user', content: prompt})
        let chatId = params.id
        if (isNew) {
            const newChat = await db.query('INSERT INTO chats (title) VALUES ($1) RETURNING *', [' '])
            chatId = newChat.rows[0].id
            setTitle(db, chatId, prompt)
            navigate(`/${chatId}`)
        }
        console.log(chatId)
        db.query('INSERT INTO messages (timestamp, message, chat_id) VALUES ($1, $2, $3)', 
            [new Date().toLocaleString(), prompt, chatId])
        const response = await message(formattedMessages, selectedModel.id)
        if (response.choices) {
            db.query('INSERT INTO messages (timestamp, message, model, tokens, chat_id) VALUES ($1, $2, $3, $4, $5)', 
            [new Date().toLocaleString(), response.choices[0].message.content, selectedModel.name, response.usage.total_tokens, chatId])
        }
        else {
            setError(response)
        }
        setLoading(false)
    }

    const retrySubmit = async () => {
        const formattedMessages = messages.map(mes => mes.model ? {role: 'assistant', content: mes.message } : {role: 'user', content: mes.message})
        const response = await message(formattedMessages, selectedModel.id)
        if (response.choices) {
            db.query('INSERT INTO messages (timestamp, message, model, tokens, chat_id) VALUES ($1, $2, $3, $4, $5)', 
            [new Date().toLocaleString(), response.choices[0].message.content, selectedModel.name, response.usage.total_tokens, chatId])
        }
        else {
            setError(response)
        }
        setLoading(false)
    }
    console.log(olderMessages)
    return (
        <div className="w-full h-screen flex flex-col justify-between">
            <div className="flex flex-col-reverse justify-start overflow-y-auto h-full py-3 dark:bg-stone-900" onScrollEnd={(e) => loadMoreMessages(e.target.scrollTop)}>
                {error && !loading
                ? <ErrorMessage error={error} retry={() => {
                    setLoading(true)
                    setError(false)
                    retrySubmit()
                }}/> 
                : null }
                {loading
                ? <Skeleton className='p-5 mx-5 w-2/8 rounded-xl bg-stone-300 dark:bg-stone-700' />
                : null }
                { isNew ? null
                : messages.map(message => {
                    return (<Message key={message.id} data={message} />)
                })}
                {olderMessages?.map(message => {
                    return (<Message key={message.id} data={message} />)
                })}
            </div>
            <div className="p-3 flex flex-col gap-3 bg-gray-200 h-fit dark:bg-stone-800">
                <form className='flex justify-start items-center' onSubmit={(e) => {
                    setLoading(true)
                    handleSubmit(e)
                    }}>
                    <Textarea className='border-1 bg-white border-gray-400 w-9/10 max-w-300 h-fit max-h-45 text-2xl field-sizing-content dark:bg-neutral-700 transition-all' name="prompt" id="prompt" />
                    <Button type="submit" className='h-10 m-auto'>Send</Button>
                </form>
                <div className="flex items-center justify-start gap-5 transition-all">
                    <DropdownWrapper selectedModel={selectedModel}/>
                    <Button variant='outline'>
                        <Globe />
                        Search
                    </Button>
                    <Button variant='outline'>
                        <Brain />
                        Deep Thinking
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Chat