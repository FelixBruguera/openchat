import { useState } from 'react'
import { Button } from './ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

const ChatTitle = ({ chat }) => {
  const [titleOpen, setTitleOpen] = useState(false)
  if (!chat || chat.length < 1) {
    return null
  }
  return (
    <div className="flex py-5 h-fit items-start justify-between gap-3 w-8/10 mx-auto overflow-hidden">
      <h2
        className={`max-w-9/10 text-base font-semibold text-justify  mx-auto`}
      >
        {titleOpen ? chat.title.slice(0, 5000) : chat.title.slice(0, 100)}
      </h2>
      {chat.title?.length > 100 ? (
        <Button
          className="place-self-center"
          variant="ghost"
          onClick={() => setTitleOpen((prev) => !prev)}
        >
          {titleOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      ) : null}
    </div>
  )
}

export default ChatTitle
