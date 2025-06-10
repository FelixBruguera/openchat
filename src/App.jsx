import { usePGlite } from "@electric-sql/pglite-react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import Chat from "./components/Chat"
import { Routes, Route } from "react-router"
import SidebarWrapper from "./components/SidebarWrapper"


function App() {
  const db = usePGlite()
  console.log(db.query('SELECT * FROM chats'))
  console.log(db.query('SELECT * FROM messages'))
  return (
    <section className="flex items-end h-dvh">
      <SidebarWrapper/>
      <Routes>
        <Route path="/" element={<Chat isNew={true} />} />
        <Route path="/:id" element={<Chat />} />
      </Routes>
    </section>
  )
}

export default App
