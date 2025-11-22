import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { useLocation } from 'react-router'
import { Button } from './ui/button'
import { ModeToggle } from './mode-togle'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import SidebarItemWrapper from './SidebarItemWrapper'
import Settings from './Settings'
import SidebarHeaderWrapper from './SidebarHeaderWrapper'
import { db } from '@/db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useStreamState } from '@/stores/useStreamState'

const SidebarWrapper = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const streaming = useStreamState((state) => state.streaming)
  const chats = useLiveQuery(
    async () => {
      const chatsResult = await db.chats.toArray()
      console.log(chatsResult)
      return Promise.all(
        chatsResult.map(async (chat) => {
          const lastMessage = await db.messages
            .where('chat_id')
            .equals(chat.id)
            .last()
          return { ...chat, lastMessage: lastMessage?.timestamp }
        }),
      )
    },
    [streaming],
    [],
  )
  const sortedChats = [...chats].sort((a, b) => b.lastMessage - a.lastMessage)
  console.log(sortedChats)
  const [open, setOpen] = useState(true)
  const updateTitle = (newTitle, chatId) => {
    db.chats.update(chatId, { title: newTitle })
  }
  const deleteChat = async (chatId) => {
    await db.chats.where('id').equals(chatId).delete()
    navigate('/')
  }
  return (
    <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={true}>
      <Sidebar collapsible="icon" side="left">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarHeaderWrapper />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
              <SidebarGroupAction onClick={() => navigate('/')}>
                <Plus />
              </SidebarGroupAction>
              <SidebarMenu>
                {open ? (
                  sortedChats.map((chat) => (
                    <SidebarMenuItem key={chat.id} asChild>
                      <SidebarMenuButton asChild>
                        <SidebarItemWrapper
                          chat={chat}
                          location={location}
                          updateTitle={updateTitle}
                          deleteChat={deleteChat}
                          disabled={streaming}
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <Button onClick={() => navigate('/')}>
                    <Plus />
                  </Button>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className={open && 'flex-row justify-evenly'}>
          <ModeToggle />
          <Settings />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

export default SidebarWrapper
