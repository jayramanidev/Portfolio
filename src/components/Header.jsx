import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const isHome = location.pathname === '/'

    const scrollTo = (id) => {
        setMenuOpen(false)
        if (!isHome) {
            window.location.href = `/#${id}`
            return
        }
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            <header className="header">
                <button
                    className="header-menu-btn"
                    aria-label="Menu"
                    onClick={() => setMenuOpen(true)}
                >
                    <div className="header-menu-icon">
                        <span></span>
                        <span></span>
                    </div>
                </button>

                <Link to="/" className="header-logo">
                    Jay<span>.</span>
                </Link>

                <nav className="header-desktop-nav">
                    <button className="header-nav-link" onClick={() => scrollTo('work')}>Work</button>
                    <button className="header-nav-link" onClick={() => scrollTo('about')}>About</button>
                    <button className="header-nav-link" onClick={() => scrollTo('stack')}>Stack</button>
                    <button className="header-nav-link" onClick={() => scrollTo('contact')}>Contact</button>
                </nav>

                <div className="header-role-badge">
                    <span className="pulse-dot"></span>
                    Product Developer
                </div>

                <div className="header-spacer"></div>
            </header>

            {/* Overlay */}
            <div
                className={`menu-overlay ${menuOpen ? 'menu-overlay--active' : ''}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* Slide-out menu */}
            <nav className={`menu-drawer ${menuOpen ? 'menu-drawer--open' : ''}`}>
                <button
                    className="menu-close-btn"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                >
                    ✕
                </button>

                <div className="menu-nav-links">
                    <Link to="/" className="menu-nav-link" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <button className="menu-nav-link" onClick={() => scrollTo('work')}>
                        Work
                    </button>
                    <button className="menu-nav-link" onClick={() => scrollTo('about')}>
                        About
                    </button>
                    <button className="menu-nav-link" onClick={() => scrollTo('stack')}>
                        Stack
                    </button>
                    <button className="menu-nav-link" onClick={() => scrollTo('contact')}>
                        Contact
                    </button>
                </div>

                <div className="menu-footer">
                    <span className="menu-footer-text">Available for freelance work</span>
                </div>
            </nav>
        </>
    )
}

export default Header
