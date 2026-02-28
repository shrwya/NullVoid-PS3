import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { portalCredentials } from '../config/portalCredentials'

const PORTAL_META = {
  owner:     { label: 'Owner',            icon: '🏛',  color: '#c9a84c', route: '/owner' },
  sales:     { label: 'Sales',            icon: '📈',  color: '#60a5fa', route: '/sales' },
  kitchen:   { label: 'Kitchen',          icon: '🍽',  color: '#f97316', route: '/kitchen' },
  inventory: { label: 'Inventory',        icon: '📦',  color: '#a78bfa', route: '/inventory' },
  property:  { label: 'Property Manager', icon: '🏢',  color: '#34d399', route: '/property' },
  vendor:    { label: 'Vendor',           icon: '🤝',  color: '#fb7185', route: '/vendor' },
  finance:   { label: 'Finance',          icon: '💰',  color: '#fbbf24', route: '/finance' },
}

export default function PortalLoginCard({ portalKey }) {
  const meta = PORTAL_META[portalKey]
  const { login } = useAuth()
  const navigate = useNavigate()

  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 300))

    const creds = portalCredentials[portalKey]
    if (id === creds.id && password === creds.password) {
      login(portalKey)
      navigate(meta.route)
    } else {
      setError('Invalid credentials. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div
      className="relative rounded-2xl border transition-all duration-300 overflow-hidden group"
      style={{
        background: 'linear-gradient(145deg, #111520 0%, #161c2a 100%)',
        borderColor: 'rgba(30,42,62,0.8)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = meta.color + '44'
        e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${meta.color}22`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(30,42,62,0.8)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Glow accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.color}55, transparent)` }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: meta.color + '18', border: `1px solid ${meta.color}33` }}
          >
            {meta.icon}
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-widest font-medium mb-0.5">
              Portal Access
            </div>
            <h3 className="text-[15px] font-semibold text-white leading-none">
              {meta.label}
            </h3>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">
              ID / Username
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => { setId(e.target.value); setError('') }}
              placeholder={`${portalKey}@banquet`}
              className="input"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••"
              className="input"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-[12px]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5h1v3.5h-1V3.5zm0 4.5h1v1h-1V8z"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            style={{
              background: loading
                ? meta.color + '55'
                : `linear-gradient(135deg, ${meta.color} 0%, ${meta.color}cc 100%)`,
              color: '#000',
              boxShadow: loading ? 'none' : `0 4px 20px ${meta.color}33`,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Verifying…
              </span>
            ) : (
              `Sign in to ${meta.label}`
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
