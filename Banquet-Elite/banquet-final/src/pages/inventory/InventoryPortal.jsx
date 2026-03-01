import React, { useState, useEffect } from 'react'
import { Tabs, Alert, Badge, ProgressBar, SectionHead } from '../../components/ui'

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════ */
const T = {
  bg:          '#fdfaf6',
  bgCard:      'linear-gradient(145deg,#ffffff 0%,#fdfaf6 100%)',
  bgCardHover: 'linear-gradient(145deg,#fff8f0 0%,#fdf5ed 100%)',
  border:      '#e8d5be',
  borderLight: '#f0e4d0',
  text:        '#3A2518',
  textMid:     '#8B6B52',
  textSoft:    '#a08060',
  textFaint:   '#c0a888',
  gold:        '#c9974a',
  goldLight:   'rgba(201,151,74,0.12)',
  goldBorder:  'rgba(201,151,74,0.28)',
  brown:       '#6B4F3B',
  brownLight:  'rgba(107,79,59,0.1)',
  shadow:      '0 2px 12px rgba(107,79,59,0.08),0 1px 3px rgba(107,79,59,0.04)',
  shadowMd:    '0 6px 24px rgba(107,79,59,0.12),0 2px 6px rgba(107,79,59,0.06)',
  shadowLg:    '0 12px 40px rgba(107,79,59,0.16),0 4px 12px rgba(107,79,59,0.08)',
  radius:      16,
  radiusSm:    10,
  radiusLg:    20,
}

/* ── Pill badge ─────────────────────────────────────────────────── */
const BADGE = {
  red:    { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
  green:  { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0' },
  blue:   { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
  orange: { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
  gray:   { bg:'#f5ede0', color:'#8B6B52', border:'#e8d5be' },
  gold:   { bg:'rgba(201,151,74,0.1)', color:'#b45309', border:'rgba(201,151,74,0.3)' },
}
function WarmBadge({ children, type = 'gray' }) {
  const s = BADGE[type] || BADGE.gray
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:999,
      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      letterSpacing:'0.04em',
    }}>{children}</span>
  )
}

/* ── Progress bar ───────────────────────────────────────────────── */
function WarmBar({ value, isLow }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{
        flex:1, height:6, borderRadius:999,
        background:'rgba(107,79,59,0.1)', overflow:'hidden', minWidth:72,
      }}>
        <div style={{
          height:'100%', borderRadius:999,
          width:`${Math.min(100,value)}%`,
          background: isLow
            ? 'linear-gradient(90deg,#ef4444,#dc2626)'
            : 'linear-gradient(90deg,#6B4F3B,#c9974a)',
          transition:'width 0.5s ease',
        }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, minWidth:32,
        color: isLow ? '#dc2626' : '#8B6B52' }}>{Math.round(value)}%</span>
    </div>
  )
}

/* ── Stat card ──────────────────────────────────────────────────── */
function StatCard({ label, value, icon, warn }) {
  return (
    <div style={{
      background: warn ? 'linear-gradient(145deg,#fef2f2,#fff5f5)' : T.bgCard,
      border:`1px solid ${warn ? '#fecaca' : T.border}`,
      borderRadius:T.radius, padding:'16px 18px',
      boxShadow: T.shadow, position:'relative', overflow:'hidden',
    }}>
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:3,
        background: warn
          ? 'linear-gradient(90deg,transparent,#fca5a5,transparent)'
          : 'linear-gradient(90deg,transparent,rgba(201,151,74,0.5),transparent)',
      }} />
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontSize:9, color: warn?'#dc2626':T.textSoft,
          textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:18, opacity:0.7 }}>{icon}</span>
      </div>
      <div style={{
        fontSize:26, fontWeight:700, color: warn?'#dc2626':T.text,
        fontFamily:'Cormorant Garamond,Georgia,serif', lineHeight:1,
      }}>{value}</div>
    </div>
  )
}

/* ── Section header ─────────────────────────────────────────────── */
function CardHeader({ title, sub, action }) {
  return (
    <div style={{
      padding:'16px 22px', borderBottom:`1px solid ${T.borderLight}`,
      background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:T.text,
          fontFamily:'Cormorant Garamond,serif', letterSpacing:'-0.2px' }}>{title}</div>
        {sub && <div style={{ fontSize:11, color:T.textSoft, marginTop:2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  )
}

/* ── Table styles ───────────────────────────────────────────────── */
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

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT  —  backend unchanged
═══════════════════════════════════════════════════════════════════ */
export default function InventoryPortal() {
  const [tab, setTab]                   = useState('stock')
  const [showTransfer, setShowTransfer] = useState(null)
  const [inventory, setInventory]       = useState([])
  const [transferAlerts, setTransferAlerts] = useState([])
  const [showAdd, setShowAdd]           = useState(false)
  const [form, setForm]                 = useState({
    item:'', category:'', branch:'', stock:'',
    min:'', unit:'', expiry:'', supplier:'',
  })

  useEffect(() => { fetchInventory() }, [])

  async function fetchInventory() {
    try {
      const res  = await fetch('http://localhost:8000/inventory/')
      const data = await res.json()
      setInventory(data)
    } catch (err) { console.log('Error fetching inventory', err) }
  }

  const lowStock = inventory.filter(i => i.stock <= i.min)
  const expiring = inventory.filter(item => {
    if (!item.expiry) return false
    const daysLeft = (new Date(item.expiry) - new Date()) / 86400000
    return daysLeft <= 5
  })

  const suppliers = [
    { name:'Shree Traders', cat:'Grain/Sugar', ontime:96, quality:88, trend:'↓ Improving', orders:34 },
    { name:'Amul Direct',   cat:'Dairy',       ontime:82, quality:92, trend:'→ Stable',    orders:22 },
    { name:'Fresh Farms',   cat:'Protein',      ontime:74, quality:78, trend:'↑ Declining', orders:18 },
    { name:'Local Market',  cat:'Vegetables',   ontime:68, quality:72, trend:'↑ Declining', orders:40 },
    { name:'Fortune',       cat:'Oil',          ontime:94, quality:90, trend:'↓ Improving', orders:12 },
  ]

  const tabs = [
    { id:'stock',     icon:'📦', label:'Stock Levels' },
    { id:'transfer',  icon:'🔄', label:'Cross-Branch',
      badge: transferAlerts.filter(t => t.status === 'Pending').length || undefined },
    { id:'suppliers', icon:'🤝', label:'Suppliers' },
  ]

  /* ── shared card wrapper ── */
  const card = {
    background: T.bgCard,
    border:`1px solid ${T.border}`,
    borderRadius:T.radius,
    boxShadow:T.shadow,
    overflow:'hidden',
  }

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16,
      fontFamily:'DM Sans,system-ui,sans-serif' }}>

      {/* ── Alert strip ── */}
      {lowStock.map(item => (
        <div key={item._id} style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'12px 16px', borderRadius:T.radiusSm, fontSize:12,
          background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626',
          boxShadow:'0 2px 8px rgba(220,38,38,0.08)',
        }}>
          <span>⚠️</span>
          <span>
            <strong>LOW STOCK:</strong> {item.item} at {item.branch}&nbsp;
            ({item.stock}{item.unit}, min {item.min}{item.unit})
          </span>
        </div>
      ))}
      {expiring.map(item => (
        <div key={item._id} style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'12px 16px', borderRadius:T.radiusSm, fontSize:12,
          background:'#fff7ed', border:'1px solid #fed7aa', color:'#c2410c',
          boxShadow:'0 2px 8px rgba(249,115,22,0.08)',
        }}>
          <span>⏰</span>
          <span>
            <strong>EXPIRY ALERT:</strong> {item.item} at {item.branch} expires {item.expiry}
          </span>
        </div>
      ))}

      {/* ── Tabs ── */}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* ══════════════ STOCK TAB ══════════════ */}
      {tab === 'stock' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Stat strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            <StatCard label="Total SKUs"       value="48"              icon="📦" />
            <StatCard label="Low Stock Items"  value={lowStock.length} icon="⚠️" warn={lowStock.length > 0} />
            <StatCard label="Expiring Soon"    value={expiring.length} icon="⏰" warn={expiring.length > 0} />
            <StatCard label="Stock Value"      value="₹4.2L"           icon="💰" />
          </div>

          {/* Add form */}
          {showAdd && (
            <div style={card}>
              <CardHeader
                title="Add Inventory Item"
                action={
                  <button onClick={() => setShowAdd(false)} style={{
                    background:'none', border:'none', cursor:'pointer',
                    fontSize:11, color:T.textSoft, padding:'4px 8px', borderRadius:6,
                  }}>✕ Close</button>
                }
              />
              <div style={{ padding:'20px 22px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                  {Object.keys(form).map(key => (
                    <div key={key}>
                      <label style={{ display:'block', fontSize:10, color:T.textSoft,
                        textTransform:'uppercase', letterSpacing:'0.1em',
                        fontWeight:600, marginBottom:6, textTransform:'capitalize' }}>{key}</label>
                      <input
                        placeholder={key} className="input"
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button style={{
                    padding:'10px 22px', borderRadius:10, fontSize:13, fontWeight:600,
                    background:'linear-gradient(135deg,#6B4F3B,#8B6B52)',
                    color:'#fff', border:'none', cursor:'pointer',
                    boxShadow:'0 4px 14px rgba(107,79,59,0.3)',
                    transition:'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(107,79,59,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(107,79,59,0.3)' }}
                  onClick={async () => {
                    await fetch('http://localhost:8000/inventory/', {
                      method:'POST', headers:{'Content-Type':'application/json'},
                      body:JSON.stringify({
                        item:form.item, category:form.category, branch:form.branch,
                        stock:Number(form.stock), min:Number(form.min), unit:form.unit,
                        expiry:form.expiry||null, supplier:form.supplier||null,
                      }),
                    })
                    fetchInventory()
                  }}>
                    Save Item
                  </button>
                  <button onClick={() => setShowAdd(false)} style={{
                    padding:'10px 18px', borderRadius:10, fontSize:13,
                    background:T.brownLight, color:T.textMid,
                    border:`1px solid ${T.border}`, cursor:'pointer',
                  }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Stock table */}
          <div style={card}>
            <CardHeader
              title="Real-Time Stock Levels"
              sub={`${inventory.length} items tracked`}
              action={
                <button onClick={() => setShowAdd(true)} style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'8px 16px', borderRadius:10, fontSize:12, fontWeight:600,
                  background:'linear-gradient(135deg,#6B4F3B,#8B6B52)',
                  color:'#fff', border:'none', cursor:'pointer',
                  boxShadow:'0 4px 12px rgba(107,79,59,0.28)',
                  transition:'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)' }}>
                  + Add Stock
                </button>
              }
            />
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Item','Category','Branch','Stock Level','Min Required','Status','Expiry','Supplier','Action'].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => {
                    const pct = Math.min(100,(item.stock/item.min)*100)
                    const daysLeft = (new Date(item.expiry) - new Date()) / 86400000
                    const isLow      = item.stock <= item.min
                    const isExpiring = daysLeft <= 5
                    return (
                      <tr key={item._id}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                        style={{ transition:'background 0.15s' }}>
                        <td style={{ ...TD, fontWeight:600, color:T.text }}>
                          {(isLow||isExpiring) && <span style={{ marginRight:4 }}>🚩</span>}
                          {item.item}
                        </td>
                        <td style={TD}><WarmBadge type="gray">{item.category}</WarmBadge></td>
                        <td style={TD}><WarmBadge type="blue">{item.branch}</WarmBadge></td>
                        <td style={{ ...TD, minWidth:170 }}>
                          <WarmBar value={pct} isLow={isLow} />
                          <div style={{ fontSize:11, marginTop:3,
                            color:isLow?'#dc2626':T.textFaint }}>
                            {item.stock} {item.unit}
                          </div>
                        </td>
                        <td style={TD}>{item.min} {item.unit}</td>
                        <td style={TD}>
                          <WarmBadge type={isLow?'red':'green'}>{isLow?'⚠ Low Stock':'✓ OK'}</WarmBadge>
                        </td>
                        <td style={{ ...TD, color:isExpiring?'#dc2626':T.textSoft }}>
                          {item.expiry}{isExpiring?' ⚠️':''}
                        </td>
                        <td style={TD}>{item.supplier}</td>
                        <td style={TD}>
                          <div style={{ display:'flex', gap:6 }}>
                            {isLow && (
                              <button onClick={() => alert('PO raised for '+item.item)} style={{
                                fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:8,
                                background:'rgba(201,151,74,0.1)', color:'#b45309',
                                border:'1px solid rgba(201,151,74,0.3)', cursor:'pointer',
                                transition:'all 0.15s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                                📋 PO
                              </button>
                            )}
                            <button style={{
                              fontSize:10, fontWeight:600, padding:'4px 10px', borderRadius:8,
                              background:T.brownLight, color:T.textMid,
                              border:`1px solid ${T.border}`, cursor:'pointer',
                              transition:'all 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background='rgba(107,79,59,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background=T.brownLight}
                            onClick={async () => {
                              const newStock = prompt('Enter new stock value:')
                              if (newStock === null) return
                              const stockNumber = Number(newStock)
                              if (isNaN(stockNumber)) { alert('Please enter a valid number'); return }
                              try {
                                const res = await fetch(`http://localhost:8000/inventory/${item._id}`,{
                                  method:'PUT', headers:{'Content-Type':'application/json'},
                                  body:JSON.stringify({ stock:stockNumber }),
                                })
                                if (!res.ok) { alert('Update failed'); return }
                                fetchInventory()
                                alert('Stock updated successfully!')
                              } catch { alert('Server error') }
                            }}>
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
                <div style={{ padding:'48px', textAlign:'center',
                  color:T.textFaint, fontSize:13, fontStyle:'italic' }}>
                  No inventory items yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TRANSFER TAB ══════════════ */}
      {tab === 'transfer' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {transferAlerts.map(t => (
            <div key={t._id} style={{
              borderRadius:T.radiusLg, padding:22, position:'relative', overflow:'hidden',
              background:'linear-gradient(145deg,rgba(201,151,74,0.06),#fdfaf6)',
              border:`1px solid ${T.goldBorder}`,
              boxShadow:T.shadow,
            }}>
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:3,
                background:'linear-gradient(90deg,transparent,rgba(201,151,74,0.6),transparent)',
              }} />
              <div style={{ fontSize:12, fontWeight:700, color:'#b45309',
                marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
                🔄 <span>Smart Transfer Alert</span>
              </div>
              <p style={{ fontSize:13, color:T.text, lineHeight:1.65, marginBottom:16 }}>
                <strong>{t.to} branch</strong> has a shortage of {t.item} — needs {t.qty}{t.unit} for{' '}
                <strong>{t.event}</strong>. <strong>{t.from} branch</strong> has a surplus.
                Transfer recommended by <strong style={{ color:'#b45309' }}>{t.dueBy}</strong>.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                {[['Item',t.item],['From',t.from+' (surplus)'],['To',t.to+' (shortage)'],['Qty',t.qty+' '+t.unit]].map(([k,v]) => (
                  <div key={k} style={{
                    padding:10, borderRadius:T.radiusSm,
                    background:'rgba(255,255,255,0.7)', border:`1px solid ${T.border}`,
                  }}>
                    <div style={{ fontSize:9, color:T.textSoft, textTransform:'uppercase',
                      letterSpacing:'0.12em', marginBottom:3 }}>{k}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                {t.status === 'Pending' ? (
                  <>
                    <button onClick={() => alert('Transfer approved!')} style={{
                      padding:'10px 22px', borderRadius:10, fontSize:13, fontWeight:600,
                      background:'linear-gradient(135deg,#6B4F3B,#8B6B52)',
                      color:'#fff', border:'none', cursor:'pointer',
                      boxShadow:'0 4px 14px rgba(107,79,59,0.3)',
                    }}>✅ Approve Transfer</button>
                    <button style={{
                      padding:'10px 18px', borderRadius:10, fontSize:13,
                      background:T.brownLight, color:T.textMid,
                      border:`1px solid ${T.border}`, cursor:'pointer',
                    }}>View Details</button>
                  </>
                ) : <WarmBadge type="green">✅ Transfer Approved</WarmBadge>}
              </div>
            </div>
          ))}

          {/* Transfer history */}
          <div style={card}>
            <CardHeader title="Transfer History" />
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>{['Item','From','To','Qty','Event','Date','Status'].map(h=>(
                    <th key={h} style={TH}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {[
                    {item:'Rice',from:'Thane', to:'Andheri',qty:'50 kg',event:'TCS Annual',       date:'2026-02-18',status:'Completed'},
                    {item:'Oil', from:'Bandra',to:'Pune',   qty:'20 L', event:'Mehta Anniversary',date:'2026-02-10',status:'Completed'},
                  ].map((t,i) => (
                    <tr key={i}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.15s'}}>
                      <td style={{...TD,fontWeight:600,color:T.text}}>{t.item}</td>
                      <td style={TD}>{t.from}</td>
                      <td style={TD}>{t.to}</td>
                      <td style={TD}>{t.qty}</td>
                      <td style={TD}>{t.event}</td>
                      <td style={TD}>{t.date}</td>
                      <td style={TD}><WarmBadge type="green">{t.status}</WarmBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ SUPPLIERS TAB ══════════════ */}
      {tab === 'suppliers' && (
        <div style={card}>
          <CardHeader
            title="Supplier Performance Dashboard"
            sub={`${suppliers.length} active vendors`}
          />
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>{['Supplier','Category','On-Time Delivery','Quality Score','Price Trend','Orders','Action'].map(h=>(
                  <th key={h} style={TH}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {suppliers.map(s => {
                  const isGoodTime    = s.ontime > 85
                  const isGoodQuality = s.quality > 85
                  const trendColor    = s.trend.includes('Improving') ? '#15803d'
                                      : s.trend.includes('Declining') ? '#dc2626'
                                      : T.textSoft
                  return (
                    <tr key={s.name}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(190, 156, 132, 0.03)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.15s'}}>
                      <td style={{...TD,fontWeight:700,color:T.text}}>{s.name}</td>
                      <td style={TD}><WarmBadge type="gray">{s.cat}</WarmBadge></td>
                      <td style={{...TD,minWidth:170}}>
                        <WarmBar value={s.ontime} isLow={!isGoodTime} />
                      </td>
                      <td style={TD}>
                        <span style={{ fontWeight:700, fontSize:13,
                          color:isGoodQuality?'#15803d':'#c2410c' }}>{s.quality}%</span>
                      </td>
                      <td style={{...TD,color:trendColor,fontWeight:500}}>{s.trend}</td>
                      <td style={TD}>{s.orders}</td>
                      <td style={TD}>
                        <button onClick={() => alert('PO generated for '+s.name)} style={{
                          fontSize:10, fontWeight:700, padding:'5px 12px', borderRadius:8,
                          background:'rgba(201,151,74,0.1)', color:'#b45309',
                          border:'1px solid rgba(201,151,74,0.3)', cursor:'pointer',
                          transition:'all 0.15s',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                        onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
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
