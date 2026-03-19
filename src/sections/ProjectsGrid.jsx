import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProjects } from '../hooks/useProjects'

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
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

function ProjectsGrid() {
    const { projects, loading, error } = useProjects()

    const renderSkeleton = () => (
        <div className="projects-grid">
            {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                    <div className="skeleton-card-image" />
                    <div className="skeleton-card-body">
                        <div className="skeleton-line skeleton-w-24" />
                        <div className="skeleton-line skeleton-w-3/4 skeleton-h-lg" />
                        <div className="skeleton-line skeleton-w-full" />
                        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
                            <span className="skeleton-tag" />
                            <span className="skeleton-tag" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <section className="projects-section section-divider" id="work">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="section-label">Portfolio</span>
                <h2 className="section-title">Selected Projects</h2>
                <p className="section-subtitle">
                    Real products shipped to production — not just demos.
                </p>
            </motion.div>

            {loading && renderSkeleton()}

            {error && (
                <p className="error-message">Unable to load projects. Please try again later.</p>
            )}

            {!loading && !error && projects.length > 0 && (
                <motion.div
                    className="projects-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                >
                    {projects.map((project) => (
                        <motion.div key={project.id} variants={cardVariants}>
                            <Link
                                to={`/project/${project.slug}`}
                                className="project-card"
                            >
                                <div className="project-card-image">
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="project-card-placeholder">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                                <line x1="8" y1="21" x2="16" y2="21" />
                                                <line x1="12" y1="17" x2="12" y2="21" />
                                            </svg>
                                        </div>
                                    )}
                                    {project.category && (
                                        <span className="project-card-badge">{project.category}</span>
                                    )}
                                </div>

                                <div className="project-card-body">
                                    <h3 className="project-card-title">{project.title}</h3>
                                    <p className="project-card-desc">{project.description}</p>

                                    <div className="project-card-footer">
                                        <div className="project-card-chips">
                                            {project.techStack.slice(0, 3).map((tech) => (
                                                <span key={tech} className="project-chip">{tech}</span>
                                            ))}
                                        </div>
                                        <span className="project-card-link">
                                            View
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </section>
    )
}

export default ProjectsGrid
