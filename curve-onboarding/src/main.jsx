import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Demo mode: every hard refresh in dev clears saved progress so Cam can walk the flow
// from scratch each time. In production builds (import.meta.env.DEV === false) this
// block is stripped by Vite's dead-code elimination, so real clients keep their resume.
if (import.meta.env.DEV) {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith('curve:onboarding:')) {
        window.localStorage.removeItem(key)
      }
    }
  } catch {
    // localStorage unavailable (private mode, etc.) — nothing to clear.
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
