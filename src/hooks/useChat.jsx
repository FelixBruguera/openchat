const useChat = () => {
    const url = 'https://openrouter.ai/api/v1/chat/completions'

    const message = (prompt, model, key) => {
        const body = {model: model, messages: prompt}
        return fetch(url, {
            method: 'POST',
            headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(body)
    })
        .then(response => response.json())
        .catch(error => error)
    }

    return message
}

export default useChat