import { motion } from 'framer-motion'

const education = {
    degree: 'Bachelor of Computer Applications (BCA)',
    college: 'Harivandana College, Rajkot',
    semester: '4th Semester',
    coursework: ['Data Structures', 'Web Development', 'Database Systems'],
}

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
}

function About() {
    return (
        <section className="about-section section-divider" id="about">
            <motion.div
                className="about-content"
                {...fadeUp}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="section-label">About</span>
                <h2 className="section-title">Building Products, Not Just Interfaces</h2>

                <div className="about-accent-line" />

                <p className="about-text">
                    I'm <strong>Jay Ramani</strong>, a full-stack web developer based in Rajkot, Gujarat.
                    I'm currently advancing my technical foundation through a Bachelor of Computer Applications
                    at Harivandana College.
                </p>

                <p className="about-text">
                    I focus on building complete web products — from frontend interfaces to backend
                    architecture — using <strong>React</strong> and <strong>Firebase</strong>. I'm
                    particularly interested in designing <span className="about-highlight">scalable
                        systems</span> and turning practical ideas into deployable applications.
                </p>

                <p className="about-text">
                    Currently, I'm working on real-world product projects to strengthen my
                    understanding of <strong>system design</strong>, performance, and user-focused
                    development.
                </p>
            </motion.div>

            {/* Education */}
            <motion.div
                className="education-block"
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="section-label">Education</span>
                <h3 className="education-degree">{education.degree}</h3>

                <div className="education-meta">
                    <div className="education-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                        <span>{education.college}</span>
                    </div>
                    <div className="education-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{education.semester}</span>
                    </div>
                </div>

                <div className="education-coursework">
                    <span className="education-coursework-label">Relevant Coursework</span>
                    <div className="education-chips">
                        {education.coursework.map((course) => (
                            <span key={course} className="education-chip">{course}</span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default About
