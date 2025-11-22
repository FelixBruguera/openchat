import Chat from './components/Chat'
import { Routes, Route } from 'react-router'
import SidebarWrapper from './components/SidebarWrapper'
import { useAvailableModels } from './stores/useAvailableModels'
import { useSelectedModel } from './stores/useSelectedModel'
import { db } from './db/db'

function App() {
  const models = useAvailableModels((state) => state.models)
  const setModels = useAvailableModels((state) => state.setModels)
  const setSelectedModel = useSelectedModel((state) => state.setModel)
  if (models.length <= 1) {
    fetch('https://openrouter.ai/api/v1/models')
      .then((response) => response.json())
      .then((data) => setModels(data.data))
  }
  db.favorite_models
    .where('is_default')
    .equals(1)
    .first()
    .then((model) =>
      Object.keys(model).length > 0 ? setSelectedModel(model) : null,
    )

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
