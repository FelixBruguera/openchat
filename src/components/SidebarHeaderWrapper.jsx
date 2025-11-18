import { useSidebar, SidebarHeader, SidebarGroupAction } from './ui/sidebar'
import { Button } from './ui/button'
import { ArrowRightToLine, ArrowLeftToLine } from 'lucide-react'

const SidebarHeaderWrapper = () => {
  const { open, isMobile, setOpen, setOpenMobile } = useSidebar()
  return (
    <SidebarHeader className="text-xl font-bold items-center">
      {open ? (
        <div className="flex items-center gap-2">
          <img src="/icon.png" className="size-7" alt="Open Chat" />
          <h1 className="text-xl">Open Chat</h1>
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center">
          <img src="/icon.png" className="size-8" />
          <Button
            variant="outline"
            className="w-9"
            onClick={() => {
              isMobile ? setOpenMobile(true) : setOpen(true)
            }}
          >
            <ArrowRightToLine />
          </Button>
        </div>
      )}
      <SidebarGroupAction
        onClick={() => {
          isMobile ? setOpenMobile(false) : setOpen(false)
        }}
      >
        <ArrowLeftToLine />
      </SidebarGroupAction>
    </SidebarHeader>
  )
}

export default SidebarHeaderWrapper
