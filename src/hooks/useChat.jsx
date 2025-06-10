import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePGlite } from "@electric-sql/pglite-react";

const useChat = () => {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const message = async(prompt) => {
        const body = {model: 'google/gemma-3n-e4b-it:free', messages: prompt}
        return await fetch(url, {
            method: 'POST',
            headers: {Authorization: 'Bearer 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', 'Content-Type': 'application/json'},
            body: JSON.stringify(body)
    })
        .then(response => response.json())
        .catch(error => error)
    }

    return message
}

export default useChat