import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('admin_token'))

    useEffect(() => {
        if (token) {
            localStorage.setItem('admin_token', token)
        } else {
            localStorage.removeItem('admin_token')
        }
    }, [token])

    const login = (jwt) => setToken(jwt)
    const logout = () => setToken(null)
    const isAuthenticated = !!token

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
