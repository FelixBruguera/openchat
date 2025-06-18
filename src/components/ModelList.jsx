import { useSelector } from "react-redux"
import ModelItem from "./ModelItem"

const ModelList = ({ favoriteModels, defaultModel, search}) => {
    const availableModels = useSelector(state => state.availableModels)
    const filterModels = () => {
        const cleanSearch = search.trim().toLowerCase()
        if (!cleanSearch || cleanSearch.replace(' ', '').length <= 2) {
            return []
        }
        const terms = cleanSearch.split(/ +/)
        return availableModels.filter(model => terms.every(term => model.name.toLowerCase().includes(term)))
    }
    const filteredModels = filterModels()
    return (
            <div className="h-full w-full overflow-auto">
                        {search.length <= 2 ?
                        <p className="text-muted-foreground text-center text-md">Enter at least 3 characters</p>
                        : filteredModels.map(model => 
                        <ModelItem
                                key={model.id} name={model.name} id={model.id} isFavorite={favoriteModels.has(model.id)} isDefault={model.id === defaultModel}
                                />
                            )
                        }
            </div>
    )
}

export default ModelList