import { Button } from "./ui/button"
import { Input } from "./ui/input"
import useChat from "../hooks/useChat"
import { usePGlite, useLiveQuery } from "@electric-sql/pglite-react"
import { useNavigate, useParams } from "react-router"
import Message from "./Message"
import setTitle from "@/lib/setTitle"


const Chat = ({ isNew = false }) => {
    const navigate = useNavigate()
    const params = useParams()
    const db = usePGlite()
    const request = useLiveQuery(`SELECT *
        FROM (
            SELECT *
            FROM messages
            WHERE chat_id = $1
            ORDER BY timestamp DESC
            LIMIT 20
        ) AS subquery
        ORDER BY timestamp ASC;`, [params.id] )
    const titleRequest = useLiveQuery(`SELECT title FROM chats WHERE id = $1`, [params.id] )
    const messages = request === undefined ? [] : request.rows
    const chatTitle = titleRequest === undefined ? [] : titleRequest.rows
    const message = useChat()
    console.log(chatTitle)
    console.log(messages)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const prompt = e.target.prompt.value
        const formattedMessages = messages.map(mes => mes.isuser ? {role: 'user', content: mes.message} : {role: 'assistant', content: mes.message })
        formattedMessages.push({role: 'user', content: prompt})
        let chatId = params.id
        if (isNew) {
            const newChat = await db.query('INSERT INTO chats (model, title) VALUES ($1, $2) RETURNING *', ['google/gemma-3n-e4b-it:free', ' '])
            chatId = newChat.rows[0].id
            setTitle(db, chatId, prompt)
        }
        console.log(chatId)
        navigate(`/${chatId}`)
        db.query('INSERT INTO messages (timestamp, message, isUser, chat_id) VALUES ($1, $2, $3, $4)', 
            [new Date().toLocaleString(), prompt, true, chatId])
        const response = await message(formattedMessages)
        console.log(response)
        db.query('INSERT INTO messages (timestamp, message, isUser, chat_id) VALUES ($1, $2, $3, $4)', 
            [new Date().toLocaleString(), response.choices[0].message.content, false, chatId])
    }
    return (
        <div className="w-full h-screen flex flex-col justify-between">
            <div className="w-full p-6 h-1/20 bg-gray-100 flex items-center justify-center">
                <p className="text-lg font-bold">{chatTitle[0]?.title}</p>
            </div>
            <div className="flex flex-col justify-start overflow-y-auto h-8/10 py-3">
                { isNew ? null
                : messages.map(message => {
                    return (<Message key={message.id} text={message.message} isUser={message.isuser} />)
                })}
            </div>
            <form className='flex h-1/10 bg-gray-200' onSubmit={(e) => handleSubmit(e)}>
            <Input className='border-1 bg-white border-gray-400 h-6/10 m-auto w-9/10' type="text" name="prompt" id="prompt" />
            <Button type="submit" className='h-6/10 m-auto'>Send</Button>
            </form>
        </div>
    )
}

export default Chat