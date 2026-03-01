import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { portalCredentials } from '../config/portalCredentials'

const PORTAL_META = {
  owner:     { label: 'Owner',            icon: '👑', accent: '#8B6B52', accentLight: 'rgba(181, 155, 135, 0.1)',  route: '/owner' },
  sales:     { label: 'Sales',            icon: '📈', accent: '#b06040', accentLight: 'rgba(217, 177, 161, 0.1)',   route: '/sales' },
  kitchen:   { label: 'Kitchen',          icon: '🍽', accent: '#9a5a30', accentLight: 'rgba(154,90,48,0.1)',   route: '/kitchen' },
  inventory: { label: 'Inventory',        icon: '📦', accent: '#6B8B52', accentLight: 'rgba(107,139,82,0.1)',  route: '/inventory' },
  property:  { label: 'Property Manager', icon: '🏢', accent: '#526B8B', accentLight: 'rgba(82,107,139,0.1)',  route: '/property' },
  vendor:    { label: 'Vendor',           icon: '🤝', accent: '#7a6B3B', accentLight: 'rgba(122,107,59,0.1)',  route: '/vendor' },
  finance:   { label: 'Finance',          icon: '💰', accent: '#c9974a', accentLight: 'rgba(201,151,74,0.1)',  route: '/finance' },
}

export default function PortalLoginCard({ portalKey }) {
  const meta = PORTAL_META[portalKey]
  const { login } = useAuth()
  const navigate = useNavigate()

  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 320))
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
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #fdfaf6 100%)',
        border: '1px solid #e8d5be',
        borderRadius: 20,
        boxShadow: '0 2px 12px rgba(107,79,59,0.08), 0 1px 3px rgba(107,79,59,0.06)',
        transition: 'all 0.25s cubic-bezier(.22,.68,0,1.2)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(107,79,59,0.16), 0 2px 8px rgba(107,79,59,0.08), 0 0 0 1px ${meta.accent}30`
        e.currentTarget.style.borderColor = `${meta.accent}50`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(107,79,59,0.08), 0 1px 3px rgba(107,79,59,0.06)'
        e.currentTarget.style.borderColor = '#e8d5be'
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${meta.accent}80, transparent)` }} />

      {/* Subtle pattern overlay */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 120, height: 120,
        background: `radial-gradient(circle at 80% 20%, ${meta.accentLight} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '20px 24px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: meta.accentLight, border: `1.5px solid ${meta.accent}25`,
            flexShrink: 0,
          }}>
            {meta.icon}
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#a08060', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 3 }}>
              Portal Access
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#3A2518', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '-0.3px' }}>
              {meta.label}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#d4c0a8', flexShrink: 0 }} />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #e8d5be 30%, #e8d5be 70%, transparent)', marginBottom: 18 }} />

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, color: '#a08060', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              ID / Username
            </label>
            <input
              type="text"
              value={id}
              onChange={e => { setId(e.target.value); setError('') }}
              placeholder={`${portalKey}`}
              className="input"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, color: '#a08060', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                className="input"
                style={{ paddingRight: 40 }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: '#b89878', fontSize: 13,
                }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 10,
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontSize: 12,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5h1v3.5h-1V3.5zm0 4.5h1v1h-1V8z"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px 16px', borderRadius: 12,
              fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              background: loading
                ? 'rgba(115, 84, 61, 0.25)'
                : `linear-gradient(135deg, ${meta.accent} 0%, ${meta.accent}cc 100%)`,
              color: loading ? '#8B6B52' : '#fff',
              border: 'none',
              boxShadow: loading ? 'none' : `0 4px 16px ${meta.accent}35, inset 0 1px 0 rgba(255,255,255,0.15)`,
              marginTop: 2,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                  <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" opacity="0.75"/>
                </svg>
                Verifying…
              </span>
            ) : `Sign in to ${meta.label}`}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}