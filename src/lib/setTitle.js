export default async function setTitle(db, chatId, prompt) {
    const url = 'https://openrouter.ai/api/v1/completions';
    await fetch(url, {
        method: 'POST',
        headers: {Authorization: 'Bearer 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', 'Content-Type': 'application/json'},
        body: `{"model":"google/gemma-3-4b-it:free","prompt":"Generate a chat title from this prompt: ${prompt}.
        Use the same language as the prompt. Make it concise, easy to understand and less than 50 characters long. 
        Answer only with the title"}`
    })
        .then(response => response.json())
        .then(data => {
            db.query('UPDATE chats SET title = $1 WHERE id = $2', 
            [data.choices[0].text, chatId])
        })
        .catch(error => error)
}