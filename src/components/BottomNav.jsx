import { useLocation } from 'react-router-dom'

function BottomNav() {
    const location = useLocation()
    const isHome = location.pathname === '/'

    const scrollTo = (id) => {
        if (!isHome) {
            window.location.href = `/#${id}`
            return
        }
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <nav className="bottom-nav">
            <button
                className="bottom-nav-item"
                onClick={() => scrollTo('hero')}
            >
                <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="bottom-nav-label">Home</span>
            </button>

            <button
                className="bottom-nav-item"
                onClick={() => scrollTo('work')}
            >
                <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span className="bottom-nav-label">Work</span>
            </button>

            <button
                className="bottom-nav-item"
                onClick={() => scrollTo('about')}
            >
                <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="bottom-nav-label">About</span>
            </button>

            <button
                className="bottom-nav-item"
                onClick={() => scrollTo('contact')}
            >
                <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="bottom-nav-label">Contact</span>
            </button>
        </nav>
    )
}

export default BottomNav
