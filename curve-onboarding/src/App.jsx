import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import { getClient } from '@/config/clients'
import { loadState } from '@/lib/storage'
import Welcome from '@/screens/Welcome'
import Brief from '@/screens/Brief'
import Access from '@/screens/Access'
import Booking from '@/screens/Booking'
import Done from '@/screens/Done'

function ClientGate({ step, Component }) {
  const { slug } = useParams()
  const client = getClient(slug)
  if (!client) return <Navigate to="/" replace />

  // Read localStorage directly — every render sees the freshest state, so routes
  // can't bounce back when a previous screen just persisted an updated gate value.
  const state = loadState(client.slug)
  const canBooking = (state.ytDone || !!state.ytDelegatedTo) && state.commsDone
  const canDone = canBooking && state.bookingDone

  if (step === 'booking' && !canBooking) {
    return <Navigate to={`/${client.slug}/access`} replace />
  }
  if (step === 'done' && !canDone) {
    return <Navigate to={`/${client.slug}/booking`} replace />
  }

  return <Component client={client} />
}

function RootRedirect() {
  return <Navigate to="/demo" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:slug" element={<ClientGate step="welcome" Component={Welcome} />} />
        <Route path="/:slug/brief" element={<ClientGate step="brief" Component={Brief} />} />
        <Route path="/:slug/access" element={<ClientGate step="access" Component={Access} />} />
        <Route path="/:slug/booking" element={<ClientGate step="booking" Component={Booking} />} />
        <Route path="/:slug/done" element={<ClientGate step="done" Component={Done} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
