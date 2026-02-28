import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('banquet_role') || null)

  const login = (portalRole) => {
    localStorage.setItem('banquet_role', portalRole)
    setRole(portalRole)
  }

  const logout = () => {
    localStorage.removeItem('banquet_role')
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
