import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { useSelector } from "react-redux"
import ModelItem from "./ModelItem"
import { CommandList, CommandEmpty } from "./ui/command"
import { ScrollArea } from "./ui/scroll-area"

const ModelList = ({ favoriteModels, defaultModel, search}) => {
    const availableModels = useSelector(state => state.availableModels)
    const filterModels = () => {
        const cleanSearch = search.trim().toLowerCase()
        if (!cleanSearch || cleanSearch.replace(' ', '').length <= 2) {
            return []
        }
        const terms = cleanSearch.split(/ +/)
        console.log(terms)
        return availableModels.filter(model => terms.every(term => model.name.toLowerCase().includes(term)))
    }
    const filteredModels = filterModels()
    // const listRef = useRef(null)
    // const rowVirtualizer = useVirtualizer({
    //     count: filteredModels.length,
    //     getScrollElement: () => listRef.current,
    //     estimateSize: () => 80,
    //     key: open ? 'open' : 'closed',
    //     overscan: 5,
    // })
    console.log([filteredModels, search])
    // const virtualItems = rowVirtualizer.getVirtualItems()
    return (
            <div className="h-full w-full overflow-auto">
                        {search.length <= 2 ?
                        <p className="text-muted-foreground text-center text-md">Enter at least 3 characters</p>
                        : filteredModels.map(model => 
                        <ModelItem
                                key={model.id} name={model.name} id={model.id} isFavorite={favoriteModels.has(model.id)} isDefault={model.id === defaultModel}
                                />
                            )
                        }
                    {/* <p>No results found.</p> */}
                    {/* {availableModels.map(model => <ModelItem className='text-white' onClick={onClick} name={model.name} id={model.id} isFavorite={favoriteModels.has(model.id)} isDefault={model.id === defaultModel}/>)} */}
            </div>
        //  <div ref={listRef} className='h-100 overflow-auto w-full'>
        //     <div className='relative' style={{height: `${rowVirtualizer.getTotalSize()}px`}}>
        //             {virtualItems.map(virtualRow => {
        //             const model = availableModels[virtualRow.index]
        //             return (
        //                 <div key={model.id} data-index={virtualRow.index} className='absolute' style={{transform: `translateY(${virtualRow.start}px)`, height: `${virtualRow.size}px`}}>
        //                     <ModelItem
        //                     name={model.name} id={model.id} isFavorite={favoriteModels.has(model.id)} isDefault={model.id === defaultModel}/>
        //                 </div>
        //             )
        //         })}
        //     </div>
        // </div>
    )
}

export default ModelList