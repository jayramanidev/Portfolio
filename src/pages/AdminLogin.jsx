import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminLogin() {
    const [token, setToken] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        login(token)
        navigate('/admin/dashboard')
    }

    return (
        <div>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Enter JWT token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default AdminLogin
