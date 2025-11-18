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
import { useLiveQuery } from '@electric-sql/pglite-react'
import ModelSearch from './ModelSearch'
import { memo } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSelectedModel } from '@/stores/useSelectedModel'

const DropdownWrapper = memo(({ selectedModel }) => {
  const setSelectedModel = useSelectedModel((state) => state.setModel)
  const query = useLiveQuery('SELECT * FROM favorite_models')
  const favorites = query === undefined ? [] : query.rows

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-fit max-w-6/10">
        <Button variant="outline">
          <p className="max-w-9/10 overflow-clip">{selectedModel.name}</p>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={selectedModel.id || selectedModel.openrouter_id}
        >
          <DropdownMenuLabel>Favorite models</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {favorites.length > 0 ? (
            favorites.map((favorite) => (
              <DropdownMenuRadioItem
                key={favorite.id}
                value={favorite.id}
                onClick={() => setSelectedModel(favorite)}
              >
                {favorite.name}
              </DropdownMenuRadioItem>
            ))
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300 py-2">
              You don't have any favorite models
            </p>
          )}
          <DropdownMenuSeparator />
        </DropdownMenuRadioGroup>
        <ModelSearch />
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

export default DropdownWrapper
