const useChat = () => {
    const url = 'https://openrouter.ai/api/v1/chat/completions'

    const message = async(prompt, model) => {
        const body = {model: model, messages: prompt}
        return await fetch(url, {
            method: 'POST',
            headers: {Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(body)
    })
        .then(response => response.json())
        .catch(error => error)
    }

    return message
}

export default useChat