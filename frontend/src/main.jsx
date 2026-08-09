import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import App from './App.jsx'

import AuthProvider from '@/contexts/AuthProvider'
import EquipesProvider from '@/contexts//Equipes/EquipesProvider'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <EquipesProvider>
                    <App />
                </EquipesProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)