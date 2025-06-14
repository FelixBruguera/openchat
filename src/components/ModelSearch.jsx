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
import { useCallback, useMemo } from "react"

const ModelSearch = () => {
    const availableModels = useSelector(state => state.availableModels)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const onClick = useCallback((id) => 
        {
            dispatch(setSelectedModel({id: id}))
            setOpen(false)
        }, [dispatch])
    const modelList = useMemo(() => availableModels.map(model => <ModelItem onClick={onClick} data={model} />), [availableModels, onClick])
    return (
        <>    
            <Button onClick={() => setOpen(true)} className='my-2'>
                Search models
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search by name..." value={search} onValueChange={(e) => setSearch(e)}/>
                    <CommandGroup heading="Popular models">
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {modelList}
                        </CommandList>
                    </CommandGroup>
            </CommandDialog>
        </>
    )
}

export default ModelSearch