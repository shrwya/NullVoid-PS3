import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'
import {
  StatCard, Alert, Badge, SectionHead, ProgressBar, HealthRing, Divider,
} from '../../components/ui'
import { mockBranchHealth, mockRevenueData, mockStaff } from '../../store/useStore'

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

const TIP = {
  contentStyle:{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:8, fontSize:12, color:T.text },
}

function CardHeader({ title }) {
  return (
    <div style={{ padding:'14px 20px', borderBottom:`1px solid ${T.borderLight}`,
      background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)' }}>
      <div style={{ fontSize:14,fontWeight:700,color:T.text,fontFamily:'Cormorant Garamond,serif' }}>{title}</div>
    </div>
  )
}

function WarmStatCard({ label, value, sub, change, icon, accent }) {
  const isUp   = change && change.startsWith('+')
  const isDown = change && change.startsWith('-')
  return (
    <div style={{
      background:T.bgCard, border:`1px solid ${T.border}`,
      borderRadius:T.radius, padding:'16px 18px',
      boxShadow:T.shadow, position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,
        background:`linear-gradient(90deg,transparent,${accent||T.gold}66,transparent)` }} />
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8 }}>
        <span style={{ fontSize:9,color:T.textSoft,textTransform:'uppercase',
          letterSpacing:'0.14em',fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:18,opacity:0.7 }}>{icon}</span>
      </div>
      <div style={{ fontSize:26,fontWeight:700,color:T.text,
        fontFamily:'Cormorant Garamond,Georgia,serif',lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11,color:T.textSoft,marginTop:4 }}>{sub}</div>}
      {change && (
        <div style={{ fontSize:11,marginTop:4,fontWeight:600,
          color: isUp?'#15803d':isDown?'#dc2626':T.textSoft }}>
          {isUp?'↑':isDown?'↓':''} {change} vs last month
        </div>
      )}
    </div>
  )
}

function WarmBar({ value, color }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:8 }}>
      <div style={{ height:5,borderRadius:999,background:T.brownLight,overflow:'hidden',minWidth:56,flex:1 }}>
        <div style={{ height:'100%',borderRadius:999,width:`${Math.min(100,value)}%`,
          background:color||T.gold,transition:'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize:11,fontWeight:600,color:T.textMid,minWidth:32 }}>{value}%</span>
    </div>
  )
}

function WBadge({ children, type='gray' }) {
  const MAP = {
    green:{ bg:'#f0fdf4',color:'#15803d',border:'#bbf7d0' },
    gray: { bg:'#f5ede0',color:'#8B6B52',border:'#e8d5be' },
    blue: { bg:'#eff6ff',color:'#1d4ed8',border:'#bfdbfe' },
  }
  const s = MAP[type]||MAP.gray
  return <span style={{ fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:999,
    background:s.bg,color:s.color,border:`1px solid ${s.border}` }}>{children}</span>
}

const TH = { padding:'10px 16px',textAlign:'left',fontSize:10,textTransform:'uppercase',
  letterSpacing:'0.1em',fontWeight:600,color:T.textSoft,borderBottom:`1px solid ${T.borderLight}`,
  background:'linear-gradient(180deg,#fdfaf6,#f8f0e4)' }
const TD = { padding:'11px 16px',fontSize:12,color:T.textMid,borderBottom:`1px solid ${T.borderLight}` }

/* ════════════════════════════════════════════════════════════════ */
export default function OwnerDashboard() {
  const [period, setPeriod] = useState('monthly')

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:20,fontFamily:'DM Sans,system-ui,sans-serif' }}>

      {/* ── Alerts ── */}
      <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
        <Alert type="red" icon="⚡">
          <strong>Revenue leakage alert:</strong> ₹1.8L outstanding &gt;30 days at Thane. Immediate follow-up required.
        </Alert>
        <Alert type="gold" icon="🎊">
          <strong>Season opportunity:</strong> Festive season approaching — historical +40% conversion rate. Activate packages.
        </Alert>
      </div>

      {/* ── KPI Strip ── */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12 }}>
        <WarmStatCard label="Revenue MTD"    value="₹27.2L" sub="4 branches"    change="+18%" icon="💰" accent={T.gold} />
        <WarmStatCard label="Active Bookings" value="109"   sub="Next 30 days"  change="+12%" icon="📅" accent="#6B4F3B" />
        <WarmStatCard label="Avg Conversion" value="66%"    sub="Leads → Book"  change="+4%"  icon="📈" accent="#8B6B52" />
        <WarmStatCard label="Outstanding"    value="₹18L"   sub="All branches"  change="-8%"  icon="⚠️" accent="#dc2626" />
      </div>

      {/* ── Branch Health + Revenue Chart ── */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 2fr',gap:16 }}>
        {/* Branch health */}
        <div style={card}>
          <CardHeader title="Branch Health Scores" />
          <div style={{ padding:'16px 20px', display:'flex',flexDirection:'column',gap:20 }}>
            {mockBranchHealth.map(b => (
              <div key={b.branch} style={{ display:'flex',alignItems:'center',gap:14 }}>
                <HealthRing score={b.score} size={54} />
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:T.text,marginBottom:8 }}>{b.branch}</div>
                  <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:8,fontSize:11 }}>
                      <span style={{ color:T.textFaint,width:64,flexShrink:0 }}>Revenue</span>
                      <div style={{ flex:1,height:5,borderRadius:999,
                        background:T.brownLight,overflow:'hidden' }}>
                        <div style={{ height:'100%',borderRadius:999,
                          width:`${Math.min(100,b.revenue/9000)}%`,
                          background:b.color,transition:'width 0.5s ease' }} />
                      </div>
                      <span style={{ color:T.textMid,minWidth:40,textAlign:'right',fontSize:11 }}>
                        ₹{(b.revenue/100000).toFixed(1)}L
                      </span>
                    </div>
                    <div style={{ display:'flex',alignItems:'center',gap:8,fontSize:11 }}>
                      <span style={{ color:T.textFaint,width:64,flexShrink:0 }}>Conv.</span>
                      <div style={{ flex:1,height:5,borderRadius:999,
                        background:T.brownLight,overflow:'hidden' }}>
                        <div style={{ height:'100%',borderRadius:999,
                          width:`${b.conversion}%`,background:'#15803d',transition:'width 0.5s ease' }} />
                      </div>
                      <span style={{ color:T.textMid,minWidth:40,textAlign:'right',fontSize:11 }}>
                        {b.conversion}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue chart */}
        <div style={card}>
          <CardHeader title="Branch Revenue — Last 6 Months" />
          <div style={{ padding:'16px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={mockRevenueData} margin={{top:5,right:10,bottom:0,left:-10}}>
                <defs>
                  {mockBranchHealth.map(b=>(
                    <linearGradient key={b.branch} id={`wgrad-${b.branch}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={b.color} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={b.color} stopOpacity={0}    />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} />
                <XAxis dataKey="month" tick={{fill:T.textSoft,fontSize:11}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:T.textSoft,fontSize:11}} axisLine={false} tickLine={false} />
                <Tooltip {...TIP} formatter={v=>['₹'+v+'K']} />
                <Legend wrapperStyle={{fontSize:12}} />
                {mockBranchHealth.map(b=>(
                  <Area key={b.branch} type="monotone" dataKey={b.branch}
                    stroke={b.color} fill={`url(#wgrad-${b.branch})`} strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Staff Leaderboard ── */}
      <div style={card}>
        <CardHeader title="🏆 Staff Performance Leaderboard" />
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead><tr>
              {['Rank','Name','Branch','Leads','Closed','Revenue','Follow-up Rate','Conv. %'].map(h=>(
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {mockStaff.map((s,i) => (
                <tr key={s.name}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  style={{transition:'background 0.15s'}}>
                  <td style={{...TD,fontSize:16}}>
                    {['🥇','🥈','🥉','4th','5th'][i]}
                  </td>
                  <td style={{...TD,fontWeight:600,color:T.text}}>{s.name}</td>
                  <td style={TD}><WBadge type="gray">{s.branch}</WBadge></td>
                  <td style={TD}>{s.leads}</td>
                  <td style={{...TD,color:'#15803d',fontWeight:600}}>{s.closed}</td>
                  <td style={TD}>₹{(s.revenue/100000).toFixed(1)}L</td>
                  <td style={{...TD,minWidth:140}}>
                    <WarmBar value={s.followup} color={s.followup>85?'#15803d':'#c2410c'} />
                  </td>
                  <td style={{...TD,fontWeight:700,
                    color:s.rank<=2?'#15803d':T.textSoft}}>
                    {Math.round((s.closed/s.leads)*100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Branch Comparison ── */}
      <div style={card}>
        <CardHeader title="Branch Comparison Overview" />
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead><tr>
              {['Branch','Health','Revenue MTD','Bookings','Conversion','Outstanding','Staff Score'].map(h=>(
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {mockBranchHealth.map(b => (
                <tr key={b.branch}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(107,79,59,0.025)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  style={{transition:'background 0.15s'}}>
                  <td style={{...TD,fontWeight:700,color:T.text}}>{b.branch}</td>
                  <td style={TD}>
                    <span style={{ fontSize:13,fontWeight:700,
                      color:b.score>=80?'#15803d':b.score>=65?'#c2410c':'#dc2626' }}>
                      {b.score}/100
                    </span>
                  </td>
                  <td style={TD}>₹{(b.revenue/100000).toFixed(1)}L</td>
                  <td style={TD}>{b.bookings}</td>
                  <td style={{...TD,minWidth:130}}>
                    <WarmBar value={b.conversion} color='#15803d' />
                  </td>
                  <td style={{...TD,
                    color:b.outstanding>500000?'#dc2626':T.textSoft,
                    fontWeight:b.outstanding>500000?700:400 }}>
                    ₹{(b.outstanding/100000).toFixed(1)}L
                  </td>
                  <td style={{...TD,minWidth:110}}>
                    <WarmBar value={b.staffScore} color='#6B4F3B' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
