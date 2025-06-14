import MarkdownRenderer from './MarkdownRenderer';

const Message = ({ data }) => {
    const isUser = data.model === null
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            {isUser 
            ? <div className='flex mb-3 flex-col items-start p-5 mx-5 w-fit max-w-5/8 border-1 border-gray-300 rounded-xl group bg-blue-600 text-white dark:bg-blue-900 dark:border-gray-700'>
                <p>{data.message}</p> 
                </div>
            : <div className='max-w-fit grow-1 flex mb-3 flex-col items-start p-5 mx-5 w-fit rounded-xl group border-1 bg-transparent text-black hover:border-gray-300 border-transparent dark:text-white dark:hover:border-gray-800'>
                    <MarkdownRenderer content={data.message}/>
                    <div className='opacity-0 group-hover:opacity-100 flex transition-all items-center gap-3 text-xs text-gray-600 dark:text-gray-300'>
                        <p>{data.model}</p>
                        <p>Tokens: {data.tokens}</p>
                    </div>
                </div>
                }
        </div>
    )
}

export default Message