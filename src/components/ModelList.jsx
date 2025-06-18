import { useSelector } from 'react-redux'
import ModelItem from './ModelItem'
import { useCallback, useState } from 'react'

const ModelList = ({ favoriteModels, search }) => {
  const availableModels = useSelector((state) => state.availableModels)
  const filterModels = () => {
    const cleanSearch = search.trim().toLowerCase()
    if (!cleanSearch || cleanSearch.replace(' ', '').length <= 2) {
      return []
    }
    const terms = cleanSearch.split(/ +/)
    return availableModels.filter((model) =>
      terms.every((term) => model.name.toLowerCase().includes(term)),
    )
  }
  const filteredModels = filterModels()
  const [defaultModel, setDefaultModel] = useState(
    localStorage.getItem('defaultModel'),
  )
  const saveDefault = useCallback((model) => {
    localStorage.setItem('defaultModel', model)
    setDefaultModel(model)
  }, [])
  return (
    <div className="h-full w-full overflow-auto">
      {search.length <= 2 ? (
        <p className="text-muted-foreground text-center text-md">
          Enter at least 3 characters
        </p>
      ) : (
        filteredModels.map((model) => (
          <ModelItem
            key={model.id}
            name={model.name}
            id={model.id}
            isFavorite={favoriteModels.has(model.id)}
            isDefault={model.name === defaultModel}
            saveDefault={saveDefault}
          />
        ))
      )}
    </div>
  )
}

export default ModelList
