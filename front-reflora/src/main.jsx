import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Banco from './pages/Banco/Banco'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Banco />
  </StrictMode>,
)
