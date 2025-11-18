import { memo } from 'react'
import { CommandItem } from './ui/command'
import { Calendar, LucideAArrowDown, Pin } from 'lucide-react'
import { usePGlite } from '@electric-sql/pglite-react'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { format } from 'date-fns'

const ModelDetail = ({ children }) => {
  return (
    <li className="flex items-center gap-1 text-sm text-stone-300 border border-stone-900 bg-transparent px-2 py-1 rounded-lg hover:bg-stone-900 transition-colors">
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
  ({ model, isFavorite, isDefault, saveDefault, showDetails }) => {
    const db = usePGlite()
    const onFavorite = () =>
      db.query(
        'INSERT INTO favorite_models (openrouter_id, name) VALUES ($1, $2)',
        [model.id, model.name],
      )
    const removeFavorite = () =>
      db.query('DELETE FROM favorite_models WHERE openrouter_id = $1', [
        model.id,
      ])
    const contextLength = formatContext(model.context_length)
    return (
      <li value={model.name} className="w-full max-w-200 mx-auto">
        <div className="flex flex-col items-start gap-2 lg:gap-0">
          <div className="h-10 w-full flex items-center justify-between z-0">
            <h2 className="text-xl">{model.name}</h2>
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
                onClick={() => saveDefault(model)}
                title="Default model"
              >
                <Pin
                  className={`size-5 ${isDefault ? 'fill-black dark:fill-white' : 'fill-transparent'}`}
                />
              </Button>
            </div>
          </div>
          {showDetails && (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-stone-400 text-justify w-full">
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
