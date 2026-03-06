import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
    const { logout } = useAuth()

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>You are logged in.</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default AdminDashboard
