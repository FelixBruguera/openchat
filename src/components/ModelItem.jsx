import { memo } from "react"
import { CommandItem } from "./ui/command"

const ModelItem = memo(({ onClick, data }) => {
    return (
        <CommandItem value={data.name}>
            <span onClick={() => onClick(data.id)} className="h-10 w-full grid grid-cols-5 grid-rows-1 items-center">
                <p className="col-start-1 col-span-3 col-end-3">{data.name}</p>
                <div className="col-start-3 col-end-6 flex items-center justify-evenly">
                    <p className="p-2 text-center rounded-2xl bg-indigo-600 dark:bg-indigo-900 text-gray-200 dark:text-gray-200 text-xs">{(data.pricing.prompt * 1000000).toFixed(2)}$/M Input</p>
                    <p className="p-2 text-center rounded-2xl bg-sky-600 dark:bg-sky-800 text-gray-300 dark:text-gray-200 text-xs">{(data.pricing?.completion * 1000000).toFixed(2)}$/M Output</p>
                </div>
            </span>
        </CommandItem>
    )
})

export default ModelItem