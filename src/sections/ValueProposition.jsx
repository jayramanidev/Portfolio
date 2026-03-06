import { motion } from 'framer-motion'

const cards = [
    {
        title: 'SaaS Platforms',
        description: 'End-to-end web applications with authentication, dashboards, and scalable architecture.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    {
        title: 'Real-Time Systems',
        description: 'Analytics dashboards, data-driven apps, and dynamic platforms using Firebase.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        title: 'E-Commerce & Business Apps',
        description: 'Payment integration, admin panels, and customer-facing applications.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        ),
    },
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
}

function ValueProposition() {
    return (
        <section className="value-section section-divider" id="value">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="section-label">Capabilities</span>
                <h2 className="section-title">What I Build</h2>
                <p className="section-subtitle">
                    From concept to deployment — architected for scale, built for performance.
                </p>
            </motion.div>

            <motion.div
                className="value-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
            >
                {cards.map((card) => (
                    <motion.div
                        key={card.title}
                        className="value-card"
                        variants={cardVariants}
                    >
                        <div className="value-card-icon">{card.icon}</div>
                        <h3 className="value-card-title">{card.title}</h3>
                        <p className="value-card-desc">{card.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}

export default ValueProposition
