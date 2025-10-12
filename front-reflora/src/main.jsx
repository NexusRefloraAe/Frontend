import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './screens/Login/Login'
import AppRoutes from "./Routes/Routes"
import MenuLaderal from './components/MenuLateral/header/MenuLaderal'
import BancoSementes from './screens/BancoSementes/BancoSementes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes  />
  </StrictMode>,
)
