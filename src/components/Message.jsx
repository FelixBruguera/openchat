import MarkdownRenderer from './MarkdownRenderer'
import { memo } from 'react'
import { useState } from 'react'
import { Button } from './ui/button'
import { ChevronDown, ChevronUp, Copy, GitBranchIcon } from 'lucide-react'
import { format } from 'date-fns'

const Message = memo(({ data, onBranch }) => {
  const isUser = !data?.model
  const [open, setOpen] = useState(false)
  if (!data) {
    return null
  }
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isUser ? (
        <div
          className={`flex mb-3 items-start py-3 px-4  mx-5 w-fit max-w-5/8 border border-gray-300 rounded-xl group bg-neutral-100 dark:text-white 
                    dark:bg-neutral-700 dark:border-gray-700 overflow-clip ${open ? 'h-fit' : 'max-h-30'}`}
        >
          <p>{data.message}</p>
          {data.message.length > 350 ? (
            open ? (
              <Button
                className="w-fit"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                <ChevronUp />
              </Button>
            ) : (
              <Button
                className="w-fit"
                variant="ghost"
                onClick={() => setOpen(true)}
              >
                <ChevronDown />
              </Button>
            )
          ) : null}
        </div>
      ) : (
        <div className="max-w-fit grow flex mb-3 flex-col items-start p-5 mx-5 w-fit rounded-xl group border bg-transparent text-black border-transparent dark:text-white">
          <MarkdownRenderer content={data.message} />
          <div className="opacity-0 group-hover:opacity-100 flex transition-all items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            <p>{data.model}</p>
            <p>{format(new Date(data.timestamp), 'MMM d y, HH:mm')}</p>
            <p>Tokens: {data.tokens}</p>
            <Button
              title="Copy"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(data.message)}
            >
              <Copy size={16} />
            </Button>
            <Button
              title="Branch from here"
              variant="ghost"
              onClick={() => onBranch(data.id)}
            >
              <GitBranchIcon size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})

export default Message
