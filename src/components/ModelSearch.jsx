import { Button } from './ui/button'
import { useState, useMemo } from 'react'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import ModelList from './ModelList'
import { Input } from './ui/input'
import { Switch } from './ui/switch'

const ModelSearch = () => {
  const favoritesQuery = useLiveQuery(
    'SELECT openrouter_id FROM favorite_models',
  )
  const favoriteModels = useMemo(() => {
    return favoritesQuery
      ? new Set(favoritesQuery.rows.map((row) => row.openrouter_id))
      : new Set()
  }, [favoritesQuery])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="my-2">
        Search models
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-3/4 w-full max-w-250! flex flex-col items-start gap-5">
          <DialogTitle className="h-fit">Models</DialogTitle>
          <div className="w-full flex flex-col gap-2 lg:flex-row justify-between max-w-200 mx-auto">
            <Input
              className="w-full lg:w-7/10 bg-transparent border border-gray-400"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center gap-2 lg:gap-6 justify-between lg:justify-start">
              <Button
                variant="secondary"
                disabled={search.length > 2 ? false : true}
                onClick={() => setSearch('')}
              >
                Clear
              </Button>
              <div className="flex items-center justify-evenly gap-2">
                <Switch
                  className="data-[state=unchecked]:bg-gray-400 "
                  checked={showDetails}
                  onCheckedChange={() =>
                    setShowDetails((previousState) => !previousState)
                  }
                />
                <p className="text-sm text-stone-300">Show details</p>
              </div>
            </div>
          </div>
          <ModelList
            favoriteModels={favoriteModels}
            search={search}
            showDetails={showDetails}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ModelSearch
