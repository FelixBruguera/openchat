import { useState } from "react"
import { Input } from "./ui/input"
import { Edit, Save, X } from "lucide-react"
import { NavLink } from "react-router"
import { Button } from "./ui/button"

const SidebarItemWrapper = ({ chat, location, updateTitle }) => {
    const [editing, setEditing] = useState(false)
    const [titleInput, setTitleInput] = useState(chat.title)
    const onUpdate = () => {
        setEditing(false)
        updateTitle(titleInput, chat.id)
    }

    return (
        editing
        ? <div className='flex flex-col items-center justify-between p-2 gap-3 '>
            <Input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} />
            <div className="flex w-full items-center justify-evenly">
                <Button className='relative right-0 z-3' onClick={() => onUpdate()}><Save /></Button>
                <Button className='relative right-0 z-3' variant='destructive' onClick={() => setEditing(false)}><X /></Button>
            </div>
        </div>
        : <div className={`flex items-center justify-between p-2 rounded-lg group hover:bg-gray-100 dark:hover:bg-stone-800 ${location.pathname === `/${chat.id}` ? 'bg-gray-200 dark:bg-neutral-700 font-bold' : null} `}>
            <NavLink to={`/${chat.id}`} className='w-full'>
                {chat.title}
            </NavLink>
            <Button className='group-hover/menu-item:opacity-100 opacity-0' variant='outline' onClick={() => setEditing(true)}><Edit /></Button>
        </div>
    )
}

export default SidebarItemWrapper