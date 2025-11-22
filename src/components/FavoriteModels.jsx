import { Button } from './ui/button'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import ModelItem from './ModelItem'

const FavoriteModels = ({ favoriteModels }) => {
  const [open, setOpen] = useState(false)
  const defaultModel = useLiveQuery(
    () => db.favorite_models.where('is_default').equals(1).first(),
    [],
    {},
  )

  return (
    <>
      <Button onClick={() => setOpen(true)} className="my-2">
        Manage
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-fit min-h-100 lg:w-200 lg:max-w-250! flex flex-col items-start gap-5">
          <DialogTitle className="h-fit">Favorite Models</DialogTitle>
          <ul className="h-full w-full overflow-auto flex flex-col gap-6 lg:gap-3">
            {favoriteModels.length > 0 ? (
              favoriteModels.map((model) => (
                <ModelItem
                  key={model.id}
                  model={model}
                  isFavorite={true}
                  isDefault={model.id === defaultModel?.id}
                  defaultModelId={defaultModel?.id}
                  showDetails={false}
                />
              ))
            ) : (
              <li className="text-center dark:text-stone-300 text-stone-600">
                You don't have any favorite models
              </li>
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FavoriteModels
