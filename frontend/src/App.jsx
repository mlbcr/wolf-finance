import AppRouter from '@/routes/AppRouter'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

import './App.css'

export default function App() {
    return (
        <div className="app-layout">

            <Header />

            <main className="app-content">
                <AppRouter />
            </main>

            <Footer />

        </div>
    )
}