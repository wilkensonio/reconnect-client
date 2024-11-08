import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import App from './App.jsx'
import './index.css' 
import { BrowserRouter } from 'react-router-dom'
import { BlurDashboardProvider } from './context/PiMessageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/faculty"> 
      <BlurDashboardProvider>
        <App />  
      </BlurDashboardProvider>
    </BrowserRouter>
  </StrictMode>,
)
