import React from 'react'
import { useStore } from '../../store/useStore'

const PORTALS = [
  {
    id: 'owner', label: 'Owner', icon: '👑', color: '#c9a84c',
    nav: [
      { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
      { id: 'branches',  icon: '🏢', label: 'All Branches' },
      { id: 'staff',     icon: '👥', label: 'Staff Performance' },
      { id: 'alerts',    icon: '⚡', label: 'Revenue Alerts', badge: '3' },
    ],
  },
  {
    id: 'sales', label: 'Sales', icon: '📞', color: '#60a5fa',
    nav: [
      { id: 'pipeline',  icon: '📋', label: 'Lead Pipeline' },
      { id: 'leads',     icon: '👤', label: 'All Leads' },
      { id: 'scoring',   icon: '🤖', label: 'AI Scoring' },
      { id: 'whatsapp',  icon: '💬', label: 'WhatsApp Hub' },
      { id: 'followup',  icon: '⏰', label: 'Follow-Ups', badge: '5' },
    ],
  },
  {
    id: 'kitchen', label: 'Kitchen', icon: '🍽', color: '#f97316',
    nav: [
      { id: 'events',    icon: '📅', label: 'Upcoming Events' },
      { id: 'checklist', icon: '✅', label: 'Daily Prep' },
      { id: 'menus',     icon: '📝', label: 'Menu Finalization' },
      { id: 'feedback',  icon: '⭐', label: 'Dish Feedback' },
    ],
  },
  {
    id: 'inventory', label: 'Inventory', icon: '📦', color: '#14b8a6',
    nav: [
      { id: 'stock',     icon: '📦', label: 'Stock Levels' },
      { id: 'transfer',  icon: '🔄', label: 'Cross-Branch', badge: '1' },
      { id: 'suppliers', icon: '🤝', label: 'Suppliers' },
      { id: 'expiry',    icon: '⏰', label: 'Expiry Tracker', badge: '2' },
    ],
  },
  {
    id: 'property', label: 'Property', icon: '🏗', color: '#a855f7',
    nav: [
      { id: 'setup',     icon: '🔧', label: 'Event Setup' },
      { id: 'calendar',  icon: '📅', label: 'Availability' },
      { id: 'damage',    icon: '📸', label: 'Damage Reports' },
    ],
  },
  {
    id: 'vendor', label: 'Vendors', icon: '🤝', color: '#22c55e',
    nav: [
      { id: 'directory', icon: '📋', label: 'Vendor Directory' },
      { id: 'pos',       icon: '📑', label: 'Purchase Orders' },
      { id: 'invoices',  icon: '🧾', label: 'Invoice Approval', badge: '2' },
    ],
  },
  {
    id: 'finance', label: 'Finance', icon: '💰', color: '#e8c56a',
    nav: [
      { id: 'billing',   icon: '🧾', label: 'Billing & Invoices' },
      { id: 'payments',  icon: '💳', label: 'Payments' },
      { id: 'reports',   icon: '📊', label: 'Reports & Export' },
    ],
  },
]

export function Sidebar() {
  const { activePortal, activeNav, setActivePortal, setActiveNav } = useStore()
  const cur = PORTALS.find((p) => p.id === activePortal)

  return (
    <aside className="w-[220px] bg-surface border-r border-border flex flex-col flex-shrink-0 overflow-y-auto no-scrollbar">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div
          className="font-display text-xl leading-none"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c56a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          BanquetOS
        </div>
        <div className="text-[9px] text-slate-600 tracking-[2px] uppercase mt-1">Management Platform</div>
      </div>

      {/* Portal switcher */}
      <div className="p-2.5 border-b border-border">
        <div className="text-[9px] text-slate-600 uppercase tracking-widest px-1 mb-2">Portal</div>
        {PORTALS.map((p) => (
          <button
            key={p.id}
            onClick={() => { setActivePortal(p.id); setActiveNav(p.nav[0].id) }}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium transition-all mb-0.5 text-left border ${
              activePortal === p.id
                ? 'border-opacity-40 text-white'
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-surface2'
            }`}
            style={activePortal === p.id ? {
              background: `${p.color}15`,
              borderColor: `${p.color}40`,
              color: p.color,
            } : {}}
          >
            <span className="text-[14px]">{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      {/* Nav items */}
      <div className="flex-1 p-2.5">
        <div className="text-[9px] text-slate-600 uppercase tracking-widest px-1 mb-2">{cur.label} Menu</div>
        {cur.nav.map((n) => (
          <div
            key={n.id}
            onClick={() => setActiveNav(n.id)}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] cursor-pointer transition-all mb-0.5 ${
              activeNav === n.id
                ? 'bg-brand/12 text-brand-light'
                : 'text-slate-500 hover:text-slate-300 hover:bg-surface2'
            }`}
          >
            <span className="text-sm w-4 text-center">{n.icon}</span>
            <span>{n.label}</span>
            {n.badge && (
              <span className="ml-auto text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                {n.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #f97316)' }}>A</div>
          <div>
            <div className="text-[12px] font-medium text-slate-300">Admin</div>
            <div className="text-[10px] text-slate-600">{cur.label} Portal</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function TopBar({ title }) {
  return (
    <header className="flex items-center justify-between px-7 py-4 border-b border-border bg-surface flex-shrink-0">
      <h1 className="text-[15px] font-semibold text-slate-200">{title}</h1>
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
        <span className="text-[11px] px-3 py-1 rounded-full bg-surface2 border border-border2 text-slate-400">Andheri HQ</span>
        <span className="text-[11px] px-3 py-1 rounded-full bg-surface2 border border-border2 text-slate-400">Feb 28, 2026</span>
      </div>
    </header>
  )
}

export { PORTALS }
