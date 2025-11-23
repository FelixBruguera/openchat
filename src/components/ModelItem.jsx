import { memo } from 'react'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { format } from 'date-fns'
import { db } from '@/db/db'
import { Bookmark } from 'lucide-react'

const ModelDetail = ({ children }) => {
  return (
    <li className="flex items-center gap-1 text-xs lg:text-sm text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-900 bg-transparent px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors">
      {children}
    </li>
  )
}

const formatContext = (contextLength) => {
  return new Intl.NumberFormat('en', {
    notation: contextLength > 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 0,
  }).format(contextLength)
}

const ModelItem = memo(
  ({ model, isFavorite, isDefault, showDetails, defaultModelId }) => {
    const onFavorite = () =>
      db.favorite_models.add({
        id: model.id,
        name: model.name,
        is_default: 0,
      })
    const setDefault = async () =>
      await Promise.all([
        db.favorite_models.update(defaultModelId, { is_default: 0 }),
        db.favorite_models.update(model.id, { is_default: 1 }),
      ])
    const removeFavorite = () =>
      db.favorite_models.where('id').equals(model.id).delete()
    const contextLength = formatContext(model.context_length)
    return (
      <li value={model.name} className="w-full max-w-200 mx-auto">
        <div className="flex flex-col items-start gap-2 lg:gap-0">
          <div className="h-10 w-full flex items-center justify-between z-0">
            <h2 className="text-sm lg:text-base">{model.name}</h2>
            <div className="flex items-center justify-evenly z-1">
              <Switch
                className="data-[state=unchecked]:bg-gray-400 "
                checked={isFavorite}
                onCheckedChange={
                  isFavorite ? () => removeFavorite() : () => onFavorite()
                }
              />
              <Button
                variant="ghost"
                onClick={() => setDefault()}
                title="Default model"
                disabled={!isFavorite}
              >
                <Bookmark
                  className={`size-5 ${isDefault ? 'fill-black dark:fill-white' : 'fill-transparent'}`}
                />
              </Button>
            </div>
          </div>
          {showDetails && (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-stone-600 dark:text-stone-400 text-justify w-full">
                {model.description}
              </p>
              <ul className="flex gap-3 flex-wrap lg:flex-nowrap">
                <ModelDetail>
                  <p>{format(new Date(model.created * 1000), 'MMM y')}</p>
                </ModelDetail>
                <ModelDetail>
                  <p>{contextLength}</p>
                  <p>Context</p>
                </ModelDetail>
                <ModelDetail>
                  <p>${(model.pricing.prompt * 1000000).toFixed(2)}/M</p>
                  <p>Input</p>
                </ModelDetail>
                <ModelDetail>
                  <p>${(model.pricing.completion * 1000000).toFixed(2)}/M</p>
                  <p>Output</p>
                </ModelDetail>
              </ul>
            </div>
          )}
        </div>
      </li>
    )
  },
)

export default ModelItem
