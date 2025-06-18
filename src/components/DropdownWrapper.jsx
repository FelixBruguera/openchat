import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { useDispatch } from "react-redux"
import { useLiveQuery } from "@electric-sql/pglite-react"
import { setSelectedModel } from "@/reducers/selectedModel"
import ModelSearch from "./ModelSearch"
import { memo } from "react"

const DropdownWrapper = memo(({ selectedModel }) => {
    const dispatch = useDispatch()
    const query = useLiveQuery('SELECT * FROM favorite_models')
    const favorites = query === undefined ? [] : query.rows

    return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild className='w-fit max-w-6/10'>
            <Button>
                <p className="max-w-9/10 overflow-clip">{selectedModel}</p>
                <svg className='fill-white dark:fill-black' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#CCCCCC"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuRadioGroup value={selectedModel} onValueChange={(e) => dispatch(setSelectedModel(e))}>
                <DropdownMenuLabel>Favorite models</DropdownMenuLabel>
                <DropdownMenuSeparator />
                { favorites.length > 0 
                    ? favorites.map(favorite => 
                    <DropdownMenuRadioItem key={favorite.id} value={favorite.name}>{favorite.name}</DropdownMenuRadioItem>
                    )
                    : <p className="text-sm text-gray-600 dark:text-gray-300 py-2">You don't have any favorite models</p>
                }
                <DropdownMenuSeparator />
            </DropdownMenuRadioGroup>
            <ModelSearch/>
        </DropdownMenuContent>
    </DropdownMenu>
    )
})

export default DropdownWrapper