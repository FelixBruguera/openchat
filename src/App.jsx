import Chat from './components/Chat'
import { Routes, Route } from 'react-router'
import SidebarWrapper from './components/SidebarWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { setAvailableModels } from './reducers/availableModels'

function App() {
  const models = useSelector((state) => state.availableModels)
  const dispatch = useDispatch()
  if (models.length <= 1) {
    fetch('https://openrouter.ai/api/v1/models')
      .then((response) => response.json())
      .then((data) =>
        data.data.map((model) => {
          return { id: model.id, name: model.name }
        }),
      )
      .then((models) => dispatch(setAvailableModels(models)))
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
