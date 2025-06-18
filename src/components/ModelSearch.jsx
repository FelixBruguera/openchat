import { Button } from './ui/button'
import { useState, useMemo } from 'react'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import ModelList from './ModelList'
import { Input } from './ui/input'

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

  return (
    <>
      <Button onClick={() => setOpen(true)} className="my-2">
        Search models
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-3/4 flex flex-col items-start gap-5">
          <DialogTitle className="h-fit">Models</DialogTitle>
          <div className="w-full flex justify-between">
            <Input
              className="w-8/10 bg-transparent border-1 border-gray-400"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="secondary"
              disabled={search.length > 2 ? false : true}
              onClick={() => setSearch('')}
            >
              Clear
            </Button>
          </div>
          <ModelList favoriteModels={favoriteModels} search={search} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ModelSearch
