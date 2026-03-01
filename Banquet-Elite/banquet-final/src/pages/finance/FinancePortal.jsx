import React, { useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Alert, Badge, SectionHead, Tabs, Modal } from '../../components/ui'
import { useStore, mockBranchHealth, mockFinanceData } from '../../store/useStore'

/* ── Design tokens ─────────────────────────────────────────────── */
const T = {
  bg:'#fdfaf6', bgCard:'linear-gradient(145deg,#ffffff 0%,#fdfaf6 100%)',
  border:'#e8d5be', borderLight:'#f0e4d0',
  text:'#3A2518', textMid:'#8B6B52', textSoft:'#a08060', textFaint:'#c0a888',
  gold:'#c9974a', goldLight:'rgba(201,151,74,0.1)', goldBorder:'rgba(201,151,74,0.28)',
  brown:'#6B4F3B', brownLight:'rgba(107,79,59,0.1)',
  shadow:'0 2px 12px rgba(107,79,59,0.08),0 1px 3px rgba(107,79,59,0.04)',
  shadowMd:'0 6px 24px rgba(107,79,59,0.12)',
  radius:16, radiusSm:10, radiusLg:20,
}

const TIP = {
  contentStyle:{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:8, fontSize:12, color:T.text },
}

const card = {
  background:T.bgCard, border:`1px solid ${T.border}`,
  borderRadius:T.radius, boxShadow:T.shadow, overflow:'hidden',
}

function CardHeader({ title, sub, action }) {
  return (
    <div style={{
      padding:'14px 20px', borderBottom:`1px solid ${T.borderLight}`,
      background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:T.text, fontFamily:'Cormorant Garamond,serif' }}>{title}</div>
        {sub && <div style={{ fontSize:11, color:T.textSoft, marginTop:2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  )
}

const BADGE = {
  green:  { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0' },
  orange: { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
  blue:   { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
  gray:   { bg:'#f5ede0', color:'#8B6B52', border:'#e8d5be' },
  red:    { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
}
function WBadge({ children, type='gray' }) {
  const s = BADGE[type]||BADGE.gray
  return <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:999,
    background:s.bg, color:s.color, border:`1px solid ${s.border}`, letterSpacing:'0.04em' }}>{children}</span>
}

function StatCard({ label, value, icon, sub, change, warn }) {
  return (
    <div style={{
      background: warn?'linear-gradient(145deg,#fef2f2,#fff5f5)':T.bgCard,
      border:`1px solid ${warn?'#fecaca':T.border}`,
      borderRadius:T.radius, padding:'16px 18px', boxShadow:T.shadow,
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,
        background:`linear-gradient(90deg,transparent,${warn?'rgba(220,38,38,0.5)':'rgba(201,151,74,0.5)'},transparent)` }} />
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8 }}>
        <span style={{ fontSize:9, color:warn?'#dc2626':T.textSoft, textTransform:'uppercase',
          letterSpacing:'0.14em', fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:18, opacity:0.7 }}>{icon}</span>
      </div>
      <div style={{ fontSize:24, fontWeight:700, color:warn?'#dc2626':T.text,
        fontFamily:'Cormorant Garamond,Georgia,serif', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:T.textSoft, marginTop:4 }}>{sub}</div>}
      {change && <div style={{ fontSize:11, color:'#15803d', marginTop:4, fontWeight:600 }}>↑ {change} vs last month</div>}
    </div>
  )
}

const TH = { padding:'10px 16px',textAlign:'left',fontSize:10,textTransform:'uppercase',
  letterSpacing:'0.1em',fontWeight:600,color:T.textSoft,borderBottom:`1px solid ${T.borderLight}`,
  background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)' }
const TD = { padding:'11px 16px',fontSize:12,color:T.textMid,borderBottom:`1px solid ${T.borderLight}` }

/* ════════════════════════════════════════════════════════════════ */
export default function FinancePortal() {
  const { invoices, damageReports } = useStore()
  const [tab, setTab] = useState('billing')
  const [selectedInv, setSelectedInv] = useState(null)

  const tabs = [
    { id:'billing',  icon:'🧾', label:'Billing & Invoices' },
    { id:'payments', icon:'💳', label:'Payments'           },
    { id:'reports',  icon:'📊', label:'Reports'            },
  ]

  const totalInvoiced = invoices.reduce((a,i) => a+i.total, 0)
  const collected     = invoices.filter(i=>i.status==='Paid').reduce((a,i)=>a+i.total,0)
  const outstanding   = totalInvoiced - collected

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16,fontFamily:'DM Sans,system-ui,sans-serif' }}>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* ══════════════ BILLING ══════════════ */}
      {tab === 'billing' && (
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          <Alert type="blue" icon="🔗">
            Damage deduction of ₹4,500 from Singh Birthday (Property Manager) auto-synced to settlement.
          </Alert>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            <StatCard label="Total Invoiced" value={`₹${(totalInvoiced/100000).toFixed(1)}L`} icon="🧾" change="+14%" />
            <StatCard label="Collected"      value={`₹${(collected/100000).toFixed(1)}L`}     icon="✅"
              sub={`${(collected/totalInvoiced*100).toFixed(0)}% collected`} />
            <StatCard label="Outstanding"    value={`₹${(outstanding/100000).toFixed(1)}L`}   icon="⏳" warn={outstanding>500000} />
            <StatCard label="GST Payable"    value="₹1.21L" icon="🏛" sub="This month" />
          </div>

          {/* Invoices table */}
          <div style={card}>
            <CardHeader title="Invoices" action={
              <button onClick={() => alert('Invoice builder')} style={{
                display:'inline-flex',alignItems:'center',gap:6,
                padding:'8px 16px',borderRadius:10,fontSize:12,fontWeight:600,
                background:'linear-gradient(135deg,#6B4F3B,#8B6B52)',
                color:'#fff',border:'none',cursor:'pointer',
                boxShadow:'0 4px 12px rgba(107,79,59,0.28)',transition:'all 0.18s',
              }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                + New Invoice
              </button>
            } />
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr>
                  {['Invoice #','Client','Base Amount','GST (18%)','Total','Status','Date','Actions'].map(h=>(
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.15s'}}>
                      <td style={{...TD,color:T.brown,fontWeight:600}}>{inv.id}</td>
                      <td style={{...TD,fontWeight:600,color:T.text}}>{inv.client}</td>
                      <td style={TD}>₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td style={{...TD,color:T.textFaint}}>₹{inv.gst.toLocaleString('en-IN')}</td>
                      <td style={{...TD,fontWeight:700,color:T.gold}}>₹{inv.total.toLocaleString('en-IN')}</td>
                      <td style={TD}>
                        <WBadge type={inv.status==='Paid'?'green':inv.status==='Partial'?'orange':'blue'}>
                          {inv.status}
                        </WBadge>
                      </td>
                      <td style={TD}>{inv.date}</td>
                      <td style={TD}>
                        <div style={{ display:'flex',gap:6 }}>
                          <button className="btn btn-ghost btn-xs" onClick={()=>setSelectedInv(inv)}>👁</button>
                          <button className="btn btn-ghost btn-xs" onClick={()=>alert('PDF downloaded')}>📥 PDF</button>
                          {inv.status !== 'Paid' && (
                            <button className="btn btn-primary btn-xs" onClick={()=>alert('Payment recorded')}>💳</button>
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
          <div style={card}>
            <CardHeader title="Post-Event Settlement Adjustments" />
            <div style={{ padding:'0 0 4px' }}>
              <Alert type="blue" icon="🔗">
                These deductions were automatically pulled from Property Manager damage reports.
              </Alert>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr>
                  {['Event','Damage Ref','Deduction','Auto-Applied','Status'].map(h=>(
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {damageReports.filter(d=>d.status==='Approved').map(d=>(
                    <tr key={d.id}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.15s'}}>
                      <td style={{...TD,fontWeight:600,color:T.text}}>{d.event}</td>
                      <td style={TD}>{d.items.slice(0,40)}…</td>
                      <td style={{...TD,fontWeight:700,color:'#dc2626'}}>-₹{d.amount.toLocaleString('en-IN')}</td>
                      <td style={TD}><span style={{color:'#15803d',fontSize:12,fontWeight:600}}>✅ Auto-synced</span></td>
                      <td style={TD}><WBadge type="green">Applied</WBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ PAYMENTS ══════════════ */}
      {tab === 'payments' && (
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
          {/* Record payment */}
          <div style={card}>
            <CardHeader title="Record Payment" />
            <div style={{ padding:'20px 22px', display:'flex',flexDirection:'column',gap:14 }}>
              {[
                { label:'Invoice', el: (
                  <select className="input">
                    {invoices.filter(i=>i.status!=='Paid').map(i=>(
                      <option key={i.id}>{i.id} — {i.client}</option>
                    ))}
                  </select>
                )},
                { label:'Amount Received (₹)', el: <input className="input" type="number" placeholder="0.00" /> },
                { label:'Payment Mode', el: (
                  <select className="input">
                    {['Online Transfer','Cash','Cheque','UPI','Card'].map(m=><option key={m}>{m}</option>)}
                  </select>
                )},
                { label:'Transaction Reference', el: <input className="input" placeholder="UTR / Ref number" /> },
              ].map(({label,el})=>(
                <div key={label}>
                  <label style={{ display:'block',fontSize:10,color:T.textSoft,textTransform:'uppercase',
                    letterSpacing:'0.1em',fontWeight:600,marginBottom:6 }}>{label}</label>
                  {el}
                </div>
              ))}
              <button onClick={()=>alert('Payment recorded!')} style={{
                width:'100%',padding:'12px',borderRadius:11,fontSize:14,fontWeight:600,
                background:'linear-gradient(135deg,#6B4F3B,#8B6B52)',
                color:'#fff',border:'none',cursor:'pointer',marginTop:4,
                boxShadow:'0 6px 20px rgba(107,79,59,0.35)',
                display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                transition:'all 0.2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                ✅ Record Payment
              </button>
            </div>
          </div>

          {/* Recent payments */}
          <div style={card}>
            <CardHeader title="Recent Payments" />
            <div style={{ padding:'8px 0' }}>
              {[
                {client:'Sharma Wedding',  amount:500000,mode:'Online',date:'2026-02-28',ref:'UTR20260228001'},
                {client:'Gupta Wedding',   amount:200000,mode:'Cash',  date:'2026-02-25',ref:'CASH-2502'},
                {client:'Patel Engagement',amount:150000,mode:'UPI',   date:'2026-02-22',ref:'UPI220226888'},
              ].map((p,i) => (
                <div key={i} style={{
                  display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'14px 22px',
                  borderBottom: i<2 ? `1px solid ${T.borderLight}` : 'none',
                }}>
                  <div>
                    <div style={{ fontSize:13,fontWeight:600,color:T.text }}>{p.client}</div>
                    <div style={{ fontSize:11,color:T.textFaint,marginTop:2 }}>{p.date} · {p.ref}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:14,fontWeight:700,color:'#15803d',marginBottom:4 }}>
                      ₹{p.amount.toLocaleString('en-IN')}
                    </div>
                    <WBadge type="gray">{p.mode}</WBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ REPORTS ══════════════ */}
      {tab === 'reports' && (
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
            {/* Revenue vs Expenses */}
            <div style={card}>
              <CardHeader title="Monthly Revenue vs Expenses" />
              <div style={{ padding:'16px' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockFinanceData} margin={{top:5,right:10,bottom:0,left:-10}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} />
                    <XAxis dataKey="week" tick={{fill:T.textSoft,fontSize:11}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:T.textSoft,fontSize:11}} axisLine={false} tickLine={false} />
                    <Tooltip {...TIP} formatter={v=>['₹'+(v/1000).toFixed(0)+'K']} />
                    <Legend wrapperStyle={{fontSize:12}} />
                    <Bar dataKey="revenue"  fill="#6B4F3B" radius={[4,4,0,0]} />
                    <Bar dataKey="expenses" fill="rgba(220,38,38,0.4)" radius={[4,4,0,0]} />
                    <Bar dataKey="profit"   fill="#c9974a" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Branch Revenue Split */}
            <div style={card}>
              <CardHeader title="Branch Revenue Split" />
              <div style={{ padding:'16px' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={mockBranchHealth.map(b=>({name:b.branch,value:b.revenue}))}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                      dataKey="value" paddingAngle={3}
                      label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {mockBranchHealth.map((b,i)=><Cell key={i} fill={b.color} />)}
                    </Pie>
                    <Tooltip {...TIP} formatter={v=>['₹'+(v/100000).toFixed(1)+'L']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Export reports */}
          <div style={card}>
            <CardHeader title="Export Reports" />
            <div style={{ padding:'16px 20px', display:'flex',flexWrap:'wrap',gap:8 }}>
              {[
                'Daily Revenue Summary','Monthly P&L','Branch-wise Breakdown',
                'GST Report','Outstanding Payments','Staff Commission Report',
                'Vendor Payment Register','Event Profitability Analysis',
              ].map(r => (
                <button key={r} onClick={()=>alert('Exporting: '+r+'.xlsx')} style={{
                  display:'inline-flex',alignItems:'center',gap:6,
                  padding:'8px 14px',borderRadius:9,fontSize:12,fontWeight:500,
                  background:T.brownLight, color:T.textMid,
                  border:`1px solid ${T.border}`,cursor:'pointer',
                  transition:'all 0.15s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(107,79,59,0.15)';e.currentTarget.style.borderColor=T.textMid}}
                onMouseLeave={e=>{e.currentTarget.style.background=T.brownLight;e.currentTarget.style.borderColor=T.border}}>
                  📥 {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ INVOICE DETAIL MODAL ══════════════ */}
      <Modal open={!!selectedInv} onClose={()=>setSelectedInv(null)} title={selectedInv?.id||''}>
        {selectedInv && (
          <>
            <div style={{
              background:'linear-gradient(145deg,rgba(201,151,74,0.06),#fdfaf6)',
              border:`1px solid ${T.goldBorder}`, borderRadius:T.radiusSm,
              padding:20, marginBottom:16,
            }}>
              <div style={{ fontFamily:'Cormorant Garamond,serif',fontSize:20,
                fontWeight:700,color:T.gold,marginBottom:16 }}>BanquetOS Tax Invoice</div>
              {[
                ['Client',       selectedInv.client],
                ['Branch',       selectedInv.branch],
                ['Invoice Date', selectedInv.date],
                ['Base Amount',  '₹'+selectedInv.amount.toLocaleString('en-IN')],
                ['GST @ 18%',    '₹'+selectedInv.gst.toLocaleString('en-IN')],
                ['TOTAL',        '₹'+selectedInv.total.toLocaleString('en-IN')],
              ].map(([k,v]) => (
                <div key={k} style={{
                  display:'flex',justifyContent:'space-between',
                  padding:'9px 0',
                  borderBottom:`1px solid ${T.borderLight}`,
                  fontSize: k==='TOTAL'?15:13,
                  fontWeight: k==='TOTAL'?700:400,
                  color: k==='TOTAL'?T.gold : k.includes('GST')?T.textFaint : T.text,
                }}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
              {selectedInv.client === 'Kumar Reception' && (
                <div style={{ display:'flex',justifyContent:'space-between',
                  padding:'9px 0',borderBottom:`1px solid ${T.borderLight}`,
                  fontSize:13,color:'#dc2626' }}>
                  <span>Damage Deduction (auto)</span><span>-₹4,500</span>
                </div>
              )}
            </div>
            <button onClick={()=>alert('PDF downloaded!')} style={{
              width:'100%',padding:'12px',borderRadius:11,fontSize:14,fontWeight:600,
              background:'linear-gradient(135deg,#6B4F3B,#8B6B52)',
              color:'#fff',border:'none',cursor:'pointer',
              boxShadow:'0 6px 20px rgba(107,79,59,0.35)',
              display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            }}>
              📥 Download PDF
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}
