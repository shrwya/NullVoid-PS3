import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function OwnerPortal() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-8">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🏛</div>
        <h1 className="font-display text-3xl text-white mb-2">Owner Portal</h1>
        <p className="text-slate-500 text-sm mb-8">You are signed in as the Owner.</p>
        <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline w-full justify-center">Sign out</button>
      </div>
    </div>
  )
}
