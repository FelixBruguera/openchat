import { useLiveQuery } from '@electric-sql/pglite-react'
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
  SidebarHeader
} from "@/components/ui/sidebar"
import { NavLink, useLocation, Link } from 'react-router'
import { Button } from './ui/button'

const SidebarWrapper = () => {
    const location = useLocation()
    const request = useLiveQuery(`
        SELECT * FROM chats`)
    const chats = request === undefined ? [] : request.rows
    console.log(chats)
    console.log(location)
    return (
    <SidebarProvider>
       <Sidebar>
           <SidebarContent>
            <SidebarGroup>
              <SidebarHeader>Open Chat</SidebarHeader>
                      <Button>
                            <Link to={'/'} className='w-full'>New</Link>
                      </Button>
              <SidebarGroupContent>
                <SidebarGroupLabel>Chats</SidebarGroupLabel>
                <SidebarMenu>
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.id} asChild>
                      <SidebarMenuButton asChild>
                        <NavLink to={`/${chat.id}`} className={
                        location.pathname === `/${chat.id}` ? 'bg-gray-200 font-bold,' : null}>
                          {chat.title}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
                 </SidebarContent>
       </Sidebar>
    </SidebarProvider>
    )
}

export default SidebarWrapper