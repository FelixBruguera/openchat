import MarkdownRenderer from './MarkdownRenderer'

const StreamMessage = ({ message }) => {
  return (
    <div className="max-w-fit grow flex mb-3 flex-col items-start p-5 mx-5 w-fit rounded-xl group border bg-transparent text-black border-transparent dark:text-white">
      <MarkdownRenderer content={message} />
    </div>
  )
}

export default StreamMessage
