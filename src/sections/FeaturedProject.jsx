import { motion } from 'framer-motion'

function FeaturedProject({ project, loading }) {
    if (loading) {
        return (
            <section className="featured-project">
                <div className="featured-project-grid">
                    <div className="featured-project-image skeleton-box" />
                    <div className="featured-project-info">
                        <div className="skeleton-line skeleton-w-24" />
                        <div className="skeleton-line skeleton-w-48 skeleton-h-lg" />
                        <div className="skeleton-line skeleton-w-full" />
                        <div className="skeleton-line skeleton-w-3/4" />
                        <div className="featured-project-tags">
                            <span className="skeleton-tag" />
                            <span className="skeleton-tag" />
                            <span className="skeleton-tag" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (!project) return null

    return (
        <section className="featured-project">
            <motion.div
                className="featured-project-grid"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="featured-project-image">
                    {project.image ? (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="featured-project-img"
                        />
                    ) : (
                        <div className="featured-project-image-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="featured-project-info">
                    <span className="featured-project-label">Featured Project</span>
                    <h2 className="featured-project-title">{project.title}</h2>
                    <p className="featured-project-desc">{project.description}</p>
                    {project.techStack.length > 0 && (
                        <div className="featured-project-tags">
                            {project.techStack.map((tech) => (
                                <span key={tech} className="featured-project-tag">{tech}</span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    )
}

export default FeaturedProject
