import { useEffect, useRef } from 'react'
import Message from './Message'
import ErrorMessage from './ErrorMessage'
import { Skeleton } from './ui/skeleton'
import { useVirtualizer } from '@tanstack/react-virtual'
import StreamMessage from './StreamMessage'
import { useStreamState } from '@/stores/useStreamState'

const ChatMessages = ({
  messages,
  isNew,
  loading,
  error,
  retry,
  onBranch,
  streamingMessage,
}) => {
  const listRef = useRef(null)
  const streaming = useStreamState((state) => state.streaming)
  const itemCount = messages.length + (streaming || loading || error ? 1 : 0)
  const rowVirtualizer = useVirtualizer({
    count: itemCount,
    estimateSize: () => 100,
    getScrollElement: () => listRef.current,
    initialOffset: () => 5,
  })
  const virtualItems = rowVirtualizer.getVirtualItems()

  useEffect(() => {
    rowVirtualizer.scrollToIndex(messages.length - 1, { align: 'end' })
  }, [messages.length, rowVirtualizer])
  return (
    <div
      ref={listRef}
      className="flex flex-col justify-start overflow-y-auto h-full max-w-dvw lg:max-w-350 w-full mx-auto text-sm lg:text-base"
    >
      <div
        className="relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {!isNew && (
          <div
            className="absolute w-full"
            style={{
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map(({ index, key }) => {
              const isLoaderRow = index >= messages.length
              const message = messages[index]
              return (
                <div
                  key={isLoaderRow ? 'status-item' : key}
                  data-index={index}
                  ref={rowVirtualizer.measureElement}
                >
                  {isLoaderRow ? (
                    <>
                      {streaming && !error && streamingMessage === '' && (
                        <Skeleton className="p-5 mx-5 w-1/3 rounded-xl bg-stone-300 dark:bg-stone-700" />
                      )}
                      {streaming && (
                        <StreamMessage message={streamingMessage} />
                      )}
                      {error && (
                        <ErrorMessage
                          error={error}
                          retry={() => {
                            retry()
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <Message
                      key={message.id}
                      data={message}
                      onBranch={onBranch}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessages
