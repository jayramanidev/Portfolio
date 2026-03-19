import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import Footer from './Footer'

function Layout() {
    return (
        <div className="layout">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
            <BottomNav />
        </div>
    )
}

export default Layout
