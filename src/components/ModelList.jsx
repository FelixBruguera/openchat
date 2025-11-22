import ModelItem from './ModelItem'
import { useAvailableModels } from '@/stores/useAvailableModels'
import { db } from '@/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

const ModelList = ({ search, showDetails, favoriteModelsIds }) => {
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
  const defaultModel = useLiveQuery(
    () => db.favorite_models.where('is_default').equals(1).first(),
    [],
    {},
  )
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
            isFavorite={favoriteModelsIds.has(model.id)}
            isDefault={model.id === defaultModel?.id}
            defaultModelId={defaultModel?.id}
            showDetails={showDetails}
          />
        ))
      )}
    </ul>
  )
}

export default ModelList
