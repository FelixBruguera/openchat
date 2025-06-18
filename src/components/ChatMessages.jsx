import { useEffect, useRef } from "react"
import Message from "./Message"
import ErrorMessage from "./ErrorMessage"
import { Skeleton } from "./ui/skeleton"
import { useVirtualizer } from "@tanstack/react-virtual"

const ChatMessages = ({ messages, isNew, loading, error, retry, onBranch }) => {
    const listRef = useRef(null)
    const itemCount = messages.length + (loading || error ? 1 : 0)
    const rowVirtualizer = useVirtualizer({
        count: itemCount,
        estimateSize: () => 100,
        getScrollElement: () => listRef.current,
        initialOffset: () => 5
    })
    const virtualItems = rowVirtualizer.getVirtualItems()

    useEffect(() => {
        rowVirtualizer.scrollToIndex(messages.length -1, {align: 'end'})
    }, [messages.length, rowVirtualizer])

    return (  
      <div ref={listRef} className="flex flex-col justify-start overflow-y-auto h-full bg-gray-100 py-3 dark:bg-stone-900">
        <div className='relative' style={{height: `${rowVirtualizer.getTotalSize()}px`}}>
            { !isNew && (
            <div className='absolute w-full' style={{transform: `translateY(${virtualItems[0]?.start ?? 0}px)`}}>
                {virtualItems.map(({ index, key }) => {
                    const isLoaderRow = index >= messages.length;
                    const message = messages[index]
                    return (
                        <div key={isLoaderRow ? 'status-item' : key} data-index={index} ref={rowVirtualizer.measureElement}>
                            { isLoaderRow ? (
                                <>
                                {loading && <Skeleton className='p-5 mx-5 w-2/8 rounded-xl bg-stone-300 dark:bg-stone-700' />}
                                {error && <ErrorMessage error={error} 
                                            retry={() => { retry() }
                                }/> }
                                </>
                            )
                            : ( <Message key={message.id} data={message} onBranch={onBranch} /> )
                            }
                        </div>
                    )
                })}
            </div>  
            )}
        </div>
    </div>)
}

export default ChatMessages