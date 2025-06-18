import { useLiveQuery, usePGlite } from '@electric-sql/pglite-react'
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
import {
  Plus,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import SidebarItemWrapper from './SidebarItemWrapper'
import Settings from './Settings'
import SidebarHeaderWrapper from './SidebarHeaderWrapper'

const SidebarWrapper = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const db = usePGlite()
  const request = useLiveQuery(`
    SELECT c.id, c.title
    FROM chats c
    JOIN (
        SELECT chat_id, MAX(timestamp) AS last_message_timestamp
        FROM messages
        GROUP BY chat_id
    ) AS last_messages ON c.id = last_messages.chat_id
    ORDER BY last_messages.last_message_timestamp DESC;`)
  const chats = request === undefined ? [] : request.rows
  const [open, setOpen] = useState(true)
  const updateTitle = (newTitle, chatId) => {
    db.query('UPDATE chats SET title = $1 WHERE id = $2', [newTitle, chatId])
  }
  const deleteChat = async (chatId) => {
    await db.query('DELETE FROM chats WHERE id = $1', [chatId])
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
                  chats.map((chat) => (
                    <SidebarMenuItem key={chat.id} asChild>
                      <SidebarMenuButton asChild>
                        <SidebarItemWrapper
                          chat={chat}
                          location={location}
                          updateTitle={updateTitle}
                          deleteChat={deleteChat}
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
