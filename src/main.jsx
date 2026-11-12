import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/systeem.css'

// Routes: / is de telefoon, /scherm het grote scherm, /stats het team-dashboard, /kaarten het kaartenoverzicht.
const Telefoon = lazy(() => import('./phone/TelefoonApp.jsx'))
const GrootScherm = lazy(() => import('./screen/GrootScherm.jsx'))
const TeamStats = lazy(() => import('./screen/TeamStats.jsx'))
const KaartenOverzicht = lazy(() => import('./screen/KaartenOverzicht.jsx'))

const pad = window.location.pathname.replace(/\/+$/, '')
const ROUTES = { '/scherm': GrootScherm, '/stats': TeamStats, '/kaarten': KaartenOverzicht }
const Pagina = ROUTES[pad] ?? Telefoon

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Pagina />
    </Suspense>
  </StrictMode>,
)
