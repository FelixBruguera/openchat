import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useState } from "react"
import { Button } from "./ui/button"
import { useSelector, useDispatch } from "react-redux"
import { setSelectedModel } from "@/reducers/selectedModel"
import ModelItem from "./ModelItem"
import { useCallback, useMemo, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLiveQuery } from "@electric-sql/pglite-react"
import { useVirtualizer } from '@tanstack/react-virtual'
import { Dialog, DialogTrigger,DialogContent, DialogTitle } from "./ui/dialog"
import ModelList from "./ModelList"
import { Input } from "./ui/input"


const ModelSearch = () => {
    const favoritesQuery = useLiveQuery('SELECT openrouter_id FROM favorite_models')
    const favoriteModels = useMemo(() => {
        return favoritesQuery ? new Set(favoritesQuery.rows.map(row => row.openrouter_id)) : new Set()
    }, [favoritesQuery]);
    const defaultQuery = useLiveQuery('SELECT openrouter_id FROM favorite_models WHERE isDefault = TRUE')
    const defaultModel = useMemo(() => defaultQuery?.[0]?.openrouter_id, [defaultQuery]);
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    return (
        <>
            <Button onClick={() => setOpen(true)} className='my-2'>
                Search models
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='h-3/4 flex flex-col items-start gap-5'>
                    <DialogTitle className='h-fit'>Models</DialogTitle>
                    <div className="w-full flex justify-between">
                        <Input className='w-8/10 bg-transparent border-1 border-gray-400' placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button 
                            variant='secondary' 
                            disabled={search.length > 2 ? false : true}
                            onClick={() => setSearch('')}>
                            Clear
                        </Button>
                    </div>
                        <ModelList favoriteModels={favoriteModels} defaultModel={defaultModel} search={search}/>
                </DialogContent>
            </Dialog>
        </>
        // <Dialog open={open} onOpenChange={setOpen}>
        //     <DialogTrigger>
        //         <Button className='my-2'>All Models</Button>
        //     </DialogTrigger>
        //     <DialogContent>
        //         <DialogTitle>Models</DialogTitle>
        //         <ModelList favoriteModels={favoriteModels} defaultModel={defaultModel} />
        //         {/* <div ref={listRef} className='h-100 overflow-auto w-full'>
        //             <div className='relative' style={{height: `${rowVirtualizer.getTotalSize()}px`}}>
        //                     {virtualItems.map(virtualRow => {
        //                     const model = availableModels[virtualRow.index]
        //                     return (
        //                         <div key={model.id} data-index={virtualRow.index} className='absolute' style={{transform: `translateY(${virtualRow.start}px)`, height: `${virtualRow.size}px`}}>
        //                             <ModelItem
        //                             onClick={onClick} name={model.name} id={model.id} isFavorite={favoriteModels.has(model.id)} isDefault={model.id === defaultModel}/>
        //                         </div>
        //                     )
        //                 })}
        //             </div>
        //         </div> */}
        //     </DialogContent>
        // </Dialog>
        // <>    
        //     <Button onClick={() => setOpen(true)} className='my-2'>
        //         Search models
        //     </Button>
        //     <CommandDialog open={open} onOpenChange={setOpen}>
        //         <CommandInput placeholder="Search by name..."/>
        //             <CommandGroup heading="Popular models">
        //                     <CommandList ref={listRef}>
        //                             <div className='relative' style={{height: `${rowVirtualizer.getTotalSize()}px`}}>
        //                                 {rowVirtualizer.getVirtualItems().map(virtualRow => {
        //                                     const model = availableModels[virtualRow.index]
        //                                     return (
        //                                         <div key={model.id} className='absolute' style={{transform: `translateY(${virtualRow.start}px)`}}>
        //                                             <ModelItem
        //                                             onClick={onClick} name={model.name} id={model.id} isFavorite={favoriteModels.has(model.id)} isDefault={model.id === defaultModel}/>
        //                                         </div>
        //                                     )
        //                                 })}
        //                             </div>
        //                             <CommandEmpty>No results found.</CommandEmpty>
        //                             {/* {availableModels.map(model => <ModelItem className='text-white' onClick={onClick} name={model.name} id={model.id} isFavorite={favoriteModels.has(model.id)} isDefault={model.id === defaultModel}/>)} */}
        //                     </CommandList>
        //             </CommandGroup>
        //     </CommandDialog>
        // </>
    )
}

export default ModelSearch