import MarkdownRenderer from './MarkdownRenderer'
import { memo } from 'react'
import { useState } from 'react'
import { Button } from './ui/button'
import { ChevronsDown, ChevronsUp, Copy, GitBranchIcon } from 'lucide-react'

const Message = memo(({ data, onBranch }) => {
  const isUser = data.model === null
  const [open, setOpen] = useState(false)
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isUser ? (
        <div
          className={`relative flex mb-3 flex-col items-start p-5 mx-5 w-fit max-w-5/8 border border-gray-300 rounded-xl group bg-neutral-100 dark:text-white 
                    dark:bg-neutral-700 dark:border-gray-700 overflow-clip ${open ? 'h-fit' : 'max-h-30'}`}
        >
          <p>{data.message}</p>
          {data.message.length > 350 ? (
            open ? (
              <Button
                className="z-1 absolute inset-x-0 inset-y-0 w-fit"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                <ChevronsUp />
              </Button>
            ) : (
              <Button
                className="z-1 absolute inset-x-0 w-fit inset-y-0"
                variant="outline"
                onClick={() => setOpen(true)}
              >
                <ChevronsDown />
              </Button>
            )
          ) : null}
        </div>
      ) : (
        <div className="max-w-fit grow flex mb-3 flex-col items-start p-5 mx-5 w-fit rounded-xl group border bg-transparent text-black border-transparent dark:text-white">
          <MarkdownRenderer content={data.message} />
          <div className="opacity-0 group-hover:opacity-100 flex transition-all items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            <p>{data.model}</p>
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
