import ModelItem from './ModelItem'
import { useCallback, useState } from 'react'
import { useAvailableModels } from '@/stores/useAvailableModels'

const ModelList = ({ favoriteModels, search, showDetails }) => {
  const availableModels = useAvailableModels((state) => state.models)
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
    localStorage.setItem(
      'defaultModel',
      JSON.stringify({ name: model.name, openrouter_id: model.id }),
    )
    setDefaultModel(model)
  }, [])
  return (
    <ul className="h-full w-full overflow-auto flex flex-col gap-6 lg:gap-3">
      {search.length <= 2 ? (
        <li className="text-muted-foreground text-center text-md">
          Enter at least 3 characters
        </li>
      ) : (
        filteredModels.map((model) => (
          <ModelItem
            key={model.id}
            model={model}
            isFavorite={favoriteModels.has(model.id)}
            isDefault={model.name === defaultModel.name}
            saveDefault={saveDefault}
            showDetails={showDetails}
          />
        ))
      )}
    </ul>
  )
}

export default ModelList
