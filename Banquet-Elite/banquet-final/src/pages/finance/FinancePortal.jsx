import React, { useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Alert, Badge, SectionHead, Tabs, Modal } from '../../components/ui'
import { useStore, mockBranchHealth, mockFinanceData } from '../../store/useStore'

const TIP = {
  contentStyle: { background: '#161c2a', border: '1px solid #1e2a3e', borderRadius: 8, fontSize: 12 },
}

export default function FinancePortal() {
  const { invoices, damageReports } = useStore()
  const [tab, setTab] = useState('billing')
  const [selectedInv, setSelectedInv] = useState(null)

  const tabs = [
    { id: 'billing',  icon: '🧾', label: 'Billing & Invoices' },
    { id: 'payments', icon: '💳', label: 'Payments' },
    { id: 'reports',  icon: '📊', label: 'Reports' },
  ]

  const totalInvoiced = invoices.reduce((a, i) => a + i.total, 0)
  const collected     = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.total, 0)
  const outstanding   = totalInvoiced - collected

  return (
    <div className="space-y-4 animate-fade-up">
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'billing' && (
        <div>
          <Alert type="blue" icon="🔗">
            Damage deduction of ₹4,500 from Singh Birthday (Property Manager) auto-synced to settlement.
          </Alert>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total Invoiced', value: '₹' + (totalInvoiced / 100000).toFixed(1) + 'L', icon: '🧾', change: '+14%' },
              { label: 'Collected',      value: '₹' + (collected / 100000).toFixed(1) + 'L',     icon: '✅', sub: (collected / totalInvoiced * 100).toFixed(0) + '% collected' },
              { label: 'Outstanding',    value: '₹' + (outstanding / 100000).toFixed(1) + 'L',   icon: '⏳' },
              { label: 'GST Payable',    value: '₹1.21L', icon: '🏛', sub: 'This month' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="flex justify-between"><span className="stat-label">{s.label}</span><span className="text-lg">{s.icon}</span></div>
                <div className="stat-value">{s.value}</div>
                {s.sub && <div className="text-[12px] text-slate-500">{s.sub}</div>}
                {s.change && <div className="stat-change-up">↑ {s.change} vs last month</div>}
              </div>
            ))}
          </div>

          <div className="card p-5">
            <SectionHead title="Invoices" action={{ label: '+ New Invoice', fn: () => alert('Invoice builder') }} />
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>{['Invoice #', 'Client', 'Base Amount', 'GST (18%)', 'Total', 'Status', 'Date', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="text-brand-light font-medium">{inv.id}</td>
                      <td className="font-medium text-slate-200">{inv.client}</td>
                      <td>₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td className="text-slate-500">₹{inv.gst.toLocaleString('en-IN')}</td>
                      <td className="font-bold text-amber-400">₹{inv.total.toLocaleString('en-IN')}</td>
                      <td>
                        <Badge type={inv.status === 'Paid' ? 'green' : inv.status === 'Partial' ? 'orange' : 'blue'}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td>{inv.date}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-xs" onClick={() => setSelectedInv(inv)}>👁</button>
                          <button className="btn btn-ghost btn-xs" onClick={() => alert('PDF downloaded')}>📥 PDF</button>
                          {inv.status !== 'Paid' && (
                            <button className="btn btn-primary btn-xs" onClick={() => alert('Payment recorded')}>💳</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Damage-linked settlements */}
          <div className="card p-5">
            <SectionHead title="Post-Event Settlement Adjustments" />
            <Alert type="blue" icon="🔗">
              These deductions were automatically pulled from Property Manager damage reports.
            </Alert>
            <table className="tbl">
              <thead>
                <tr>{['Event', 'Damage Ref', 'Deduction', 'Auto-Applied', 'Status'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {damageReports.filter(d => d.status === 'Approved').map(d => (
                  <tr key={d.id}>
                    <td className="font-medium text-slate-200">{d.event}</td>
                    <td>{d.items.slice(0, 40)}...</td>
                    <td className="text-red-400 font-bold">-₹{d.amount.toLocaleString('en-IN')}</td>
                    <td><span className="text-emerald-400 text-[12px]">✅ Auto-synced</span></td>
                    <td><Badge type="green">Applied</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'payments' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="card p-5">
            <SectionHead title="Record Payment" />
            <div className="space-y-0">
              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[11px] text-slate-500 uppercase tracking-wider">Invoice</label>
                <select className="input">
                  {invoices.filter(i => i.status !== 'Paid').map(i => (
                    <option key={i.id}>{i.id} — {i.client}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[11px] text-slate-500 uppercase tracking-wider">Amount Received (₹)</label>
                <input className="input" type="number" placeholder="0.00" />
              </div>
              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[11px] text-slate-500 uppercase tracking-wider">Payment Mode</label>
                <select className="input">
                  {['Online Transfer', 'Cash', 'Cheque', 'UPI', 'Card'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[11px] text-slate-500 uppercase tracking-wider">Transaction Reference</label>
                <input className="input" placeholder="UTR / Ref number" />
              </div>
              <button className="btn btn-gold w-full justify-center" onClick={() => alert('Payment recorded!')}>
                ✅ Record Payment
              </button>
            </div>
          </div>

          <div className="card p-5">
            <SectionHead title="Recent Payments" />
            {[
              { client: 'Sharma Wedding',   amount: 500000, mode: 'Online', date: '2026-02-28', ref: 'UTR20260228001' },
              { client: 'Gupta Wedding',    amount: 200000, mode: 'Cash',   date: '2026-02-25', ref: 'CASH-2502' },
              { client: 'Patel Engagement', amount: 150000, mode: 'UPI',    date: '2026-02-22', ref: 'UPI220226888' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <div className="text-[13px] font-medium text-slate-200">{p.client}</div>
                  <div className="text-[11px] text-slate-500">{p.date} • {p.ref}</div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-emerald-400">₹{p.amount.toLocaleString('en-IN')}</div>
                  <Badge type="gray">{p.mode}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div>
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="card p-5">
              <SectionHead title="Monthly Revenue vs Expenses" />
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={mockFinanceData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3e" />
                  <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...TIP} formatter={(v) => ['₹' + (v / 1000).toFixed(0) + 'K']} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="revenue"  fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="rgba(239,68,68,0.5)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit"   fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <SectionHead title="Branch Revenue Split" />
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={mockBranchHealth.map(b => ({ name: b.branch, value: b.revenue }))}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                    dataKey="value" paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {mockBranchHealth.map((b, i) => <Cell key={i} fill={b.color} />)}
                  </Pie>
                  <Tooltip {...TIP} formatter={(v) => ['₹' + (v / 100000).toFixed(1) + 'L']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-5">
            <SectionHead title="Export Reports" />
            <div className="flex flex-wrap gap-2">
              {[
                'Daily Revenue Summary', 'Monthly P&L', 'Branch-wise Breakdown',
                'GST Report', 'Outstanding Payments', 'Staff Commission Report',
                'Vendor Payment Register', 'Event Profitability Analysis',
              ].map(r => (
                <button key={r} className="btn btn-outline" onClick={() => alert('Exporting: ' + r + '.xlsx')}>
                  📥 {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      <Modal open={!!selectedInv} onClose={() => setSelectedInv(null)} title={selectedInv?.id || ''}>
        {selectedInv && (
          <>
            <div className="bg-surface2 rounded-xl p-5 mb-4">
              <div className="font-display text-xl text-amber-400 mb-4">BanquetOS Tax Invoice</div>
              {[
                ['Client',       selectedInv.client],
                ['Branch',       selectedInv.branch],
                ['Invoice Date', selectedInv.date],
                ['Base Amount',  '₹' + selectedInv.amount.toLocaleString('en-IN')],
                ['GST @ 18%',    '₹' + selectedInv.gst.toLocaleString('en-IN')],
                ['TOTAL',        '₹' + selectedInv.total.toLocaleString('en-IN')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-border last:border-0"
                  style={{ fontSize: k === 'TOTAL' ? 15 : 13, fontWeight: k === 'TOTAL' ? 700 : 400,
                    color: k === 'TOTAL' ? '#e8c56a' : k.includes('GST') ? '#64748b' : '#cbd5e1' }}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}

              {/* Damage deduction */}
              {selectedInv.client === 'Kumar Reception' && (
                <div className="flex justify-between py-2 border-b border-border" style={{ fontSize: 13, color: '#ef4444' }}>
                  <span>Damage Deduction (auto)</span>
                  <span>-₹4,500</span>
                </div>
              )}
            </div>
            <button className="btn btn-gold w-full justify-center" onClick={() => alert('PDF downloaded!')}>
              📥 Download PDF
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}
