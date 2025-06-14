const useModels = async () => {
    const data = await fetch('https://openrouter.ai/api/v1/models')
    return await data.json()
}

export default useModels