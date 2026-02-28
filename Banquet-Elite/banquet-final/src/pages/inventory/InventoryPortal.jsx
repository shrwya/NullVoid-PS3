import React, { useState } from 'react'
import { Alert, Badge, SectionHead, ProgressBar, Tabs, Modal } from '../../components/ui'
import { useStore } from '../../store/useStore'

export default function InventoryPortal() {
  const { inventory, transferAlerts, approveTransfer } = useStore()
  const [tab, setTab] = useState('stock')
  const [showTransfer, setShowTransfer] = useState(null)

  const tabs = [
    { id: 'stock',     icon: '📦', label: 'Stock Levels' },
    { id: 'transfer',  icon: '🔄', label: 'Cross-Branch', badge: transferAlerts.filter(t => t.status === 'Pending').length || undefined },
    { id: 'suppliers', icon: '🤝', label: 'Suppliers' },
  ]

  const lowStock  = inventory.filter((i) => i.stock <= i.min)
  const expiring  = inventory.filter((i) => {
    const days = (new Date(i.expiry) - new Date()) / 86400000
    return days <= 5
  })

  const suppliers = [
    { name: 'Shree Traders', cat: 'Grain/Sugar',  ontime: 96, quality: 88, trend: '↓ Improving', orders: 34 },
    { name: 'Amul Direct',   cat: 'Dairy',         ontime: 82, quality: 92, trend: '→ Stable',    orders: 22 },
    { name: 'Fresh Farms',   cat: 'Protein',        ontime: 74, quality: 78, trend: '↑ Declining', orders: 18 },
    { name: 'Local Market',  cat: 'Vegetables',     ontime: 68, quality: 72, trend: '↑ Declining', orders: 40 },
    { name: 'Fortune',       cat: 'Oil',            ontime: 94, quality: 90, trend: '↓ Improving', orders: 12 },
  ]

  return (
    <div className="space-y-4 animate-fade-up">
      <Alert type="red" icon="⚠️">
        <strong>LOW STOCK:</strong> Paneer at Andheri (18kg, min 20kg). Sharma Wedding needs 35kg on Mar 15.
      </Alert>
      <Alert type="gold" icon="🔄">
        <strong>CROSS-BRANCH:</strong> Pune has 42kg Paneer surplus — transfer to Andheri recommended before Mar 14.
      </Alert>
      <Alert type="orange" icon="⏰">
        <strong>EXPIRY:</strong> Chicken at Andheri expires Mar 3 (3 days). Use priority or return to supplier.
      </Alert>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'stock' && (
        <div>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total SKUs',      value: '48',          icon: '📦' },
              { label: 'Low Stock Items', value: lowStock.length, icon: '⚠️', sub: 'Below minimum' },
              { label: 'Expiring Soon',   value: expiring.length, icon: '⏰', sub: 'Within 5 days' },
              { label: 'Stock Value',     value: '₹4.2L',       icon: '💰' },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="flex items-start justify-between">
                  <span className="stat-label">{s.label}</span>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div className="stat-value">{s.value}</div>
                {s.sub && <div className="text-[12px] text-slate-500">{s.sub}</div>}
              </div>
            ))}
          </div>

          <div className="card p-5">
            <SectionHead title="Real-Time Stock Levels" action={{ label: '+ Add Stock', fn: () => {} }} />
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    {['Item', 'Category', 'Branch', 'Stock Level', 'Min Required', 'Status', 'Expiry', 'Supplier', 'Action'].map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const pct = Math.min(100, (item.stock / item.min) * 100)
                    const daysLeft = (new Date(item.expiry) - new Date()) / 86400000
                    const isLow = item.stock <= item.min
                    const isExpiring = daysLeft <= 5
                    return (
                      <tr key={item.id}>
                        <td>
                          <span className="font-medium text-slate-200">
                            {(isLow || isExpiring) && <span className="mr-1">🚩</span>}
                            {item.item}
                          </span>
                        </td>
                        <td><Badge type="gray">{item.category}</Badge></td>
                        <td><Badge type="blue">{item.branch}</Badge></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <ProgressBar value={pct} color={isLow ? '#ef4444' : '#22c55e'} className="w-20" />
                            <span className="text-[12px]" style={{ color: isLow ? '#ef4444' : '#94a3b8' }}>
                              {item.stock} {item.unit}
                            </span>
                          </div>
                        </td>
                        <td className="text-[12px]">{item.min} {item.unit}</td>
                        <td><Badge type={isLow ? 'red' : 'green'}>{isLow ? 'Low Stock' : 'OK'}</Badge></td>
                        <td className="text-[12px]" style={{ color: isExpiring ? '#ef4444' : '#64748b' }}>
                          {item.expiry}{isExpiring && ' ⚠️'}
                        </td>
                        <td className="text-[12px]">{item.supplier}</td>
                        <td>
                          <div className="flex gap-1">
                            {isLow && (
                              <button className="btn btn-primary btn-xs" onClick={() => alert('PO raised for ' + item.item)}>
                                📋 PO
                              </button>
                            )}
                            <button className="btn btn-ghost btn-xs">Edit</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'transfer' && (
        <div>
          {transferAlerts.map((t) => (
            <div key={t.id} className="card-gold p-5 rounded-xl mb-4">
              <div className="text-[13px] font-semibold text-amber-300 mb-2">🔄 Smart Transfer Alert</div>
              <div className="text-[13px] text-slate-200 leading-relaxed mb-4">
                <strong>{t.to} branch</strong> has a shortage of {t.item} — needs {t.qty}{t.unit} for{' '}
                <strong>{t.event}</strong> on {new Date(t.event === 'Sharma Wedding' ? '2026-03-15' : '').toLocaleDateString()}.{' '}
                <strong>{t.from} branch</strong> has a surplus. Transfer of {t.qty}{t.unit} recommended by <strong>{t.dueBy}</strong>.
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[['Item', t.item], ['From', t.from + ' (surplus)'], ['To', t.to + ' (shortage)'], ['Quantity', t.qty + ' ' + t.unit]].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{k}</div>
                    <div className="text-[13px] font-medium text-slate-200">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {t.status === 'Pending' ? (
                  <>
                    <button className="btn btn-gold" onClick={() => { approveTransfer(t.id); alert('Transfer approved! Logistics notified.') }}>
                      ✅ Approve Transfer
                    </button>
                    <button className="btn btn-outline">View Details</button>
                  </>
                ) : (
                  <Badge type="green">✅ Transfer Approved</Badge>
                )}
              </div>
            </div>
          ))}

          <div className="card p-5">
            <SectionHead title="Transfer History" />
            <table className="tbl">
              <thead>
                <tr>{['Item', 'From', 'To', 'Qty', 'Event', 'Date', 'Status'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  { item: 'Rice', from: 'Thane', to: 'Andheri', qty: '50 kg', event: 'TCS Annual', date: '2026-02-18', status: 'Completed' },
                  { item: 'Oil',  from: 'Bandra', to: 'Pune', qty: '20 L', event: 'Mehta Anniversary', date: '2026-02-10', status: 'Completed' },
                ].map((t, i) => (
                  <tr key={i}>
                    <td className="font-medium text-slate-200">{t.item}</td>
                    <td>{t.from}</td>
                    <td>{t.to}</td>
                    <td>{t.qty}</td>
                    <td>{t.event}</td>
                    <td>{t.date}</td>
                    <td><Badge type="green">{t.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'suppliers' && (
        <div className="card p-5">
          <SectionHead title="Supplier Performance Dashboard" />
          <table className="tbl">
            <thead>
              <tr>{['Supplier', 'Category', 'On-Time Delivery', 'Quality Score', 'Price Trend', 'Orders', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.name}>
                  <td className="font-medium text-slate-200">{s.name}</td>
                  <td><Badge type="gray">{s.cat}</Badge></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.ontime} color={s.ontime > 85 ? '#22c55e' : '#f97316'} className="w-20" />
                      <span className="text-[12px]" style={{ color: s.ontime > 85 ? '#22c55e' : '#f97316' }}>{s.ontime}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-bold" style={{ color: s.quality > 85 ? '#22c55e' : '#f97316' }}>{s.quality}%</span>
                  </td>
                  <td style={{ color: s.trend.includes('Improving') ? '#22c55e' : s.trend.includes('Declining') ? '#ef4444' : '#94a3b8' }}>
                    {s.trend}
                  </td>
                  <td>{s.orders}</td>
                  <td>
                    <button className="btn btn-primary btn-xs" onClick={() => alert('PO generated for ' + s.name)}>
                      📋 Generate PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
