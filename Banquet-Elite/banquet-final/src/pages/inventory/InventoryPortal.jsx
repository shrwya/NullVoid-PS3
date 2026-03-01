import React, { useState, useEffect } from 'react'
import { Tabs, Alert, Badge, ProgressBar, SectionHead } from '../../components/ui'

/* ═══════════════════ DESIGN HELPERS ═══════════════════ */

function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div
      className="relative rounded-2xl p-4 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #111520 0%, #161c2a 100%)',
        border: '1px solid rgba(30,42,62,0.8)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }}
      />
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500">{label}</span>
        <span className="text-lg opacity-70">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white leading-none">{value}</div>
      {sub && <div className="text-[11px] text-slate-600 mt-1">{sub}</div>}
    </div>
  )
}

function MiniBar({ value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)', minWidth: 64 }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, value)}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-bold tabular-nums" style={{ color, minWidth: 32 }}>
        {value}%
      </span>
    </div>
  )
}

function StyledBadge({ children, type }) {
  const MAP = {
    red:    { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.25)'   },
    green:  { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80', border: 'rgba(34,197,94,0.25)'   },
    blue:   { bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa', border: 'rgba(96,165,250,0.25)'  },
    orange: { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c', border: 'rgba(249,115,22,0.25)'  },
    gray:   { bg: 'rgba(148,163,184,0.08)', color: '#94a3b8', border: 'rgba(148,163,184,0.15)' },
    gold:   { bg: 'rgba(201,168,76,0.12)',  color: '#e8c56a', border: 'rgba(201,168,76,0.25)'  },
  }
  const s = MAP[type] || MAP.gray
  return (
    <span
      className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {children}
    </span>
  )
}

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */

export default function InventoryPortal() {
  const [tab, setTab] = useState('stock')
  const [showTransfer, setShowTransfer] = useState(null)
  const [inventory, setInventory] = useState([])
  const [transferAlerts, setTransferAlerts] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    item: '', category: '', branch: '', stock: '',
    min: '', unit: '', expiry: '', supplier: '',
  })

  useEffect(() => { fetchInventory() }, [])

  async function fetchInventory() {
    try {
      const res = await fetch('http://localhost:8000/inventory/')
      const data = await res.json()
      setInventory(data)
    } catch (err) {
      console.log('Error fetching inventory', err)
    }
  }

  const lowStock = inventory.filter((i) => i.stock <= i.min)
  const expiring = inventory.filter((item) => {
    if (!item.expiry) return false
    const daysLeft = (new Date(item.expiry) - new Date()) / 86400000
    return daysLeft <= 5
  })

  const suppliers = [
    { name: 'Shree Traders', cat: 'Grain/Sugar',  ontime: 96, quality: 88, trend: '↓ Improving', orders: 34 },
    { name: 'Amul Direct',   cat: 'Dairy',         ontime: 82, quality: 92, trend: '→ Stable',    orders: 22 },
    { name: 'Fresh Farms',   cat: 'Protein',        ontime: 74, quality: 78, trend: '↑ Declining', orders: 18 },
    { name: 'Local Market',  cat: 'Vegetables',     ontime: 68, quality: 72, trend: '↑ Declining', orders: 40 },
    { name: 'Fortune',       cat: 'Oil',            ontime: 94, quality: 90, trend: '↓ Improving', orders: 12 },
  ]

  const tabs = [
    { id: 'stock',     icon: '📦', label: 'Stock Levels' },
    { id: 'transfer',  icon: '🔄', label: 'Cross-Branch',
      badge: transferAlerts.filter((t) => t.status === 'Pending').length || undefined },
    { id: 'suppliers', icon: '🤝', label: 'Suppliers' },
  ]

  /* ─── shared table wrapper style ─── */
  const tableCard = {
    background: 'linear-gradient(145deg, #111520 0%, #0e1118 100%)',
    border: '1px solid rgba(30,42,62,0.8)',
    borderRadius: 16,
    overflow: 'hidden',
  }
  const thStyle = {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontWeight: 600,
    color: '#475569',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  }
  const tdStyle = {
    padding: '11px 16px',
    fontSize: 12,
    color: '#94a3b8',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  }

  /* ════════════════════════════════════════════════ */
  return (
    <div className="space-y-4">

      {/* ── Alert Strip ── */}
      {lowStock.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[12px]"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
        >
          <span>⚠️</span>
          <span>
            <strong>LOW STOCK:</strong> {item.item} at {item.branch}&nbsp;
            ({item.stock}{item.unit}, min {item.min}{item.unit})
          </span>
        </div>
      ))}
      {expiring.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[12px]"
          style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', color: '#fdba74' }}
        >
          <span>⏰</span>
          <span>
            <strong>EXPIRY:</strong> {item.item} at {item.branch} expires {item.expiry}
          </span>
        </div>
      ))}

      {/* ── Tabs ── */}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* ══════════════ STOCK TAB ══════════════ */}
      {tab === 'stock' && (
        <div className="space-y-4">

          {/* Stat strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total SKUs"       value="48"              icon="📦" accent="#60a5fa" />
            <StatCard label="Low Stock Items"  value={lowStock.length} icon="⚠️" accent="#ef4444" sub="Below minimum" />
            <StatCard label="Expiring Soon"    value={expiring.length} icon="⏰" accent="#f59e0b" sub="Within 5 days" />
            <StatCard label="Stock Value"      value="₹4.2L"           icon="💰" accent="#c9a84c" />
          </div>

          {/* Add Stock Form */}
          {showAdd && (
            <div
              className="rounded-2xl overflow-hidden"
              style={tableCard}
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                    style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)' }}
                  >
                    ➕
                  </div>
                  <div className="text-[14px] font-semibold text-white">Add Inventory Item</div>
                </div>
                <button
                  onClick={() => setShowAdd(false)}
                  className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {Object.keys(form).map((key) => (
                    <div key={key}>
                      <label className="block text-[10px] uppercase tracking-[0.12em] text-slate-500 mb-1.5 capitalize">
                        {key}
                      </label>
                      <input
                        placeholder={key}
                        className="input"
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #c9a84c 0%, #b8922e 100%)',
                      color: '#000',
                      boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
                    }}
                    onClick={async () => {
                      await fetch('http://localhost:8000/inventory/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          item: form.item, category: form.category, branch: form.branch,
                          stock: Number(form.stock), min: Number(form.min), unit: form.unit,
                          expiry: form.expiry || null, supplier: form.supplier || null,
                        }),
                      })
                      fetchInventory()
                    }}
                  >
                    Save Item
                  </button>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] text-slate-400 transition-all hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stock Table */}
          <div style={tableCard}>
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <div>
                <div className="text-[14px] font-semibold text-white">Real-Time Stock Levels</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{inventory.length} items tracked</div>
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all hover:scale-105"
                style={{
                  background: 'rgba(96,165,250,0.12)',
                  color: '#60a5fa',
                  border: '1px solid rgba(96,165,250,0.25)',
                }}
              >
                + Add Stock
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {['Item', 'Category', 'Branch', 'Stock Level', 'Min Required', 'Status', 'Expiry', 'Supplier', 'Action'].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const pct = Math.min(100, (item.stock / item.min) * 100)
                    const daysLeft = (new Date(item.expiry) - new Date()) / 86400000
                    const isLow = item.stock <= item.min
                    const isExpiring = daysLeft <= 5
                    return (
                      <tr
                        key={item._id}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        style={{ transition: 'background 0.15s' }}
                      >
                        <td style={tdStyle}>
                          <span className="font-semibold text-slate-200 flex items-center gap-1">
                            {(isLow || isExpiring) && <span className="text-red-400">🚩</span>}
                            {item.item}
                          </span>
                        </td>
                        <td style={tdStyle}><StyledBadge type="gray">{item.category}</StyledBadge></td>
                        <td style={tdStyle}><StyledBadge type="blue">{item.branch}</StyledBadge></td>
                        <td style={{ ...tdStyle, minWidth: 160 }}>
                          <MiniBar value={pct} color={isLow ? '#ef4444' : '#22c55e'} />
                          <div className="text-[11px] mt-0.5" style={{ color: isLow ? '#f87171' : '#64748b' }}>
                            {item.stock} {item.unit}
                          </div>
                        </td>
                        <td style={tdStyle}>{item.min} {item.unit}</td>
                        <td style={tdStyle}>
                          <StyledBadge type={isLow ? 'red' : 'green'}>{isLow ? '⚠ Low Stock' : '✓ OK'}</StyledBadge>
                        </td>
                        <td style={{ ...tdStyle, color: isExpiring ? '#f87171' : '#475569' }}>
                          {item.expiry}{isExpiring && ' ⚠️'}
                        </td>
                        <td style={tdStyle}>{item.supplier}</td>
                        <td style={tdStyle}>
                          <div className="flex gap-1.5">
                            {isLow && (
                              <button
                                onClick={() => alert('PO raised for ' + item.item)}
                                className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                                style={{ background: 'rgba(201,168,76,0.12)', color: '#e8c56a', border: '1px solid rgba(201,168,76,0.25)' }}
                              >
                                📋 PO
                              </button>
                            )}
                            <button
                              className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                              style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                              onClick={async () => {
                                const newStock = prompt('Enter new stock value:')
                                if (newStock === null) return
                                const stockNumber = Number(newStock)
                                if (isNaN(stockNumber)) { alert('Please enter a valid number'); return }
                                try {
                                  const res = await fetch(`http://localhost:8000/inventory/${item._id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ stock: stockNumber }),
                                  })
                                  if (!res.ok) { alert('Update failed'); return }
                                  fetchInventory()
                                  alert('Stock updated successfully!')
                                } catch (err) { alert('Server error') }
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {inventory.length === 0 && (
                <div className="py-16 text-center text-slate-700 text-[13px]">No inventory items yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TRANSFER TAB ══════════════ */}
      {tab === 'transfer' && (
        <div className="space-y-4">
          {transferAlerts.map((t) => (
            <div
              key={t._id}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(201,168,76,0.06) 0%, rgba(12,15,20,0.8) 100%)',
                border: '1px solid rgba(201,168,76,0.2)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }}
              />
              <div className="text-[12px] font-bold text-amber-300 mb-2 flex items-center gap-2">
                🔄 <span>Smart Transfer Alert</span>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed mb-4">
                <strong className="text-white">{t.to} branch</strong> has a shortage of {t.item} — needs {t.qty}{t.unit} for{' '}
                <strong className="text-white">{t.event}</strong>.{' '}
                <strong className="text-white">{t.from} branch</strong> has a surplus. Transfer recommended by <strong className="text-amber-300">{t.dueBy}</strong>.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[['Item', t.item], ['From', t.from + ' (surplus)'], ['To', t.to + ' (shortage)'], ['Quantity', t.qty + ' ' + t.unit]].map(([k, v]) => (
                  <div
                    key={k}
                    className="p-2.5 rounded-lg"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">{k}</div>
                    <div className="text-[12px] font-semibold text-slate-200">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {t.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => { approveTransfer(t._id); alert('Transfer approved! Logistics notified.') }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #c9a84c 0%, #b8922e 100%)',
                        color: '#000',
                        boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
                      }}
                    >
                      ✅ Approve Transfer
                    </button>
                    <button
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] text-slate-400 transition-all hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      View Details
                    </button>
                  </>
                ) : (
                  <StyledBadge type="green">✅ Transfer Approved</StyledBadge>
                )}
              </div>
            </div>
          ))}

          {/* Transfer History */}
          <div style={tableCard}>
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <div className="text-[14px] font-semibold text-white">Transfer History</div>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {['Item', 'From', 'To', 'Qty', 'Event', 'Date', 'Status'].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { item: 'Rice', from: 'Thane',  to: 'Andheri', qty: '50 kg', event: 'TCS Annual',       date: '2026-02-18', status: 'Completed' },
                  { item: 'Oil',  from: 'Bandra', to: 'Pune',    qty: '20 L',  event: 'Mehta Anniversary', date: '2026-02-10', status: 'Completed' },
                ].map((t, i) => (
                  <tr
                    key={i}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    style={{ transition: 'background 0.15s' }}
                  >
                    <td style={{ ...tdStyle, color: '#e2e8f0', fontWeight: 600 }}>{t.item}</td>
                    <td style={tdStyle}>{t.from}</td>
                    <td style={tdStyle}>{t.to}</td>
                    <td style={tdStyle}>{t.qty}</td>
                    <td style={tdStyle}>{t.event}</td>
                    <td style={tdStyle}>{t.date}</td>
                    <td style={tdStyle}><StyledBadge type="green">{t.status}</StyledBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ SUPPLIERS TAB ══════════════ */}
      {tab === 'suppliers' && (
        <div style={tableCard}>
          <div
            className="px-6 py-4 border-b flex items-center gap-3"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}
            >
              🤝
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white">Supplier Performance Dashboard</div>
              <div className="text-[11px] text-slate-600">{suppliers.length} active vendors</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['Supplier', 'Category', 'On-Time Delivery', 'Quality Score', 'Price Trend', 'Orders', 'Action'].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => {
                  const isGoodTime    = s.ontime > 85
                  const isGoodQuality = s.quality > 85
                  const trendColor    = s.trend.includes('Improving') ? '#4ade80'
                                      : s.trend.includes('Declining') ? '#f87171'
                                      : '#94a3b8'
                  return (
                    <tr
                      key={s.name}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      style={{ transition: 'background 0.15s' }}
                    >
                      <td style={{ ...tdStyle, color: '#e2e8f0', fontWeight: 600 }}>{s.name}</td>
                      <td style={tdStyle}><StyledBadge type="gray">{s.cat}</StyledBadge></td>
                      <td style={{ ...tdStyle, minWidth: 160 }}>
                        <MiniBar value={s.ontime} color={isGoodTime ? '#22c55e' : '#f97316'} />
                      </td>
                      <td style={tdStyle}>
                        <span className="font-bold text-[13px]" style={{ color: isGoodQuality ? '#4ade80' : '#fb923c' }}>
                          {s.quality}%
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: trendColor }}>{s.trend}</td>
                      <td style={tdStyle}>{s.orders}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => alert('PO generated for ' + s.name)}
                          className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{
                            background: 'rgba(201,168,76,0.12)',
                            color: '#e8c56a',
                            border: '1px solid rgba(201,168,76,0.25)',
                          }}
                        >
                          📋 Generate PO
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
