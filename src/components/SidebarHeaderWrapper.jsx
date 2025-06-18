import { useSidebar, SidebarHeader, SidebarGroupAction } from "./ui/sidebar"
import { Button } from "./ui/button"
import { ArrowRightToLine, ArrowLeftToLine } from "lucide-react"
import { useEffect } from "react"

const SidebarHeaderWrapper = () => {
    const { open, isMobile, openMobile, setOpen, setOpenMobile } = useSidebar()
    return (
        <SidebarHeader className='text-xl font-bold items-center'>
                  {open
                  ? 'Open Chat'
                  : <Button variant='outline' className='w-9' onClick={() => {isMobile ? setOpenMobile(true) : setOpen(true)}
                     }>
                      <ArrowRightToLine />
                    </Button>
                }
                <SidebarGroupAction onClick={() => {isMobile ? setOpenMobile(false) : setOpen(false)}}>
                  <ArrowLeftToLine />
                </SidebarGroupAction>
        </SidebarHeader>
    )
}

export default SidebarHeaderWrapper