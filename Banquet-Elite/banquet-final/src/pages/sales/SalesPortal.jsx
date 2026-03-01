import React, { useState, useEffect } from "react";
import {
  Badge, SectionHead, ScoreChip, Tabs, Modal, Field,
} from "../../components/ui";
import { PIPELINE_STAGES } from "../../store/useStore";

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS — warm luxury palette
═══════════════════════════════════════════════════════════════════ */
const T = {
  bg:         '#fdfaf6',
  bgCard:     'linear-gradient(145deg,#ffffff 0%,#fdfaf6 100%)',
  border:     '#e8d5be',
  borderLight:'#f0e4d0',
  text:       '#3A2518',
  textMid:    '#8B6B52',
  textSoft:   '#a08060',
  textFaint:  '#c0a888',
  gold:       '#c9974a',
  goldLight:  'rgba(201,151,74,0.1)',
  goldBorder: 'rgba(201,151,74,0.28)',
  brown:      '#6B4F3B',
  brownLight: 'rgba(107,79,59,0.1)',
  shadow:     '0 2px 12px rgba(107,79,59,0.08),0 1px 3px rgba(107,79,59,0.04)',
  shadowMd:   '0 6px 24px rgba(107,79,59,0.12)',
  radius:     16,
  radiusSm:   10,
}

/* ── Stage colour map ──────────────────────────────────────────── */
const STAGE_MAP = {
  "New":            { bg:'#f5ede0', border:'#e8d5be', dot:'#c0a888',  label:'#8B6B52'  },
"Called": {
  bg:'#f5ede0',
  border:'#e8d5be',
  dot:'#8B6B52',
  label:'#6B4F3B'
},
  "Site Visit":     { bg:'#f0fdf4', border:'#bbf7d0', dot:'#22c55e',  label:'#15803d'  },
  "Food Tasting":   { bg:'#fffbeb', border:'#fde68a', dot:'#f59e0b',  label:'#b45309'  },
  "Advance Paid":   { bg:'#faf5ff', border:'#e9d5ff', dot:'#a855f7',  label:'#7c3aed'  },
  "Menu Finalized": { bg:'#fff7ed', border:'#fed7aa', dot:'#f97316',  label:'#c2410c'  },
  "Event Day":      { bg:'#fdf2f8', border:'#f5d0fe', dot:'#d946ef',  label:'#a21caf'  },
  "Settlement":     { bg:'#f0fdfa', border:'#99f6e4', dot:'#14b8a6',  label:'#0f766e'  },
  "Settled":        { bg:'#f0fdfa', border:'#99f6e4', dot:'#14b8a6',  label:'#0f766e'  },
"Feedback": {
  bg:'#faf5ff', // soft lavender OR use beige again
  border:'#e8d5be',
  dot:'#c9974a',
  label:'#8B6B52'
},  "Converted":      { bg:'#f0fdf4', border:'#bbf7d0', dot:'#16a34a',  label:'#15803d'  },
  "Lost":           { bg:'#fef2f2', border:'#fecaca', dot:'#ef4444',  label:'#dc2626'  },
}
const sc = (stage) => STAGE_MAP[stage] || STAGE_MAP['New']

/* ── AI scoring (unchanged) ───────────────────────────────────── */
function calculateLeadScore(lead) {
  let score = 0
  const budget = Number(lead.budget || 0)
  const guests = Number(lead.guests || 0)
  if (budget > 1000000) score += 40
  else if (budget > 500000) score += 30
  else if (budget > 200000) score += 20
  if (guests > 500) score += 25
  else if (guests > 200) score += 15
  if (lead.event === 'Wedding')   score += 20
  if (lead.event === 'Corporate') score += 10
  score += (lead.menu?.length || 0) * 2
  if (lead.stage === 'New') score += 10
  return score
}

const DISH_OPTIONS = [
  "Paneer Butter Masala","Dal Makhani","Veg Biryani","Chicken Biryani",
  "Butter Naan","Tandoori Roti","Hakka Noodles","Manchurian",
  "Gulab Jamun","Ice Cream",
]

/* ── Small components ─────────────────────────────────────────── */
function ScoreBar({ score }) {
  const color = score >= 80 ? '#15803d' : score >= 50 ? '#b45309' : '#8B6B52'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:5, borderRadius:999,
        background:'rgba(107,79,59,0.1)', overflow:'hidden', minWidth:56 }}>
        <div style={{
          height:'100%', borderRadius:999,
          width:`${Math.min(100,score)}%`,
          background:`linear-gradient(90deg,${color},${color}cc)`,
          transition:'width 0.5s ease',
        }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, minWidth:28, color }}>{score}</span>
    </div>
  )
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div style={{
      background:T.bgCard, border:`1px solid ${T.border}`,
      borderRadius:T.radius, padding:'16px 18px',
      boxShadow:T.shadow, position:'relative', overflow:'hidden',
    }}>
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:3,
        background:`linear-gradient(90deg,transparent,${accent}77,transparent)`,
      }} />
      <div style={{ display:'flex', alignItems:'flex-start',
        justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontSize:9, color:T.textSoft, textTransform:'uppercase',
          letterSpacing:'0.14em', fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:18, opacity:0.7 }}>{icon}</span>
      </div>
      <div style={{ fontSize:26, fontWeight:700, color:T.text,
        fontFamily:'Cormorant Garamond,Georgia,serif', lineHeight:1 }}>{value}</div>
    </div>
  )
}

/* ── Pipeline card ────────────────────────────────────────────── */
function LeadCard({ lead, onClick }) {
  const score = calculateLeadScore(lead)
  const s = sc(lead.stage)
  return (
    <div
      onClick={onClick}
      style={{
        background:'#ffffff', border:`1px solid ${T.border}`,
        borderLeft:`3px solid ${s.dot}`,
        borderRadius:T.radiusSm, padding:'12px 14px',
        marginBottom:8, cursor:'pointer',
        boxShadow:'0 1px 4px rgba(107,79,59,0.06)',
        transition:'all 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=T.shadowMd }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(107,79,59,0.06)' }}
    >
      <div style={{ display:'flex', alignItems:'flex-start',
        justifyContent:'space-between', gap:6, marginBottom:5 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.text, lineHeight:1.3 }}>
          {lead.name}
        </div>
        {lead.event && (
          <span style={{
            fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:999,
            background:s.bg, color:s.label, border:`1px solid ${s.border}`,
            flexShrink:0,
          }}>{lead.event}</span>
        )}
      </div>
      <div style={{ fontSize:11, color:T.textMid, marginBottom:7 }}>{lead.contact}</div>
      <div style={{ display:'flex', gap:6, marginBottom:8, flexWrap:'wrap' }}>
        {lead.guests && (
          <span style={{ fontSize:10, color:T.textSoft, background:'#f5ede0',
            padding:'2px 8px', borderRadius:999, fontWeight:500 }}>👥 {lead.guests}</span>
        )}
        {lead.budget && (
          <span style={{ fontSize:10, color:T.textSoft, background:'#f5ede0',
            padding:'2px 8px', borderRadius:999, fontWeight:500 }}>
            ₹{Number(lead.budget).toLocaleString('en-IN')}
          </span>
        )}
        {lead.eventFrom && (
          <span style={{ fontSize:10, color:T.textSoft, background:'#f5ede0',
            padding:'2px 8px', borderRadius:999, fontWeight:500 }}>📅 {lead.eventFrom}</span>
        )}
      </div>
      <ScoreBar score={score} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── */

export default function SalesPortal() {
  const emptyLead = {
    name:'', contact:'', phone:'', event:'Wedding',
    guests:'', budget:'', branch:'Andheri', stage:'New',
    eventFrom:'', eventTo:'', menu:[],
  }

  const [leads, setLeads]             = useState([])
  const [tab, setTab]                 = useState('pipeline')
  const [selectedLead, setSelectedLead] = useState(null)
  const [customer, setCustomer]       = useState(emptyLead)

  async function updateStage(newStage) {
  if (!selectedLead) return

  try {
    await fetch(`http://127.0.0.1:8000/leads/${selectedLead._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...selectedLead, stage: newStage }),
    })

    setSelectedLead({ ...selectedLead, stage: newStage })
    fetchLeads()
  } catch (err) {
    console.log("Error updating stage", err)
  }
}

  /* ── fetch (unchanged) ── */
  async function fetchLeads() {
    try {
      const res  = await fetch("http://127.0.0.1:8000/leads")
      const data = await res.json()
      setLeads(data)
    } catch (err) { console.log("Backend not reachable", err) }
  }
  useEffect(() => { fetchLeads() }, [])

  /* ── add customer (unchanged) ── */
  async function addCustomer() {
    try {
      await fetch("http://127.0.0.1:8000/leads", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify(customer),
      })
      setCustomer(emptyLead)
      fetchLeads()
      alert("Customer Added!")
    } catch { alert("Error adding customer") }
  }

  /* ── pipeline grouped ── */
  const byStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = leads.filter(l => l.stage === stage)
    return acc
  }, {})

  /* ── stats ── */
  const totalLeads    = leads.length
  const hotLeads      = leads.filter(l => calculateLeadScore(l) >= 80).length
  const pipelineValue = leads.reduce((s,l) => s+Number(l.budget||0), 0)
  const avgScore      = totalLeads
    ? Math.round(leads.reduce((s,l) => s+calculateLeadScore(l), 0) / totalLeads) : 0

  const tabs = [
    { id:'pipeline', icon:'📋', label:'Pipeline'     },
    { id:'scoring',  icon:'🤖', label:'AI Scoring'   },
    { id:'users',    icon:'➕', label:'Add Lead'      },
  ]

  /* ── shared card style ── */
  const card = {
    background:T.bgCard, border:`1px solid ${T.border}`,
    borderRadius:T.radius, boxShadow:T.shadow, overflow:'hidden',
  }
  const TH = {
    padding:'10px 16px', textAlign:'left', fontSize:10,
    textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600,
    color:T.textSoft, borderBottom:`1px solid ${T.borderLight}`,
    background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)',
  }
  const TD = {
    padding:'11px 16px', fontSize:12, color:T.textMid,
    borderBottom:`1px solid ${T.borderLight}`,
  }

  /* ──────────────────────────────────────────────────────────── */
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16,
      fontFamily:'DM Sans,system-ui,sans-serif' }}>

      {/* ── Stat strip ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        <StatCard label="Total Leads"     value={totalLeads}                       icon="📋" accent="#6B4F3B" />
        <StatCard label="Hot Leads 🔥"    value={hotLeads}                         icon="🎯" accent="#c9974a" />
        <StatCard label="Pipeline Value"  value={`₹${(pipelineValue/100000).toFixed(1)}L`} icon="💰" accent="#c9974a" />
        <StatCard label="Avg AI Score"    value={avgScore}                         icon="🤖" accent="#8B6B52" />
      </div>

      {/* ── Tabs ── */}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* ══════════════ PIPELINE ══════════════ */}
      {tab === 'pipeline' && (
        <div style={{ overflowX:'auto', paddingBottom:12 }}>
          <div style={{ display:'flex', gap:10, minWidth:'max-content', paddingBottom:4 }}>
            {PIPELINE_STAGES.map(stage => {
              const s          = sc(stage)
              const stageLeads = byStage[stage] || []
              return (
                <div key={stage} style={{
                  width:210, flexShrink:0, borderRadius:T.radius,
                  background:`linear-gradient(180deg,${s.bg} 0%,#ffffff 100%)`,
                  border:`1px solid ${s.border}`, padding:'10px 10px 12px',
                }}>
                  {/* Column header */}
                  <div style={{ display:'flex', alignItems:'center',
                    justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ width:7, height:7, borderRadius:'50%',
                        background:s.dot, display:'inline-block', flexShrink:0 }} />
                      <span style={{ fontSize:10, textTransform:'uppercase',
                        letterSpacing:'0.1em', fontWeight:700, color:s.label }}>{stage}</span>
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, background:s.bg,
                      color:s.label, border:`1px solid ${s.border}`,
                      padding:'1px 7px', borderRadius:999 }}>{stageLeads.length}</span>
                  </div>
                  {/* Cards */}
                  {stageLeads.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'20px 8px',
                      fontSize:10, color:T.textFaint, fontStyle:'italic' }}>No leads</div>
                  ) : stageLeads.map(lead => (
                    <LeadCard key={lead._id} lead={lead} onClick={() => setSelectedLead(lead)} />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══════════════ ADD LEAD ══════════════ */}
      {tab === 'users' && (
        <div style={card}>
          {/* Header */}
          <div style={{
            padding:'16px 22px', borderBottom:`1px solid ${T.borderLight}`,
            background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)',
            display:'flex', alignItems:'center', gap:14,
          }}>
            <div style={{
              width:38, height:38, borderRadius:11, fontSize:17,
              display:'flex', alignItems:'center', justifyContent:'center',
              background:T.goldLight, border:`1.5px solid ${T.goldBorder}`,
            }}>➕</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:T.text,
                fontFamily:'Cormorant Garamond,serif' }}>Add Customer Lead</div>
              <div style={{ fontSize:11, color:T.textSoft, marginTop:2 }}>
                Fill in details to create a new lead
              </div>
            </div>
          </div>

          <div style={{ padding:'22px 22px 26px' }}>
            {/* Fields grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:20 }}>
              {[
                {label:'Name',       key:'name',      type:'text'  },
                {label:'Contact',    key:'contact',   type:'text'  },
                {label:'Phone',      key:'phone',     type:'text'  },
                {label:'Guests',     key:'guests',    type:'number'},
                {label:'Budget (₹)', key:'budget',    type:'number'},
                {label:'Event From', key:'eventFrom', type:'date'  },
                {label:'Event To',   key:'eventTo',   type:'date'  },
              ].map(({label,key,type}) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:10, color:T.textSoft,
                    textTransform:'uppercase', letterSpacing:'0.1em',
                    fontWeight:600, marginBottom:6 }}>{label}</label>
                  <input type={type} className="input" value={customer[key]}
                    onChange={e => setCustomer({...customer,[key]:e.target.value})} />
                </div>
              ))}
            </div>

            {/* Menu selection */}
            <div style={{ marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <span style={{ fontSize:10, color:T.textSoft, textTransform:'uppercase',
                  letterSpacing:'0.1em', fontWeight:600 }}>Menu Selection</span>
                <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999,
                  background:T.goldLight, color:'#b45309',
                  border:`1px solid ${T.goldBorder}` }}>
                  {(customer.menu||[]).length} selected
                </span>
              </div>
              <div style={{
                display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, padding:14,
                borderRadius:T.radiusSm,
                background:'rgba(107,79,59,0.03)', border:`1px solid ${T.borderLight}`,
              }}>
                {DISH_OPTIONS.map(dish => {
                  const checked = (customer.menu||[]).includes(dish)
                  return (
                    <label key={dish} style={{
                      display:'flex', alignItems:'center', gap:8,
                      padding:'8px 12px', borderRadius:8, cursor:'pointer',
                      transition:'all 0.15s',
                      background: checked ? T.goldLight : 'rgba(107,79,59,0.02)',
                      border:`1px solid ${checked ? T.goldBorder : T.borderLight}`,
                      color: checked ? '#b45309' : T.textSoft,
                      fontSize:12,
                    }}>
                      <input type="checkbox" checked={checked}
                        style={{ accentColor:'#c9974a', width:13, height:13, flexShrink:0 }}
                        onChange={e => {
                          if (e.target.checked) setCustomer({...customer, menu:[...customer.menu,dish]})
                          else setCustomer({...customer, menu:customer.menu.filter(d=>d!==dish)})
                        }} />
                      {dish}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <button onClick={addCustomer} style={{
                padding:'11px 28px', borderRadius:11, fontSize:14, fontWeight:600,
                fontFamily:'DM Sans,sans-serif',
                background:'linear-gradient(135deg,#6B4F3B 0%,#8B6B52 100%)',
                color:'#fff', border:'none', cursor:'pointer',
                boxShadow:'0 6px 20px rgba(107,79,59,0.35),inset 0 1px 0 rgba(255,255,255,0.15)',
                transition:'all 0.2s',
                display:'flex', alignItems:'center', gap:8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(107,79,59,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(107,79,59,0.35)' }}>
                Add Customer
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ AI SCORING ══════════════ */}
      {tab === 'scoring' && (
        <div style={card}>
          {/* Header */}
          <div style={{
            padding:'16px 22px', borderBottom:`1px solid ${T.borderLight}`,
            background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{
                width:38, height:38, borderRadius:11, fontSize:17,
                display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(107,79,59,0.08)', border:`1.5px solid rgba(107,79,59,0.2)`,
              }}>🤖</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:T.text,
                  fontFamily:'Cormorant Garamond,serif' }}>AI Lead Scoring Engine</div>
                <div style={{ fontSize:11, color:T.textSoft, marginTop:2 }}>
                  Ranked by conversion probability
                </div>
              </div>
            </div>
            <div style={{ fontSize:11, color:T.textFaint }}>{leads.length} leads</div>
          </div>

          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['#','Name','Event','Guests','Budget','Score','Priority'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...leads]
                  .map(l => ({...l, aiScore:calculateLeadScore(l)}))
                  .sort((a,b) => b.aiScore-a.aiScore)
                  .map((lead, idx) => {
                    const isHot  = lead.aiScore > 80
                    const isWarm = lead.aiScore > 50
                    return (
                      <tr key={lead._id}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                        style={{ transition:'background 0.15s' }}>
                        <td style={{...TD, color:T.textFaint, fontFamily:'monospace'}}>{idx+1}</td>
                        <td style={TD}>
                          <div style={{ fontWeight:700, color:T.text, fontSize:13 }}>{lead.name}</div>
                          <div style={{ fontSize:11, color:T.textFaint }}>{lead.contact}</div>
                        </td>
                        <td style={TD}>{lead.event}</td>
                        <td style={TD}>{lead.guests}</td>
                        <td style={TD}>₹{Number(lead.budget||0).toLocaleString('en-IN')}</td>
                        <td style={{...TD, minWidth:130}}><ScoreBar score={lead.aiScore} /></td>
                        <td style={TD}>
                          {isHot ? (
                            <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px',
                              borderRadius:999, background:'#f0fdf4', color:'#15803d',
                              border:'1px solid #bbf7d0' }}>🔥 Hot</span>
                          ) : isWarm ? (
                            <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px',
                              borderRadius:999, background:'#fffbeb', color:'#b45309',
                              border:'1px solid #fde68a' }}>⚡ Warm</span>
                          ) : (
                            <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px',
                              borderRadius:999, background:'#f5ede0', color:T.textMid,
                              border:`1px solid ${T.border}` }}>❄️ Cold</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
            {leads.length === 0 && (
              <div style={{ padding:'48px', textAlign:'center',
                color:T.textFaint, fontSize:13, fontStyle:'italic' }}>
                No leads yet — add one above
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ LEAD DETAIL MODAL ══════════════ */}
      <Modal open={!!selectedLead} onClose={() => setSelectedLead(null)}
        title={selectedLead?.name}>
        {selectedLead && (() => {
          const s = sc(selectedLead.stage)
          return (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {/* Stage badge */}
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:10, color:T.textSoft, textTransform:'uppercase',
                  letterSpacing:'0.08em' }}>Stage</span>
                <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999,
                  background:s.bg, color:s.label, border:`1px solid ${s.border}` }}>
                  <select
  value={selectedLead.stage}
  onChange={(e) => updateStage(e.target.value)}
  style={{
    fontSize: 11,
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 999,
    background: s.bg,
    color: s.label,
    border: `1px solid ${s.border}`,
    cursor: 'pointer'
  }}
>
  {PIPELINE_STAGES.map(stage => (
    <option key={stage} value={stage}>
      {stage}
    </option>
  ))}
</select>
                </span>
              </div>

              {/* AI Score */}
              <div>
                <div style={{ fontSize:10, color:T.textSoft, textTransform:'uppercase',
                  letterSpacing:'0.08em', marginBottom:8 }}>AI Score</div>
                <ScoreBar score={calculateLeadScore(selectedLead)} />
              </div>

              {/* Details grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  {label:'Event',   value:selectedLead.event    },
                  {label:'Guests',  value:selectedLead.guests   },
                  {label:'Budget',  value:selectedLead.budget ? `₹${Number(selectedLead.budget).toLocaleString('en-IN')}` : '—'},
                  {label:'Phone',   value:selectedLead.phone    },
                  {label:'Branch',  value:selectedLead.branch   },
                  {label:'From',    value:selectedLead.eventFrom},
                  {label:'To',      value:selectedLead.eventTo  },
                ].filter(({value}) => value).map(({label,value}) => (
                  <div key={label} style={{
                    padding:10, borderRadius:T.radiusSm,
                    background:'rgba(107,79,59,0.03)', border:`1px solid ${T.borderLight}`,
                  }}>
                    <div style={{ fontSize:9, color:T.textSoft, textTransform:'uppercase',
                      letterSpacing:'0.1em', marginBottom:3 }}>{label}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Menu */}
              {(selectedLead.menu||[]).length > 0 && (
                <div>
                  <div style={{ fontSize:10, color:T.textSoft, textTransform:'uppercase',
                    letterSpacing:'0.08em', marginBottom:8 }}>
                    Menu ({selectedLead.menu.length} dishes)
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {selectedLead.menu.map((dish,i) => (
                      <span key={i} style={{
                        fontSize:11, padding:'3px 10px', borderRadius:999,
                        background:T.goldLight, color:'#b45309',
                        border:`1px solid ${T.goldBorder}`,
                      }}>{dish}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
