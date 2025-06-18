import { useState } from "react"
import { Input } from "./ui/input"
import { Edit, Save, X } from "lucide-react"
import { NavLink } from "react-router"
import { Button } from "./ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const SidebarItemWrapper = ({ chat, location, updateTitle, deleteChat }) => {
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
            <Dialog>
                <ContextMenu>
                    <ContextMenuTrigger>{chat.title}</ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onClick={() => setEditing(true)}>Edit</ContextMenuItem>
                            <DialogTrigger asChild>
                                <ContextMenuItem>Delete</ContextMenuItem>
                            </DialogTrigger>
                        </ContextMenuContent>
                    </ContextMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Deleting {chat.title} </DialogTitle>
                            <DialogDescription>
                                Are you sure?
                            </DialogDescription>
                        </DialogHeader>
                            <DialogFooter>
                                <DialogClose>Cancel</DialogClose>
                                <Button onClick={() => deleteChat(chat.id)}>Delete</Button>
                            </DialogFooter>
                    </DialogContent>
            </Dialog>
            </NavLink>
        </div>
    )
}

export default SidebarItemWrapper