import React from 'react'

// ── Health Ring SVG ─────────────────────────────────────────────────────────
export function HealthRing({ score, size = 60 }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const color = score >= 80 ? '#22c55e' : score >= 65 ? '#f97316' : '#ef4444'
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg
        width={size} height={size}
        viewBox="0 0 64 64"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle cx={32} cy={32} r={r} fill="none" stroke="#1e2a3e" strokeWidth={5} />
        <circle
          cx={32} cy={32} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ fontSize: size / 3.8, color }}
      >
        {score}
      </div>
    </div>
  )
}

// ── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, change, icon, accent }) {
  const isUp = change?.startsWith('+')
  return (
    <div className="stat-card opacity-0 animate-fade-up">
      <div className="flex items-start justify-between">
        <span className="stat-label">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div
        className="stat-value"
        style={accent ? { background: `linear-gradient(135deg, ${accent}, white)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}}
      >
        {value}
      </div>
      {sub && <div className="text-[12px] text-slate-500">{sub}</div>}
      {change && (
        <div className={isUp ? 'stat-change-up' : 'stat-change-down'}>
          {isUp ? '↑' : '↓'} {change} vs last month
        </div>
      )}
    </div>
  )
}

// ── Alert Strip ─────────────────────────────────────────────────────────────
export function Alert({ type = 'blue', icon, children, action }) {
  return (
    <div className={`alert alert-${type}`}>
      {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
      <span className="flex-1 leading-relaxed">{children}</span>
      {action && (
        <button
          onClick={action.fn}
          className="flex-shrink-0 text-[11px] underline opacity-70 hover:opacity-100 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// ── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ type = 'gray', children }) {
  return <span className={`badge badge-${type}`}>{children}</span>
}

// ── Section Header ──────────────────────────────────────────────────────────
export function SectionHead({ title, action }) {
  return (
    <div className="section-head">
      <span className="section-title">{title}</span>
      {action && (
        <button className="btn btn-ghost btn-sm" onClick={action.fn}>
          {action.label}
        </button>
      )}
    </div>
  )
}

// ── Progress Bar ────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = '#3b82f6', className = '' }) {
  return (
    <div className={`progress ${className}`}>
      <div
        className="progress-fill"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  )
}

// ── Tabs ────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs-bar">
      {tabs.map((t) => (
        <div
          key={t.id}
          className={`tab-item ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.icon && <span className="mr-1.5">{t.icon}</span>}
          {t.label}
          {t.badge && (
            <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {t.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${maxWidth} animate-fade-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button className="btn btn-ghost btn-xs" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Input Field ─────────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <label className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

// ── Tooltip-style chip ──────────────────────────────────────────────────────
export function FloatingChip({ color, bg, border, children, style }) {
  return (
    <div
      className="chip-label"
      style={{ color, background: bg, borderColor: border, ...style }}
    >
      {children}
    </div>
  )
}

// ── Score indicator ─────────────────────────────────────────────────────────
export function ScoreChip({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f97316' : '#ef4444'
  const bg = score >= 80 ? 'rgba(34,197,94,0.12)' : score >= 60 ? 'rgba(249,115,22,0.12)' : 'rgba(239,68,68,0.12)'
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
      style={{ color, background: bg }}
    >
      🤖 {score}
    </span>
  )
}

// ── Divider ─────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className="divider" />
}
