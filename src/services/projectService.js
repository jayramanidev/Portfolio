// Service layer for project data — Firebase Firestore.
// Provides both one-shot queries and real-time subscriptions.

import { db } from '../lib/firebase'
import {
    collection,
    getDocs,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore'

const COLLECTION = 'projects'

/**
 * Map a Firestore document to a plain JS object.
 */
function mapDoc(doc) {
    const d = doc.data()
    return {
        id: doc.id,
        title: d.title || '',
        slug: d.slug || '',
        description: d.description || '',
        fullDescription: d.fullDescription || '',
        techStack: Array.isArray(d.techStack) ? d.techStack : [],
        category: d.category || '',
        image: d.imageUrl || '',
        featured: d.featured || false,
        liveUrl: d.liveUrl || '',
    }
}

/**
 * One-shot: fetch all projects.
 * @returns {Promise<Array>}
 */
export async function getAllProjects() {
    const snap = await getDocs(collection(db, COLLECTION))
    return snap.docs.map(mapDoc)
}

/**
 * One-shot: fetch the featured project.
 * @returns {Promise<Object|null>}
 */
export async function getFeaturedProject() {
    const q = query(collection(db, COLLECTION), where('featured', '==', true))
    const snap = await getDocs(q)
    return snap.empty ? null : mapDoc(snap.docs[0])
}

/**
 * One-shot: fetch a project by slug.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getProjectBySlug(slug) {
    const q = query(collection(db, COLLECTION), where('slug', '==', slug))
    const snap = await getDocs(q)
    return snap.empty ? null : mapDoc(snap.docs[0])
}

// ─── Real-time subscriptions ───────────────────────────────

/**
 * Subscribe to all projects in real-time.
 * @param {Function} onData  - called with array of projects
 * @param {Function} onError - called with error
 * @returns {Function} unsubscribe function
 */
export function subscribeToProjects(onData, onError) {
    return onSnapshot(
        collection(db, COLLECTION),
        (snap) => onData(snap.docs.map(mapDoc)),
        (err) => onError(err)
    )
}

/**
 * Subscribe to the featured project in real-time.
 * @param {Function} onData  - called with project object or null
 * @param {Function} onError - called with error
 * @returns {Function} unsubscribe function
 */
export function subscribeToFeatured(onData, onError) {
    const q = query(collection(db, COLLECTION), where('featured', '==', true))
    return onSnapshot(
        q,
        (snap) => onData(snap.empty ? null : mapDoc(snap.docs[0])),
        (err) => onError(err)
    )
}
