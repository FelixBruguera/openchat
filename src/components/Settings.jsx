import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Settings as SettingsIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useState } from 'react'
import { Textarea } from './ui/textarea'
import { useApiKey } from '@/stores/useApiKey'
import { useSystemPrompt } from '@/stores/useSystemPrompt'

const Settings = () => {
  const key = useApiKey((state) => state.key)
  const setKey = useApiKey((state) => state.setKey)
  const systemPrompt = useSystemPrompt((state) => state.prompt)
  const setSystemPrompt = useSystemPrompt((state) => state.setPrompt)
  const [inputValue, setInputValue] = useState(key)
  const [promptValue, setPromptValue] = useState(systemPrompt)
  const onSave = () => {
    localStorage.setItem('systemPrompt', promptValue)
    localStorage.setItem('apiKey', inputValue)
    setKey(inputValue)
    setSystemPrompt(promptValue)
  }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="border-1 border-gray-300 hover:bg-gray-200 hover:cursor-pointer"
      >
        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Label htmlFor="apiKey">OpenRouter API Key</Label>
        <Input
          className="border-1 border-gray-400 dark:border-gray-500"
          id="apiKey"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <DialogDescription>
          This key will be stored locally. To use keys from specific providers,{' '}
          <a
            href="https://openrouter.ai/settings/integrations"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-blue-600 hover:underline"
          >
            add them to your OpenRouter account.
          </a>
        </DialogDescription>
        <Label htmlFor="systemPrompt">System prompt</Label>
        <Textarea
          className="border-1 border-gray-400 dark:border-gray-500"
          id="systemPrompt"
          value={promptValue}
          onChange={(e) => setPromptValue(e.target.value)}
        />
        <DialogDescription>
          *Some models don't support a system prompt
        </DialogDescription>
        <DialogClose asChild>
          <Button onClick={() => onSave()}>Save</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default Settings
