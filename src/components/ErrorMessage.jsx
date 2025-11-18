import { Button } from './ui/button'
import { RefreshCw } from 'lucide-react'

const ErrorMessage = ({ error, retry }) => {
  return (
    <div className="max-w-2/3 grow flex mb-3 flex-col gap-2 items-start p-5 mx-5 w-fit rounded-xl border bg-red-800 text-black border-red-800 dark:text-white">
      <h3 className="text-xl text-white font-bold">Something went wrong</h3>
      <p className="text-md text-gray-200">{error?.error?.message}</p>
      <Button onClick={() => retry()}>
        <RefreshCw />
        Retry
      </Button>
    </div>
  )
}

export default ErrorMessage
