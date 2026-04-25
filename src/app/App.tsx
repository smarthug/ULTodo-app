import { BrowserRouter } from 'react-router'
import { Providers } from './providers'
import { AppRouter } from './router'

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppRouter />
      </Providers>
    </BrowserRouter>
  )
}
