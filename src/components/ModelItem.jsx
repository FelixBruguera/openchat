import { memo } from "react"
import { CommandItem } from "./ui/command"
import { Star, Bookmark } from "lucide-react"
import { usePGlite } from "@electric-sql/pglite-react"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"

const ModelItem = memo(({ name, id, isFavorite, isDefault }) => {
    const db = usePGlite()
    const onFavorite = () => db.query('INSERT INTO favorite_models (openrouter_id, name) VALUES ($1, $2)', [id, name])
    const removeFavorite = () => db.query('DELETE FROM favorite_models WHERE openrouter_id = $1', [id])
    const onDefault = () => db.query(`INSERT INTO favorite_models 
                                    (openrouter_id, isDefault) 
                                    VALUES ($1, $2) 
                                    ON CONFLICT(openrouter_id) 
                                    DO UPDATE
                                    SET isDefault = $2`, [id, true])
    return (
        <div value={name} className='w-full'>
            <span className="h-10 w-full grid grid-cols-5 grid-rows-1 items-center z-0">
                <p className="col-start-1 col-end-5">{name}</p>
                <div className="col-start-5 col-end-6 flex items-center justify-evenly z-1">
                   <Switch className='data-[state=unchecked]:bg-gray-400 ' checked={isFavorite} onCheckedChange={isFavorite ? () => removeFavorite() : () => onFavorite()} />
                   <Bookmark fill={isDefault ? 'blue' : null} />
                </div>
            </span>
        </div>
    )
})

export default ModelItem