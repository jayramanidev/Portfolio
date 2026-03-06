import Hero from '../sections/Hero'
import ValueProposition from '../sections/ValueProposition'
import ProjectsGrid from '../sections/ProjectsGrid'
import About from '../sections/About'
import TechStack from '../sections/TechStack'
import Contact from '../sections/Contact'

function Home() {
    return (
        <>
            <Hero />
            <ValueProposition />
            <ProjectsGrid />
            <About />
            <TechStack />
            <Contact />
        </>
    )
}

export default Home
