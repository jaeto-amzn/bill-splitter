import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initDatadog } from './lib/datadog'

// Never let a monitoring SDK failure take down the app. A throw from
// initDatadog() at module top level would white-screen the entire SPA, so we
// isolate it and degrade gracefully (app runs without RUM).
try {
  initDatadog()
} catch (err) {
  console.error('Datadog RUM failed to initialize; continuing without it.', err)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
