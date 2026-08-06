import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { site, theme } from './config/site'

const rootEl = document.documentElement
for (const [property, value] of Object.entries(theme)) {
  rootEl.style.setProperty(property, value)
}
document.title = site.name

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
