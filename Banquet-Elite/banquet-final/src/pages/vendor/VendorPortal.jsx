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
  radius:16, radiusSm:10,
}

const card = {
  background:T.bgCard, border:`1px solid ${T.border}`,
  borderRadius:T.radius, boxShadow:T.shadow, overflow:'hidden',
}

function CardHeader({ title, action }) {
  return (
    <div style={{ padding:'14px 20px', borderBottom:`1px solid ${T.borderLight}`,
      background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)',
      display:'flex',alignItems:'center',justifyContent:'space-between' }}>
      <div style={{ fontSize:14,fontWeight:700,color:T.text,fontFamily:'Cormorant Garamond,serif' }}>{title}</div>
      {action}
    </div>
  )
}

const BADGE_MAP = {
  green:  { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0' },
  orange: { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
  blue:   { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
  red:    { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
  gray:   { bg:'#f5ede0', color:'#8B6B52', border:'#e8d5be' },
  purple: { bg:'#faf5ff', color:'#7c3aed', border:'#e9d5ff' },
}
function WBadge({ children, type='gray' }) {
  const s = BADGE_MAP[type]||BADGE_MAP.gray
  return <span style={{ fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:999,
    background:s.bg,color:s.color,border:`1px solid ${s.border}` }}>{children}</span>
}

function WarmBar({ value, color }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:7 }}>
      <div style={{ height:5,borderRadius:999,background:T.brownLight,overflow:'hidden',minWidth:52,flex:1 }}>
        <div style={{ height:'100%',borderRadius:999,width:`${Math.min(100,value)}%`,
          background:color||T.gold,transition:'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize:11,fontWeight:600,color:T.textMid,minWidth:32 }}>{value}%</span>
    </div>
  )
}

function StatCard({ label, value, icon, sub }) {
  return (
    <div style={{
      background:T.bgCard, border:`1px solid ${T.border}`,
      borderRadius:T.radius, padding:'16px 18px', boxShadow:T.shadow,
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,
        background:'linear-gradient(90deg,transparent,rgba(201,151,74,0.5),transparent)' }} />
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8 }}>
        <span style={{ fontSize:9,color:T.textSoft,textTransform:'uppercase',
          letterSpacing:'0.14em',fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:18,opacity:0.7 }}>{icon}</span>
      </div>
      <div style={{ fontSize:24,fontWeight:700,color:T.text,
        fontFamily:'Cormorant Garamond,Georgia,serif',lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11,color:T.textSoft,marginTop:4 }}>{sub}</div>}
    </div>
  )
}

const TH = { padding:'10px 16px',textAlign:'left',fontSize:10,textTransform:'uppercase',
  letterSpacing:'0.1em',fontWeight:600,color:T.textSoft,borderBottom:`1px solid ${T.borderLight}`,
  background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)' }
const TD = { padding:'11px 16px',fontSize:12,color:T.textMid,borderBottom:`1px solid ${T.borderLight}` }

/* ════════════════════════════════════════════════════════════════ */
export default function VendorPortal() {
  const { vendors } = useStore()
  const [tab, setTab] = useState('vendors')

  const tabs = [
    { id:'vendors',  icon:'🤝', label:'Vendors'          },
    { id:'pos',      icon:'📋', label:'Purchase Orders'   },
    { id:'invoices', icon:'🧾', label:'Invoice Approval', badge:2 },
  ]

  const pos = [
    {po:'PO-2026-034',vendor:'Patel Decorators', event:'Sharma Wedding',amount:45000,status:'Approved',due:'2026-03-12'},
    {po:'PO-2026-033',vendor:'Flash Photography',event:'Sharma Wedding',amount:35000,status:'Paid',    due:'2026-03-15'},
    {po:'PO-2026-032',vendor:'SecureForce',       event:'TCS Annual',   amount:18000,status:'Pending', due:'2026-03-17'},
  ]

  const vendorInvoices = [
    {inv:'VI-2026-018',vendor:'Patel Decorators',event:'Patel Engagement',amount:22000,date:'2026-02-28',status:'Pending'},
    {inv:'VI-2026-017',vendor:'Sound Arena',      event:'TCS Annual',      amount:12000,date:'2026-02-25',status:'Approved'},
  ]

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16,fontFamily:'DM Sans,system-ui,sans-serif' }}>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* ══════════════ VENDORS ══════════════ */}
      {tab === 'vendors' && (
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12 }}>
            <StatCard label="Active Vendors"  value={vendors.filter(v=>v.status==='Active').length} icon="🤝" />
            <StatCard label="Total Pending"   value="₹87K" icon="⏳" sub="Across all vendors" />
            <StatCard label="Avg Rating"      value="4.5★" icon="⭐" />
            <StatCard label="Events Covered"  value="131"  icon="📅" />
          </div>

          <div style={card}>
            <CardHeader title="Vendor Directory" action={
              <button onClick={()=>alert('Onboard form')} style={{
                display:'inline-flex',alignItems:'center',gap:6,
                padding:'8px 16px',borderRadius:10,fontSize:12,fontWeight:600,
                background:'linear-gradient(135deg,#6B4F3B,#8B6B52)',
                color:'#fff',border:'none',cursor:'pointer',
                boxShadow:'0 4px 12px rgba(107,79,59,0.28)',transition:'all 0.18s',
              }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                + Onboard Vendor
              </button>
            } />
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr>
                  {['Vendor','Category','Rating','Events','Pending','On-Time','Quality','Status','Actions'].map(h=>(
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.15s'}}>
                      <td style={{...TD,fontWeight:700,color:T.text}}>{v.name}</td>
                      <td style={TD}><WBadge type="purple">{v.category}</WBadge></td>
                      <td style={{...TD,fontWeight:700,color:T.gold}}>★ {v.rating}</td>
                      <td style={TD}>{v.events}</td>
                      <td style={{...TD,color:v.pending>0?'#c2410c':T.textFaint,fontWeight:v.pending>0?600:400}}>
                        {v.pending>0?'₹'+v.pending.toLocaleString('en-IN'):'—'}
                      </td>
                      <td style={{...TD,minWidth:130}}>
                        <WarmBar value={v.ontime} color={v.ontime>85?'#15803d':'#c2410c'} />
                      </td>
                      <td style={TD}>
                        <span style={{ fontWeight:700,fontSize:13,
                          color:v.quality>85?'#15803d':'#c2410c' }}>{v.quality}%</span>
                      </td>
                      <td style={TD}>
                        <WBadge type={v.status==='Active'?'green':'gray'}>{v.status}</WBadge>
                      </td>
                      <td style={TD}>
                        <div style={{ display:'flex',gap:6 }}>
                          <button className="btn btn-primary btn-xs"
                            onClick={()=>alert('PO generated for '+v.name)}>📋 PO</button>
                          {v.pending>0 && (
                            <button style={{
                              fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:7,
                              background:'rgba(194,65,12,0.08)',color:'#c2410c',
                              border:'1px solid rgba(194,65,12,0.2)',cursor:'pointer',
                            }}
                            onClick={()=>alert('Payment processing for '+v.name)}>💳</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ PURCHASE ORDERS ══════════════ */}
      {tab === 'pos' && (
        <div style={card}>
          <CardHeader title="Purchase Orders" action={
            <button onClick={()=>{}} style={{
              display:'inline-flex',alignItems:'center',gap:6,
              padding:'8px 16px',borderRadius:10,fontSize:12,fontWeight:600,
              background:'linear-gradient(135deg,#6B4F3B,#8B6B52)',
              color:'#fff',border:'none',cursor:'pointer',
              boxShadow:'0 4px 12px rgba(107,79,59,0.28)',
            }}>+ New PO</button>
          } />
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%',borderCollapse:'collapse' }}>
              <thead><tr>
                {['PO #','Vendor','Event','Amount','Status','Due Date','Action'].map(h=>(
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {pos.map((p,i) => (
                  <tr key={i}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                    style={{transition:'background 0.15s'}}>
                    <td style={{...TD,color:T.brown,fontWeight:600}}>{p.po}</td>
                    <td style={{...TD,color:T.text,fontWeight:500}}>{p.vendor}</td>
                    <td style={TD}>{p.event}</td>
                    <td style={{...TD,fontWeight:600,color:T.text}}>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td style={TD}>
                      <WBadge type={p.status==='Paid'?'green':p.status==='Approved'?'blue':'orange'}>
                        {p.status}
                      </WBadge>
                    </td>
                    <td style={TD}>{p.due}</td>
                    <td style={TD}>
                      {p.status !== 'Paid' && (
                        <button onClick={()=>alert('Marking as paid')} style={{
                          fontSize:11,fontWeight:600,padding:'5px 12px',borderRadius:8,
                          background:T.brownLight,color:T.textMid,
                          border:`1px solid ${T.border}`,cursor:'pointer',
                          transition:'all 0.15s',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.15)'}
                        onMouseLeave={e=>e.currentTarget.style.background=T.brownLight}>
                          ✅ Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ INVOICE APPROVAL ══════════════ */}
      {tab === 'invoices' && (
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          <Alert type="gold" icon="🧾">
            2 vendor invoices pending approval. Review and approve to process payment.
          </Alert>
          <div style={card}>
            <CardHeader title="Vendor Invoice Approval Queue" />
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr>
                  {['Invoice','Vendor','Event','Amount','Submitted','Status','Actions'].map(h=>(
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {vendorInvoices.map((inv,i) => (
                    <tr key={i}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.15s'}}>
                      <td style={{...TD,color:T.brown,fontWeight:600}}>{inv.inv}</td>
                      <td style={{...TD,color:T.text,fontWeight:500}}>{inv.vendor}</td>
                      <td style={TD}>{inv.event}</td>
                      <td style={{...TD,fontWeight:700,color:T.text}}>₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td style={TD}>{inv.date}</td>
                      <td style={TD}>
                        <WBadge type={inv.status==='Approved'?'green':'orange'}>{inv.status}</WBadge>
                      </td>
                      <td style={TD}>
                        {inv.status === 'Pending' && (
                          <div style={{ display:'flex',gap:6 }}>
                            <button onClick={()=>alert('Invoice approved!')} style={{
                              fontSize:11,fontWeight:700,padding:'5px 12px',borderRadius:8,
                              background:'#f0fdf4',color:'#15803d',
                              border:'1px solid #bbf7d0',cursor:'pointer',
                              transition:'all 0.15s',
                            }}
                            onMouseEnter={e=>e.currentTarget.style.background='#dcfce7'}
                            onMouseLeave={e=>e.currentTarget.style.background='#f0fdf4'}>
                              ✅ Approve
                            </button>
                            <button onClick={()=>alert('Invoice rejected!')} style={{
                              fontSize:11,fontWeight:700,padding:'5px 12px',borderRadius:8,
                              background:'#fef2f2',color:'#dc2626',
                              border:'1px solid #fecaca',cursor:'pointer',
                              transition:'all 0.15s',
                            }}
                            onMouseEnter={e=>e.currentTarget.style.background='#fee2e2'}
                            onMouseLeave={e=>e.currentTarget.style.background='#fef2f2'}>
                              ❌ Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
