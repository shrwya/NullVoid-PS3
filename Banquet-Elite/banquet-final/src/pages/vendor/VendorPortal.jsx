import React, { useState } from 'react'
import { Alert, Badge, SectionHead, ProgressBar, Tabs } from '../../components/ui'
import { useStore } from '../../store/useStore'

export default function VendorPortal() {
  const { vendors } = useStore()
  const [tab, setTab] = useState('vendors')

  const tabs = [
    { id: 'vendors',  icon: '🤝', label: 'Vendors' },
    { id: 'pos',      icon: '📋', label: 'Purchase Orders' },
    { id: 'invoices', icon: '🧾', label: 'Invoice Approval', badge: 2 },
  ]

  const pos = [
    { po: 'PO-2026-034', vendor: 'Patel Decorators', event: 'Sharma Wedding', amount: 45000, status: 'Approved', due: '2026-03-12' },
    { po: 'PO-2026-033', vendor: 'Flash Photography', event: 'Sharma Wedding', amount: 35000, status: 'Paid',    due: '2026-03-15' },
    { po: 'PO-2026-032', vendor: 'SecureForce',       event: 'TCS Annual',     amount: 18000, status: 'Pending', due: '2026-03-17' },
  ]

  const vendorInvoices = [
    { inv: 'VI-2026-018', vendor: 'Patel Decorators', event: 'Patel Engagement', amount: 22000, date: '2026-02-28', status: 'Pending' },
    { inv: 'VI-2026-017', vendor: 'Sound Arena',      event: 'TCS Annual',       amount: 12000, date: '2026-02-25', status: 'Approved' },
  ]

  return (
    <div className="space-y-4 animate-fade-up">
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'vendors' && (
        <div>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Active Vendors', value: vendors.filter(v => v.status === 'Active').length, icon: '🤝' },
              { label: 'Total Pending', value: '₹87K', icon: '⏳', sub: 'Across all vendors' },
              { label: 'Avg Rating', value: '4.5★', icon: '⭐' },
              { label: 'Events Covered', value: '131', icon: '📅' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="flex justify-between"><span className="stat-label">{s.label}</span><span className="text-lg">{s.icon}</span></div>
                <div className="stat-value">{s.value}</div>
                {s.sub && <div className="text-[12px] text-slate-500">{s.sub}</div>}
              </div>
            ))}
          </div>

          <div className="card p-5">
            <SectionHead title="Vendor Directory" action={{ label: '+ Onboard Vendor', fn: () => alert('Onboard form') }} />
            <table className="tbl">
              <thead>
                <tr>{['Vendor', 'Category', 'Rating', 'Events', 'Pending', 'On-Time', 'Quality', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id}>
                    <td className="font-medium text-slate-200">{v.name}</td>
                    <td><Badge type="purple">{v.category}</Badge></td>
                    <td><span className="text-amber-400 font-bold">★ {v.rating}</span></td>
                    <td>{v.events}</td>
                    <td style={{ color: v.pending > 0 ? '#f97316' : '#475569' }}>
                      {v.pending > 0 ? '₹' + v.pending.toLocaleString('en-IN') : '—'}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <ProgressBar value={v.ontime} color={v.ontime > 85 ? '#22c55e' : '#f97316'} className="w-14" />
                        <span className="text-[11px]">{v.ontime}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: v.quality > 85 ? '#22c55e' : '#f97316' }} className="font-bold text-[12px]">{v.quality}%</span>
                    </td>
                    <td><Badge type={v.status === 'Active' ? 'green' : 'gray'}>{v.status}</Badge></td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-primary btn-xs" onClick={() => alert('PO generated for ' + v.name)}>📋 PO</button>
                        {v.pending > 0 && (
                          <button className="btn btn-xs" style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}
                            onClick={() => alert('Payment processing for ' + v.name)}>💳</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'pos' && (
        <div className="card p-5">
          <SectionHead title="Purchase Orders" action={{ label: '+ New PO', fn: () => {} }} />
          <table className="tbl">
            <thead>
              <tr>{['PO #', 'Vendor', 'Event', 'Amount', 'Status', 'Due Date', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {pos.map((p, i) => (
                <tr key={i}>
                  <td className="text-brand-light font-medium">{p.po}</td>
                  <td>{p.vendor}</td>
                  <td>{p.event}</td>
                  <td className="font-medium">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td><Badge type={p.status === 'Paid' ? 'green' : p.status === 'Approved' ? 'blue' : 'orange'}>{p.status}</Badge></td>
                  <td>{p.due}</td>
                  <td>
                    {p.status !== 'Paid' && (
                      <button className="btn btn-ghost btn-xs" onClick={() => alert('Marking as paid')}>✅ Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'invoices' && (
        <div>
          <Alert type="gold" icon="🧾">2 vendor invoices pending approval. Review and approve to process payment.</Alert>
          <div className="card p-5">
            <SectionHead title="Vendor Invoice Approval Queue" />
            <table className="tbl">
              <thead>
                <tr>{['Invoice', 'Vendor', 'Event', 'Amount', 'Submitted', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {vendorInvoices.map((inv, i) => (
                  <tr key={i}>
                    <td className="text-brand-light font-medium">{inv.inv}</td>
                    <td>{inv.vendor}</td>
                    <td>{inv.event}</td>
                    <td className="font-bold">₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td>{inv.date}</td>
                    <td><Badge type={inv.status === 'Approved' ? 'green' : 'orange'}>{inv.status}</Badge></td>
                    <td>
                      {inv.status === 'Pending' && (
                        <div className="flex gap-1">
                          <button className="btn btn-success btn-xs" onClick={() => alert('Invoice approved!')}>✅ Approve</button>
                          <button className="btn btn-danger btn-xs" onClick={() => alert('Invoice rejected!')}>❌ Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
