import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import { AppContextProvider } from './context/AppContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
<StrictMode>
  <AppContextProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </AppContextProvider>
</StrictMode>
)
