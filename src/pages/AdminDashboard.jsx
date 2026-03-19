import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

function AdminDashboard() {
    const { logout } = useAuth()
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleAddProject(e) {
        e.preventDefault()
        setLoading(true)
        setStatus('Adding project...')
        
        const formData = new FormData(e.target)
        const projectData = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            fullDescription: formData.get('fullDescription'),
            techStack: formData.get('techStack').split(',').map(s => s.trim()),
            category: formData.get('category'),
            imageUrl: formData.get('imageUrl'),
            liveUrl: formData.get('liveUrl'),
            featured: formData.get('featured') === 'on',
            createdAt: new Date().toISOString()
        }

        try {
            await addDoc(collection(db, 'projects'), projectData)
            setStatus('Project added successfully!')
            e.target.reset()
        } catch (err) {
            console.error(err)
            setStatus(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={logout} className="btn-secondary">Logout</button>
            </div>

            <section style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Add New Project</h2>
                
                <form onSubmit={handleAddProject} style={{ display: 'grid', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" required placeholder="e.g. My Awesome Project" />
                    </div>
                    
                    <div className="form-group">
                        <label>Slug (URL-friendly)</label>
                        <input name="slug" required placeholder="e.g. awesome-project" />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input name="category" placeholder="e.g. Web Development" />
                    </div>

                    <div className="form-group">
                        <label>Tech Stack (comma separated)</label>
                        <input name="techStack" placeholder="React, Node, Firebase" />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input name="imageUrl" placeholder="HTTPS link to image" />
                    </div>

                    <div className="form-group">
                        <label>Live URL</label>
                        <input name="liveUrl" placeholder="HTTPS link to live site" />
                    </div>

                    <div className="form-group">
                        <label>Short Description</label>
                        <textarea name="description" required rows="2" placeholder="Brief summary for grid card"></textarea>
                    </div>

                    <div className="form-group">
                        <label>Full Description (Markdown/Details)</label>
                        <textarea name="fullDescription" rows="4" placeholder="Detailed story for project page"></textarea>
                    </div>

                    <div className="form-group-checkbox">
                        <input type="checkbox" name="featured" id="featured" />
                        <label htmlFor="featured">Feature this project on home?</label>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem' }}>
                        {loading ? 'Adding...' : 'Add Project'}
                    </button>

                    {status && <p style={{ marginTop: '1rem', color: status.includes('Error') ? '#ff4444' : '#44ff44' }}>{status}</p>}
                </form>
            </section>
        </div>
    )
}

export default AdminDashboard
