import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProject } from '../hooks/useProjects'

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
}

const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
}

/* ── Helpers ── */
function splitStack(techStack) {
    const frontendKeywords = ['react', 'vite', 'tailwind', 'css', 'html', 'next', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'sass', 'framer']
    const frontend = []
    const backend = []
    techStack.forEach((t) => {
        if (frontendKeywords.some((k) => t.toLowerCase().includes(k))) {
            frontend.push(t)
        } else {
            backend.push(t)
        }
    })
    return { frontend, backend }
}

/* ── Sub-components ── */
function CaseHero({ project }) {
    return (
        <section className="case-hero">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
                <Link to="/" className="case-back">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Portfolio
                </Link>
            </motion.div>

            <div className="case-hero-meta">
                {project.category && (
                    <motion.span className="case-badge" {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                        {project.category}
                    </motion.span>
                )}
                {project.featured && (
                    <motion.span className="case-badge case-badge--featured" {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }}>
                        ★ Featured
                    </motion.span>
                )}
            </div>

            <motion.h1 className="case-hero-title" {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
                {project.title}
            </motion.h1>

            <motion.p className="case-hero-desc" {...fadeUp} transition={{ duration: 0.6, delay: 0.35 }}>
                {project.description}
            </motion.p>

            {project.liveUrl && (
                <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.45 }} style={{ marginTop: '1.5rem' }}>
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="case-live-btn"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Visit Live Site
                    </a>
                </motion.div>
            )}
        </section>
    )
}

function CaseImage({ project }) {
    return (
        <motion.section
            className="case-section"
            {...fadeUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <div className="case-image-hero">
                {project.image ? (
                    <img src={project.image} alt={project.title} className="case-image-hero-img" />
                ) : (
                    <div className="case-image-hero-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                )}
            </div>
        </motion.section>
    )
}

function CaseOverview({ project }) {
    return (
        <motion.section
            className="case-section"
            {...fadeUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <span className="case-section-label">Overview</span>
            <h2 className="case-section-title">Project Overview</h2>
            <p className="case-section-body">{project.fullDescription || project.description}</p>
        </motion.section>
    )
}

function CaseProblem({ project }) {
    return (
        <motion.section
            className="case-section"
            {...fadeUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <span className="case-section-label">Problem</span>
            <h2 className="case-section-title">The Problem</h2>
            <p className="case-section-body">
                {project.problem || `Building a reliable ${project.category?.toLowerCase() || 'web'} solution requires solving complex problems around data management, real-time synchronization, user authentication, and delivering a fast, responsive experience — all while keeping the architecture scalable for future growth.`}
            </p>
        </motion.section>
    )
}

function CaseSolution({ project }) {
    return (
        <motion.section
            className="case-section"
            {...fadeUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <span className="case-section-label">Solution</span>
            <h2 className="case-section-title">The Solution</h2>
            <p className="case-section-body">
                {project.solution || `${project.title} was built with a modern full-stack architecture — React on the frontend for a dynamic, component-driven UI, paired with Firebase and Firestore on the backend for real-time data synchronization and serverless scalability. The application follows a clean separation of concerns with dedicated service layers, custom hooks for state management, and optimized data fetching patterns.`}
            </p>
        </motion.section>
    )
}

function CaseFeatures({ project }) {
    const features = project.features || [
        'Responsive design optimized for all screen sizes',
        'Real-time data synchronization with Firestore',
        'Clean, modular component architecture',
        'Optimized loading states and error handling',
        'Production-ready deployment pipeline',
    ]

    return (
        <motion.section
            className="case-section"
            variants={stagger}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <motion.span className="case-section-label" variants={fadeUp}>Key Features</motion.span>
            <motion.h2 className="case-section-title" variants={fadeUp}>What It Does</motion.h2>
            <div className="case-features-list">
                {features.map((f, i) => (
                    <motion.div key={i} className="case-feature-item" variants={fadeUp}>
                        <span className="case-feature-dot" />
                        <span className="case-feature-text">{f}</span>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}

function CaseStackBreakdown({ project }) {
    const { frontend, backend } = splitStack(project.techStack)

    return (
        <motion.section
            className="case-section"
            variants={stagger}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <motion.span className="case-section-label" variants={fadeUp}>Technology</motion.span>
            <motion.h2 className="case-section-title" variants={fadeUp}>Tech Stack Breakdown</motion.h2>
            <div className="case-stack-grid">
                {frontend.length > 0 && (
                    <motion.div className="case-stack-col" variants={fadeUp}>
                        <h3 className="case-stack-col-title">Frontend</h3>
                        <div className="case-stack-chips">
                            {frontend.map((t) => (
                                <span key={t} className="case-stack-chip">{t}</span>
                            ))}
                        </div>
                    </motion.div>
                )}
                {backend.length > 0 && (
                    <motion.div className="case-stack-col" variants={fadeUp}>
                        <h3 className="case-stack-col-title">Backend & Services</h3>
                        <div className="case-stack-chips">
                            {backend.map((t) => (
                                <span key={t} className="case-stack-chip">{t}</span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.section>
    )
}

function CaseArchitecture({ project }) {
    return (
        <motion.section
            className="case-section"
            variants={stagger}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <motion.span className="case-section-label" variants={fadeUp}>Architecture</motion.span>
            <motion.h2 className="case-section-title" variants={fadeUp}>Architecture Decisions</motion.h2>
            <div className="case-decisions-grid">
                {(project.architectureDecisions || [
                    {
                        question: 'Why Firebase?',
                        answer: 'Firebase provides a fully managed backend with real-time database, authentication, and hosting — eliminating the need for server infrastructure while maintaining production-grade reliability.',
                    },
                    {
                        question: 'Why Real-Time?',
                        answer: 'Firestore\'s real-time listeners ensure the UI stays in sync with the database without manual refresh cycles, delivering a seamless user experience.',
                    },
                    {
                        question: 'Why This Stack?',
                        answer: 'React + Vite offers fast development iteration and optimal bundle sizes. Combined with Tailwind for styling and Framer Motion for animations, the stack balances developer velocity with production performance.',
                    },
                ]).map((d, i) => (
                    <motion.div key={i} className="case-decision-card" variants={fadeUp}>
                        <h3 className="case-decision-q">{d.question}</h3>
                        <p className="case-decision-a">{d.answer}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}

function CaseChallenges({ project }) {
    const challenges = project.challenges || [
        {
            title: 'Performance Optimization',
            desc: 'Managed Firestore read costs and bundle size by implementing lazy loading, query pagination, and selective real-time subscriptions only where needed.',
        },
        {
            title: 'Scalability Considerations',
            desc: 'Firestore\'s document-based model requires careful data modeling upfront. Denormalization patterns were used to minimize cross-collection queries at scale.',
        },
        {
            title: 'Improvements for V2',
            desc: 'Future iterations will include server-side rendering for improved SEO, edge caching for static assets, and a headless CMS integration for easier content management.',
        },
    ]

    return (
        <motion.section
            className="case-section"
            variants={stagger}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <motion.span className="case-section-label" variants={fadeUp}>Challenges</motion.span>
            <motion.h2 className="case-section-title" variants={fadeUp}>Challenges & Trade-offs</motion.h2>
            <div className="case-challenges-list">
                {challenges.map((c, i) => (
                    <motion.div key={i} className="case-challenge-item" variants={fadeUp}>
                        <h3 className="case-challenge-title">{c.title}</h3>
                        <p className="case-challenge-desc">{c.desc}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}

function CaseScreenshots({ project }) {
    const screenshots = project.screenshots || []

    return (
        <motion.section
            className="case-section"
            {...fadeUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-60px' }}
            whileInView="animate"
            initial="initial"
        >
            <span className="case-section-label">Gallery</span>
            <h2 className="case-section-title">Screenshots</h2>
            {screenshots.length > 0 ? (
                <div className="case-screenshots-grid">
                    {screenshots.map((src, i) => (
                        <div key={i} className="case-screenshot-item">
                            <img src={src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="case-screenshots-empty">
                    <div className="case-screenshot-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Screenshots coming soon</span>
                    </div>
                    <div className="case-screenshot-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Screenshots coming soon</span>
                    </div>
                </div>
            )}
        </motion.section>
    )
}

/* ── Main Component ── */
function ProjectDetails() {
    const { slug } = useParams()
    const { project, loading, error } = useProject(slug)

    if (loading) {
        return (
            <div className="case-study">
                <div className="case-hero">
                    <div className="skeleton-line skeleton-w-24" />
                    <div className="skeleton-line skeleton-w-3/4 skeleton-h-lg" style={{ marginTop: '1.5rem' }} />
                    <div className="skeleton-line skeleton-w-full" style={{ marginTop: '1rem' }} />
                </div>
                <div className="case-section">
                    <div className="case-image-hero skeleton-box" />
                </div>
                <div className="case-section">
                    <div className="skeleton-line skeleton-w-24" />
                    <div className="skeleton-line skeleton-w-full" style={{ marginTop: '1rem' }} />
                    <div className="skeleton-line skeleton-w-full" />
                    <div className="skeleton-line skeleton-w-3/4" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="case-study-empty">
                <h1>Something went wrong</h1>
                <p>{error}</p>
                <Link to="/">← Back to home</Link>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="case-study-empty">
                <h1>Project not found</h1>
                <p>The project you're looking for doesn't exist.</p>
                <Link to="/">← Back to home</Link>
            </div>
        )
    }

    return (
        <article className="case-study">
            <CaseHero project={project} />
            <CaseImage project={project} />
            <CaseOverview project={project} />
            <CaseProblem project={project} />
            <CaseSolution project={project} />
            <CaseFeatures project={project} />
            {project.techStack.length > 0 && <CaseStackBreakdown project={project} />}
            <CaseArchitecture project={project} />
            <CaseChallenges project={project} />
            <CaseScreenshots project={project} />
        </article>
    )
}

export default ProjectDetails
