import Chat from './components/Chat'
import { Routes, Route } from 'react-router'
import SidebarWrapper from './components/SidebarWrapper'
import { useAvailableModels } from './stores/useAvailableModels'

function App() {
  const models = useAvailableModels((state) => state.models)
  const setModels = useAvailableModels((state) => state.setModels)
  if (models.length <= 1) {
    fetch('https://openrouter.ai/api/v1/models')
      .then((response) => response.json())
      .then((data) => setModels(data.data))
  }

  return (
    <section className="flex items-end h-dvh">
      <SidebarWrapper />
      <Routes>
        <Route path="/" element={<Chat isNew={true} />} />
        <Route path="/:id" element={<Chat />} />
      </Routes>
    </section>
  )
}

export default App
