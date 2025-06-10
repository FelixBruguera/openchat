const Message = ({ text, isUser }) => {
    const formattedText = text.replace('\n', '<br>')
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <p className={`flex flex-col items-start p-5 mx-5 w-fit max-w-5/8 border-1 border-gray-300 rounded-xl ${isUser ? "bg-blue-800 text-white" : "bg-gray-700 text-white"}`}>
                {formattedText}
            </p>
            <p>
            </p>
        </div>
    )
}

export default Message