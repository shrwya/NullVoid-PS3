import React, { useState } from 'react'
import { Alert, Badge, SectionHead, ProgressBar, Tabs } from '../../components/ui'
import { useStore } from '../../store/useStore'

/* ── Design tokens ─────────────────────────────────────────────── */
const T = {
  bg:'#fdfaf6', bgCard:'linear-gradient(145deg,#ffffff 0%,#fdfaf6 100%)',
  border:'#e8d5be', borderLight:'#f0e4d0',
  text:'#3A2518', textMid:'#8B6B52', textSoft:'#a08060', textFaint:'#c0a888',
  gold:'#c9974a', goldLight:'rgba(201,151,74,0.1)', goldBorder:'rgba(201,151,74,0.28)',
  brown:'#6B4F3B', brownLight:'rgba(107,79,59,0.1)',
  shadow:'0 2px 12px rgba(107,79,59,0.08),0 1px 3px rgba(107,79,59,0.04)',
  shadowMd:'0 6px 24px rgba(107,79,59,0.12)',
  radius:16, radiusSm:10,
}

const card = {
  background:T.bgCard, border:`1px solid ${T.border}`,
  borderRadius:T.radius, boxShadow:T.shadow, overflow:'hidden',
}

function CardHeader({ title, sub }) {
  return (
    <div style={{ padding:'14px 20px', borderBottom:`1px solid ${T.borderLight}`,
      background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)' }}>
      <div style={{ fontSize:14,fontWeight:700,color:T.text,fontFamily:'Cormorant Garamond,serif' }}>{title}</div>
      {sub && <div style={{ fontSize:11,color:T.textSoft,marginTop:2 }}>{sub}</div>}
    </div>
  )
}

const BADGE_MAP = {
  green:  { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0' },
  orange: { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
  blue:   { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
  red:    { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
  gray:   { bg:'#f5ede0', color:'#8B6B52', border:'#e8d5be' },
}
function WBadge({ children, type='gray' }) {
  const s = BADGE_MAP[type]||BADGE_MAP.gray
  return <span style={{ fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:999,
    background:s.bg,color:s.color,border:`1px solid ${s.border}` }}>{children}</span>
}

const TH = { padding:'10px 16px',textAlign:'left',fontSize:10,textTransform:'uppercase',
  letterSpacing:'0.1em',fontWeight:600,color:T.textSoft,borderBottom:`1px solid ${T.borderLight}`,
  background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)' }
const TD = { padding:'11px 16px',fontSize:12,color:T.textMid,borderBottom:`1px solid ${T.borderLight}` }

/* ════════════════════════════════════════════════════════════════ */
export default function KitchenPortal() {
  const { events, prepChecklist, toggleChecklistItem } = useStore()
  const [tab, setTab] = useState('events')

  const tabs = [
    { id:'events',    icon:'📅', label:'14-Day Events' },
    { id:'checklist', icon:'✅', label:'Daily Prep'    },
    { id:'feedback',  icon:'⭐', label:'Dish Feedback' },
  ]

  const dishFeedback = [
    {dish:'Dal Makhani',          events:18, rating:4.7, complaints:1,  praise:14, status:'⭐ Top Performer'},
    {dish:'Paneer Butter Masala', events:22, rating:4.5, complaints:3,  praise:18, status:'✅ Good'},
    {dish:'Biryani',              events:31, rating:4.3, complaints:5,  praise:22, status:'✅ Good'},
    {dish:'Gulab Jamun',          events:28, rating:4.1, complaints:8,  praise:15, status:'⚠️ Watch'},
    {dish:'Chaat',                events:12, rating:3.8, complaints:10, praise:7,  status:'🚩 Review Recipe'},
  ]

  const doneCount = prepChecklist.filter(c=>c.done).length

  /* ── Timeline step ── */
  function TimelineStep({ label, done, index }) {
    return (
      <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flex:1 }}>
        <div style={{
          width:28,height:28,borderRadius:'50%',display:'flex',
          alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,
          marginBottom:6,
          background: done ? '#15803d' : T.brownLight,
          border: done ? '2px solid #15803d' : `2px solid ${T.border}`,
          color: done ? '#fff' : T.textSoft,
        }}>{done ? '✓' : index+1}</div>
        <div style={{ fontSize:9,color:T.textSoft,textAlign:'center',lineHeight:1.3 }}>{label}</div>
      </div>
    )
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16,fontFamily:'DM Sans,system-ui,sans-serif' }}>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* ══════════════ EVENTS ══════════════ */}
      {tab === 'events' && (
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          <Alert type="red" icon="⚠️">
            <strong>Stock alert:</strong> Paneer at Andheri is below minimum (18kg vs 20kg required). Sharma Wedding on Mar 15 needs 35kg. Raise PO now.
          </Alert>

          {events.map(ev => (
            <div key={ev.id} style={{ ...card }}>
              {/* Event header */}
              <div style={{
                padding:'16px 20px', borderBottom:`1px solid ${T.borderLight}`,
                background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)',
                display:'flex',alignItems:'flex-start',justifyContent:'space-between',
              }}>
                <div>
                  <div style={{ fontSize:15,fontWeight:700,color:T.text }}>{ev.name}</div>
                  <div style={{ fontSize:12,color:T.textSoft,marginTop:3 }}>
                    {ev.hall} · {ev.date} · {ev.branch}
                  </div>
                </div>
                <div style={{ display:'flex',alignItems:'center',gap:14 }}>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:26,fontWeight:700,color:T.text,
                      fontFamily:'Cormorant Garamond,serif',lineHeight:1 }}>{ev.guests}</div>
                    <div style={{ fontSize:10,color:T.textSoft }}>
                      {ev.guests>300?'👥 Large':'👤 Medium'} event
                    </div>
                  </div>
                  <WBadge type={ev.status==='Confirmed'?'green':'orange'}>{ev.status}</WBadge>
                </div>
              </div>

              <div style={{ padding:'16px 20px' }}>
                {/* Menu + dietary */}
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:18 }}>
                  <div>
                    <div style={{ fontSize:10,color:T.textSoft,textTransform:'uppercase',
                      letterSpacing:'0.1em',fontWeight:600,marginBottom:8 }}>Menu Items</div>
                    <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                      {ev.menu.map(m=>(
                        <span key={m} style={{ fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:999,
                          background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe' }}>{m}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:10,color:T.textSoft,textTransform:'uppercase',
                      letterSpacing:'0.1em',fontWeight:600,marginBottom:8 }}>⚠️ Dietary Requirements</div>
                    {ev.dietary.length>0 ? (
                      <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                        {ev.dietary.map(d=>(
                          <span key={d} style={{ fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:999,
                            background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca' }}>🚩 {d}</span>
                        ))}
                      </div>
                    ) : <span style={{ fontSize:12,color:T.textFaint }}>None</span>}
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ paddingTop:14,borderTop:`1px solid ${T.borderLight}` }}>
                  <div style={{ fontSize:10,color:T.textSoft,textTransform:'uppercase',
                    letterSpacing:'0.1em',fontWeight:600,marginBottom:14 }}>Prep Timeline</div>
                  <div style={{ display:'flex',alignItems:'flex-start',position:'relative' }}>
                    {['T-7d Planning','T-3d Prep','T-1d Setup','T-6h Final','Event Day'].map((step,i) => (
                      <React.Fragment key={step}>
                        <TimelineStep label={step} done={i<2} index={i} />
                        {i < 4 && (
                          <div style={{ flex:1, height:2, marginTop:13,
                            background: i<1 ? '#15803d' : T.borderLight }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════ CHECKLIST ══════════════ */}
      {tab === 'checklist' && (
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
          {/* Checklist */}
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.text,fontFamily:'Cormorant Garamond,serif' }}>
              Today's Prep — Auto Generated
            </div>
            <Alert type="blue" icon="🤖">
              Auto-generated from confirmed menus. {doneCount}/{prepChecklist.length} completed.
            </Alert>

            {/* Progress */}
            <div style={{ ...card, padding:'14px 18px' }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                <span style={{ fontSize:12,color:T.textSoft }}>Progress</span>
                <span style={{ fontSize:12,fontWeight:700,color:T.textMid }}>{doneCount}/{prepChecklist.length}</span>
              </div>
              <div style={{ height:8,borderRadius:999,background:T.brownLight,overflow:'hidden' }}>
                <div style={{
                  height:'100%',borderRadius:999,transition:'width 0.5s ease',
                  background:'linear-gradient(90deg,#6B4F3B,#c9974a)',
                  width:`${(doneCount/prepChecklist.length)*100}%`,
                }} />
              </div>
            </div>

            {/* Items */}
            <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
              {prepChecklist.map(c => (
                <div key={c.id} onClick={()=>toggleChecklistItem(c.id)} style={{
                  display:'flex',alignItems:'center',gap:12,
                  padding:'12px 16px',borderRadius:T.radiusSm,cursor:'pointer',
                  background: c.done ? '#f0fdf4' : '#ffffff',
                  border:`1px solid ${c.done?'#bbf7d0':T.border}`,
                  boxShadow:T.shadow, transition:'all 0.15s',
                }}>
                  <div style={{
                    width:20,height:20,borderRadius:'50%',flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:10,fontWeight:700,
                    background: c.done ? '#15803d' : T.brownLight,
                    border: c.done ? '2px solid #15803d' : `2px solid ${T.border}`,
                    color: c.done ? '#fff' : T.textSoft,
                    transition:'all 0.15s',
                  }}>{c.done ? '✓' : ''}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12,color:c.done?T.textFaint:T.text,
                      textDecoration:c.done?'line-through':'none' }}>{c.item}</div>
                    <div style={{ fontSize:10,color:T.textFaint,marginTop:2 }}>{c.event} · {c.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredient summary + queue */}
          <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
            <div style={card}>
              <CardHeader title="Ingredient Summary Today" sub="Auto-calculated from all confirmed events" />
              <div style={{ padding:'0 8px' }}>
                {[
                  ['Basmati Rice','85 kg'],['Chicken','35 kg'],['Paneer','28 kg'],
                  ['Wheat Flour','40 kg'],['Cooking Oil','15 L'],['Vegetables','60 kg'],
                  ['Dahi (Curd)','20 L'],['Ghee','8 kg'],
                ].map(([item,qty],i,arr) => (
                  <div key={item} style={{
                    display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'11px 14px',
                    borderBottom: i<arr.length-1 ? `1px solid ${T.borderLight}` : 'none',
                  }}>
                    <span style={{ fontSize:13,color:T.text }}>{item}</span>
                    <span style={{ fontSize:13,fontWeight:700,color:T.gold }}>{qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Finalization queue */}
            <div>
              <div style={{ fontSize:14,fontWeight:700,color:T.text,
                fontFamily:'Cormorant Garamond,serif',marginBottom:10 }}>Menu Finalization Queue</div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {events.filter(e=>e.status==='Tentative').map(ev=>(
                  <div key={ev.id} style={{ ...card, padding:'14px 18px' }}>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontSize:13,fontWeight:600,color:T.text }}>{ev.name}</div>
                        <div style={{ fontSize:11,color:T.textSoft,marginTop:2 }}>
                          {ev.date} · {ev.guests} guests
                        </div>
                      </div>
                      <button className="btn btn-primary btn-sm">Finalize Menu</button>
                    </div>
                  </div>
                ))}
                {events.filter(e=>e.status==='Tentative').length===0 && (
                  <div style={{ fontSize:12,color:T.textFaint,padding:'12px 4px' }}>
                    All menus finalized ✅
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ FEEDBACK ══════════════ */}
      {tab === 'feedback' && (
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          <div style={card}>
            <CardHeader title="Dish Quality History" />
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr>
                  {['Dish','Events Served','Avg Rating','Complaints','Praise','Status'].map(h=>(
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {dishFeedback.map(r => (
                    <tr key={r.dish}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.15s'}}>
                      <td style={{...TD,fontWeight:600,color:T.text}}>{r.dish}</td>
                      <td style={TD}>{r.events}</td>
                      <td style={TD}>
                        <span style={{ fontWeight:700, color:r.rating>=4.5?'#15803d':r.rating>=4?'#c2410c':'#dc2626' }}>
                          ★ {r.rating}
                        </span>
                      </td>
                      <td style={{...TD,color:r.complaints>6?'#dc2626':T.textSoft}}>{r.complaints}</td>
                      <td style={{...TD,color:'#15803d',fontWeight:500}}>{r.praise}</td>
                      <td style={TD}>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Log feedback form */}
          <div style={card}>
            <CardHeader title="Log Post-Event Feedback" />
            <div style={{ padding:'18px 20px' }}>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:14 }}>
                {[
                  { label:'Event', el: (
                    <select className="input">
                      {events.map(e=><option key={e.id}>{e.name}</option>)}
                    </select>
                  )},
                  { label:'Dish', el: <input className="input" placeholder="Dish name" /> },
                  { label:'Rating', el: (
                    <select className="input">
                      {[5,4,3,2,1].map(r=><option key={r}>{r} ★</option>)}
                    </select>
                  )},
                ].map(({label,el}) => (
                  <div key={label}>
                    <label style={{ display:'block',fontSize:10,color:T.textSoft,
                      textTransform:'uppercase',letterSpacing:'0.1em',
                      fontWeight:600,marginBottom:6 }}>{label}</label>
                    {el}
                  </div>
                ))}
              </div>
              <textarea className="input" rows={3} style={{ marginBottom:14,width:'100%',boxSizing:'border-box' }}
                placeholder="Feedback notes — complaints, praise, portions, quality issues…" />
              <button onClick={()=>alert('Feedback logged!')} className="btn btn-primary">
                📝 Log Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
