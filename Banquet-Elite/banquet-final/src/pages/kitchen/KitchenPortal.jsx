import React, { useState } from 'react'
import { Alert, Badge, SectionHead, ProgressBar, Tabs } from '../../components/ui'
import { useStore } from '../../store/useStore'

export default function KitchenPortal() {
  const { events, prepChecklist, toggleChecklistItem } = useStore()
  const [tab, setTab] = useState('events')

  const tabs = [
    { id: 'events',    icon: '📅', label: '14-Day Events' },
    { id: 'checklist', icon: '✅', label: 'Daily Prep' },
    { id: 'feedback',  icon: '⭐', label: 'Dish Feedback' },
  ]

  const dishFeedback = [
    { dish: 'Dal Makhani',           events: 18, rating: 4.7, complaints: 1,  praise: 14, status: '⭐ Top Performer' },
    { dish: 'Paneer Butter Masala',  events: 22, rating: 4.5, complaints: 3,  praise: 18, status: '✅ Good' },
    { dish: 'Biryani',               events: 31, rating: 4.3, complaints: 5,  praise: 22, status: '✅ Good' },
    { dish: 'Gulab Jamun',           events: 28, rating: 4.1, complaints: 8,  praise: 15, status: '⚠️ Watch' },
    { dish: 'Chaat',                 events: 12, rating: 3.8, complaints: 10, praise: 7,  status: '🚩 Review Recipe' },
  ]

  const doneCount = prepChecklist.filter((c) => c.done).length

  return (
    <div className="space-y-4 animate-fade-up">
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'events' && (
        <div>
          <Alert type="red" icon="⚠️">
            <strong>Stock alert:</strong> Paneer at Andheri is below minimum (18kg vs 20kg required). Sharma Wedding on Mar 15 needs 35kg. Raise PO now.
          </Alert>
          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[15px] font-semibold text-slate-200">{ev.name}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{ev.hall} • {ev.date} • {ev.branch}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{ev.guests}</div>
                      <div className="text-[10px] text-slate-500">{ev.guests > 300 ? '👥 Large' : '👤 Medium'} event</div>
                    </div>
                    <Badge type={ev.status === 'Confirmed' ? 'green' : 'orange'}>{ev.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Menu Items</div>
                    <div className="flex flex-wrap gap-1.5">
                      {ev.menu.map((m) => (
                        <Badge key={m} type="blue">{m}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">⚠️ Dietary Requirements</div>
                    {ev.dietary.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {ev.dietary.map((d) => (
                          <Badge key={d} type="red">🚩 {d}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[12px] text-slate-500">None</span>
                    )}
                  </div>
                </div>

                {/* Setup timeline mini */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Prep Timeline</div>
                  <div className="flex gap-2">
                    {['T-7d Planning', 'T-3d Prep', 'T-1d Setup', 'T-6h Final', 'Event Day'].map((step, i) => (
                      <div key={step} className="flex-1 text-center">
                        <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-[11px] ${
                          i < 2 ? 'bg-emerald-500 text-white' : 'bg-surface2 border border-border2 text-slate-500'
                        }`}>{i < 2 ? '✓' : '○'}</div>
                        <div className="text-[9px] text-slate-500 leading-tight">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'checklist' && (
        <div className="grid grid-cols-2 gap-5">
          <div>
            <SectionHead title="Today's Prep — Auto Generated" />
            <Alert type="blue" icon="🤖">
              Auto-generated from confirmed menus. {doneCount}/{prepChecklist.length} completed.
            </Alert>
            <div className="mb-3">
              <div className="flex items-center justify-between text-[12px] text-slate-500 mb-1.5">
                <span>Progress</span>
                <span>{doneCount}/{prepChecklist.length}</span>
              </div>
              <ProgressBar value={(doneCount / prepChecklist.length) * 100} color="#22c55e" />
            </div>
            <div className="space-y-1.5">
              {prepChecklist.map((c) => (
                <div
                  key={c.id}
                  className={`check-item ${c.done ? 'done' : ''}`}
                  onClick={() => toggleChecklistItem(c.id)}
                >
                  <div className={`check-box ${c.done ? 'checked' : ''}`}>
                    {c.done && <span className="text-[9px]">✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className={`text-[12px] ${c.done ? 'line-through text-slate-600' : 'text-slate-300'}`}>{c.item}</div>
                    <div className="text-[10px] text-slate-600">{c.event} • {c.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHead title="Ingredient Summary Today" />
            <div className="card p-4">
              <div className="text-[12px] text-slate-500 mb-3">Auto-calculated from all confirmed events:</div>
              {[
                ['Basmati Rice', '85 kg'], ['Chicken', '35 kg'], ['Paneer', '28 kg'],
                ['Wheat Flour', '40 kg'], ['Cooking Oil', '15 L'], ['Vegetables', '60 kg'],
                ['Dahi (Curd)', '20 L'], ['Ghee', '8 kg'],
              ].map(([item, qty]) => (
                <div key={item} className="flex justify-between py-2 border-b border-border last:border-0">
                  <span className="text-[13px] text-slate-300">{item}</span>
                  <span className="text-[13px] font-bold text-amber-400">{qty}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <SectionHead title="Menu Finalization Queue" />
              <div className="space-y-2">
                {events.filter(e => e.status === 'Tentative').map((ev) => (
                  <div key={ev.id} className="card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-medium text-slate-200">{ev.name}</div>
                        <div className="text-[11px] text-slate-500">{ev.date} • {ev.guests} guests</div>
                      </div>
                      <button className="btn btn-primary btn-sm">Finalize Menu</button>
                    </div>
                  </div>
                ))}
                {events.filter(e => e.status === 'Tentative').length === 0 && (
                  <div className="text-[12px] text-slate-500 p-3">All menus finalized ✅</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'feedback' && (
        <div>
          <SectionHead title="Dish Quality History" />
          <div className="card p-5">
            <table className="tbl">
              <thead>
                <tr>
                  {['Dish', 'Events Served', 'Avg Rating', 'Complaints', 'Praise', 'Status'].map((h) => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {dishFeedback.map((r) => (
                  <tr key={r.dish}>
                    <td className="font-medium text-slate-200">{r.dish}</td>
                    <td>{r.events}</td>
                    <td>
                      <span className="font-bold" style={{ color: r.rating >= 4.5 ? '#22c55e' : r.rating >= 4 ? '#f97316' : '#ef4444' }}>
                        ★ {r.rating}
                      </span>
                    </td>
                    <td style={{ color: r.complaints > 6 ? '#ef4444' : '#94a3b8' }}>{r.complaints}</td>
                    <td className="text-emerald-400">{r.praise}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <SectionHead title="Log Post-Event Feedback" />
            <div className="card p-5">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider">Event</label>
                  <select className="input">
                    {events.map(e => <option key={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider">Dish</label>
                  <input className="input" placeholder="Dish name" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider">Rating</label>
                  <select className="input">
                    {[5, 4, 3, 2, 1].map((r) => <option key={r}>{r} ★</option>)}
                  </select>
                </div>
              </div>
              <textarea className="input mb-3" rows={3} placeholder="Feedback notes — complaints, praise, portions, quality issues..." />
              <button className="btn btn-primary" onClick={() => alert('Feedback logged!')}>📝 Log Feedback</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
