import { motion } from 'framer-motion'

const categories = [
    {
        label: 'Frontend',
        items: ['React', 'Vite', 'Tailwind CSS'],
    },
    {
        label: 'Backend',
        items: ['Firebase', 'Firestore', 'REST APIs'],
    },
    {
        label: 'Deployment',
        items: ['Vercel', 'Firebase Hosting'],
    },
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
}

function TechStack() {
    return (
        <section className="stack-section section-divider" id="stack">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="section-label">Technology</span>
                <h2 className="section-title">Tech Stack</h2>
                <p className="section-subtitle">
                    Tools and technologies I use to build production-grade applications.
                </p>
            </motion.div>

            <motion.div
                className="stack-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
            >
                {categories.map((cat) => (
                    <motion.div
                        key={cat.label}
                        className="stack-category"
                        variants={cardVariants}
                    >
                        <h3 className="stack-category-title">{cat.label}</h3>
                        <motion.div
                            className="stack-items"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {cat.items.map((item) => (
                                <motion.div
                                    key={item}
                                    className="stack-item"
                                    variants={itemVariants}
                                >
                                    <span className="stack-item-dot" />
                                    <span className="stack-item-name">{item}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}

export default TechStack
