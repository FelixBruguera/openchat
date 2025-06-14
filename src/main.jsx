import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PGliteProvider } from "@electric-sql/pglite-react"
import { BrowserRouter } from "react-router";
import { Provider } from 'react-redux'
import store from './store'
import initializeDatabase from './lib/initializeDatabase'
import { ThemeProvider } from "@/components/theme-provider"

const db = await initializeDatabase()

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
     <PGliteProvider db={db}>
      <Provider store={store}>
        <StrictMode>
           <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </StrictMode>
      </Provider>
       </PGliteProvider>
   </BrowserRouter>
)
