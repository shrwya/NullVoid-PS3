import React, { useState } from 'react'
import { Alert, Badge, SectionHead, Tabs, Modal, Field } from '../../components/ui'
import { useStore } from '../../store/useStore'

export default function PropertyPortal() {
  const { events, addDamageReport, damageReports } = useStore()
  const [tab, setTab] = useState('events')
  const [showDamage, setShowDamage] = useState(false)
  const [dmg, setDmg] = useState({ event: '', hall: '', items: '', amount: '' })

  const tabs = [
    { id: 'events',   icon: '🔧', label: 'Event Setup' },
    { id: 'calendar', icon: '📅', label: 'Availability' },
    { id: 'damage',   icon: '📸', label: 'Damage Reports' },
  ]

  const bookedDays = [15, 18, 20, 28]
  const tentativeDays = [8]

  return (
    <div className="space-y-4 animate-fade-up">
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'events' && (
        <div className="space-y-4">
          <Alert type="blue" icon="🔗">
            Damage reports auto-sync to Finance settlement. No manual entry needed across portals.
          </Alert>
          {events.slice(0, 3).map((ev) => (
            <div key={ev.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[15px] font-semibold text-slate-200">{ev.name}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5">{ev.hall} • {ev.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <div className="text-xl font-bold text-white">{ev.guests}</div>
                    <div className="text-[10px] text-slate-500">guests</div>
                  </div>
                  <Badge type={ev.status === 'Confirmed' ? 'green' : 'orange'}>{ev.status}</Badge>
                </div>
              </div>

              {/* Setup timeline */}
              <div className="mb-4">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Setup Timeline</div>
                <div className="flex items-center gap-0">
                  {[
                    { label: 'T-2 days', task: 'Hall clean & basic', done: true },
                    { label: 'T-1 day',  task: 'Decoration & lights', done: true },
                    { label: 'T-6 hrs',  task: 'Stage & furniture',   done: false },
                    { label: 'T-2 hrs',  task: 'Table settings',      done: false },
                    { label: 'T-30 min', task: 'Final walkthrough',   done: false },
                  ].map((step, i, arr) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${step.done ? 'bg-emerald-500 text-white' : 'bg-surface2 border border-border2 text-slate-500'}`}>
                          {step.done ? '✓' : i + 1}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-1 text-center whitespace-nowrap">{step.label}</div>
                        <div className="text-[9px] text-slate-600 text-center max-w-[70px] leading-tight">{step.task}</div>
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-8 ${step.done ? 'bg-emerald-500' : 'bg-border2'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="card-elevated p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 mb-1">Vendors Assigned</div>
                  <div className="text-[12px] text-slate-300">Patel Decorators, SecureForce</div>
                </div>
                <div className="card-elevated p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 mb-1">Dietary Flags</div>
                  <div className="text-[12px]" style={{ color: ev.dietary.length > 0 ? '#ef4444' : '#22c55e' }}>
                    {ev.dietary.join(', ') || 'None'}
                  </div>
                </div>
                <div className="card-elevated p-3 rounded-lg flex items-center justify-end">
                  <button className="btn btn-danger btn-sm" onClick={() => setShowDamage(true)}>
                    📸 Log Damage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'calendar' && (
        <div className="card p-5">
          <SectionHead title="Hall Availability — March 2026" />
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="text-center text-[11px] text-slate-500 py-2 font-medium">{d}</div>
            ))}
            {[...Array(31)].map((_, i) => {
              const day = i + 1
              const isBooked = bookedDays.includes(day)
              const isTent = tentativeDays.includes(day)
              return (
                <div
                  key={day}
                  className="text-center py-3 rounded-lg cursor-pointer text-[13px] transition-all hover:opacity-80"
                  style={{
                    background: isBooked ? 'rgba(239,68,68,0.12)' : isTent ? 'rgba(249,115,22,0.1)' : '#161c2a',
                    color: isBooked ? '#ef4444' : isTent ? '#f97316' : '#64748b',
                    border: `1px solid ${isBooked ? 'rgba(239,68,68,0.3)' : isTent ? 'rgba(249,115,22,0.2)' : '#1e2a3e'}`,
                    fontWeight: isBooked ? 700 : 400,
                  }}
                >
                  {day}
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 text-[12px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30 inline-block" /> Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500/15 border border-orange-500/20 inline-block" /> Tentative</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-surface2 border border-border inline-block" /> Available</span>
          </div>
        </div>
      )}

      {tab === 'damage' && (
        <div>
          <Alert type="blue" icon="🔗">
            Approved damage charges are automatically added to post-event settlement in Finance portal.
          </Alert>
          <SectionHead title="Damage Reports" action={{ label: '+ New Report', fn: () => setShowDamage(true) }} />
          <div className="card p-5">
            <table className="tbl">
              <thead>
                <tr>{['Event', 'Hall', 'Date', 'Damage Details', 'Amount', 'Status', 'Finance Sync'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {damageReports.map((d) => (
                  <tr key={d.id}>
                    <td className="font-medium text-slate-200">{d.event}</td>
                    <td>{d.hall}</td>
                    <td>{d.date}</td>
                    <td className="max-w-[180px]" style={{ whiteSpace: 'normal' }}>{d.items}</td>
                    <td className="font-bold text-red-400">₹{d.amount.toLocaleString('en-IN')}</td>
                    <td><Badge type={d.status === 'Approved' ? 'green' : 'orange'}>{d.status}</Badge></td>
                    <td>
                      {d.status === 'Approved'
                        ? <span className="text-[12px] text-emerald-400">✅ Auto-synced</span>
                        : <span className="text-[12px] text-slate-500">⏳ Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Damage Modal */}
      <Modal open={showDamage} onClose={() => setShowDamage(false)} title="🚨 Log Damage Report">
        <Alert type="blue" icon="🔗">This will auto-update the Finance settlement amount.</Alert>
        <div className="mt-3">
          <Field label="Event">
            <select className="input" value={dmg.event} onChange={e => setDmg({ ...dmg, event: e.target.value })}>
              <option value="">Select event...</option>
              {events.map(ev => <option key={ev.id}>{ev.name}</option>)}
            </select>
          </Field>
          <Field label="Hall">
            <input className="input" value={dmg.hall} onChange={e => setDmg({ ...dmg, hall: e.target.value })} placeholder="e.g. Grand Ballroom" />
          </Field>
          <Field label="Damage Description">
            <textarea className="input" rows={3} value={dmg.items} onChange={e => setDmg({ ...dmg, items: e.target.value })} placeholder="Describe the damage in detail..." />
          </Field>
          <Field label="Estimated Amount (₹)">
            <input className="input" type="number" value={dmg.amount} onChange={e => setDmg({ ...dmg, amount: e.target.value })} />
          </Field>
          <div
            className="border-2 border-dashed border-border2 rounded-xl p-6 text-center text-[12px] text-slate-500 cursor-pointer hover:border-border transition-colors mb-4"
            onClick={() => alert('File upload would open here')}
          >
            📷 Upload Damage Photos<br />
            <span className="text-[11px] text-slate-600">Click or drag & drop</span>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-danger flex-1 justify-center"
              onClick={() => {
                if (!dmg.event || !dmg.items) return alert('Please fill required fields')
                addDamageReport({ ...dmg, date: '2026-02-28' })
                alert('Damage report submitted! Finance portal settlement updated automatically.')
                setShowDamage(false)
              }}>
              Submit Report
            </button>
            <button className="btn btn-ghost" onClick={() => setShowDamage(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
