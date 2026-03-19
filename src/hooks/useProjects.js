import { useState, useEffect } from 'react'
import {
    subscribeToProjects,
    subscribeToFeatured,
    getProjectBySlug,
} from '../services/projectService'

/**
 * Real-time hook for all projects + featured project.
 * Uses onSnapshot — UI updates automatically when Firestore changes.
 */
export function useProjects() {
    const [projects, setProjects] = useState([])
    const [featuredProject, setFeaturedProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let loadCount = 0
        const checkLoaded = () => {
            loadCount++
            if (loadCount >= 2) setLoading(false)
        }

        const unsubProjects = subscribeToProjects(
            (data) => {
                setProjects(data)
                setError(null)
                checkLoaded()
            },
            (err) => {
                console.error('[useProjects]', err.message)
                setError(err.message)
                checkLoaded()
            }
        )

        const unsubFeatured = subscribeToFeatured(
            (data) => {
                setFeaturedProject(data)
                setError(null)
                checkLoaded()
            },
            (err) => {
                console.error('[useProjects] featured:', err.message)
                setError(err.message)
                checkLoaded()
            }
        )

        return () => {
            unsubProjects()
            unsubFeatured()
        }
    }, [])

    return { projects, featuredProject, loading, error }
}

/**
 * Hook to fetch a single project by slug.
 */
export function useProject(slug) {
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)

        getProjectBySlug(slug)
            .then((data) => setProject(data))
            .catch((err) => {
                console.error('[useProject]', err.message)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [slug])

    return { project, loading, error }
}
