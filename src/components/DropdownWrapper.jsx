import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import ModelSearch from './ModelSearch'
import { memo } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSelectedModel } from '@/stores/useSelectedModel'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import FavoriteModels from './FavoriteModels'

const DropdownWrapper = memo(({ selectedModel }) => {
  const setSelectedModel = useSelectedModel((state) => state.setModel)
  const favoriteModels = useLiveQuery(
    () => db.favorite_models.toArray(),
    [],
    [],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-fit lg:max-w-6/10">
        <Button variant="outline">
          <p>{selectedModel.name}</p>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-70">
        <DropdownMenuRadioGroup value={selectedModel.id}>
          <DropdownMenuLabel>Favorite models</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {favoriteModels.length > 0 ? (
            favoriteModels.map((favorite) => (
              <DropdownMenuRadioItem
                key={favorite.id}
                value={favorite.id}
                onClick={() => setSelectedModel(favorite)}
              >
                {favorite.name}
              </DropdownMenuRadioItem>
            ))
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300 p-2">
              You don't have any favorite models
            </p>
          )}
          <DropdownMenuSeparator />
        </DropdownMenuRadioGroup>
        <div className="flex items-center justify-between px-2">
          <ModelSearch favoriteModels={favoriteModels} />
          <FavoriteModels favoriteModels={favoriteModels} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

export default DropdownWrapper
