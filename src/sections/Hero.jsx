import { motion } from 'framer-motion'
import heroProfile from '../assets/hero-profile.webp'

function Hero() {
    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="hero" id="hero">
            <div className="hero-grid">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
                    >
                        <div className="hero-available-badge">
                            <span className="hero-available-dot"></span>
                            Available for work
                        </div>
                        <div className="hero-location" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            Based in Rajkot, India
                        </div>
                    </motion.div>

                    <motion.p
                        className="hero-name"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        Jay Ramani
                    </motion.p>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="hero-title-line">Full-Stack</span>
                        <span className="hero-title-line">
                            Product <span className="hero-title-accent">Developer</span>
                        </span>
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        I design, build, and ship scalable web applications. Based in Rajkot, crafting digital products for the web.
                    </motion.p>

                    <motion.div
                        className="hero-cta-group"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <button
                            className="btn-primary"
                            onClick={() => scrollTo('work')}
                        >
                            View My Work
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => scrollTo('contact')}
                        >
                            Let's Build Together
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    className="hero-visual"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="hero-image-wrapper">
                        <div className="hero-image-fluid">
                            <div className="hero-fluid-blob hero-fluid-blob--1"></div>
                            <div className="hero-fluid-blob hero-fluid-blob--2"></div>
                            <div className="hero-fluid-blob hero-fluid-blob--3"></div>
                        </div>
                        <img
                            src={heroProfile}
                            alt="Jay Ramani - Full-Stack Developer"
                            className="hero-profile-img"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero
