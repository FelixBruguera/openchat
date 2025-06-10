import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PGlite } from '@electric-sql/pglite'
  import { live } from '@electric-sql/pglite/live'
import { PGliteProvider } from "@electric-sql/pglite-react"
import { BrowserRouter } from "react-router";

const queryClient = new QueryClient()
const db = await PGlite.create({
  dataDir: 'idb://chat',
  extensions: {
    live,
  },
  relaxedDurability: true,
})

db.exec('CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  message TEXT NOT NULL, isUser BOOLEAN, chat_id INT NOT NULL)')
db.exec('CREATE TABLE IF NOT EXISTS chats (id SERIAL PRIMARY KEY, model TEXT NOT NULL,  title TEXT NOT NULL)')

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
     <PGliteProvider db={db}>
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          <App />
        </StrictMode>
      </QueryClientProvider>
       </PGliteProvider>
   </BrowserRouter>
)
