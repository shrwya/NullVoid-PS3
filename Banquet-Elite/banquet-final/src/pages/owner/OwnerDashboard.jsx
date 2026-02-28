import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'
import {
  StatCard, Alert, Badge, SectionHead, ProgressBar, HealthRing, Divider,
} from '../../components/ui'
import { mockBranchHealth, mockRevenueData, mockStaff } from '../../store/useStore'

const chartStyle = {
  contentStyle: { background: '#161c2a', border: '1px solid #1e2a3e', borderRadius: 8, fontSize: 12 },
  legendStyle: { fontSize: 12 },
  tickStyle: { fill: '#475569', fontSize: 11 },
}

export default function OwnerDashboard() {
  const [period, setPeriod] = useState('monthly')

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Alerts */}
      <div>
        <Alert type="red" icon="⚡">
          <strong>Revenue leakage alert:</strong> ₹1.8L outstanding &gt;30 days at Thane. Immediate follow-up required.
        </Alert>
        <Alert type="gold" icon="🎊">
          <strong>Season opportunity:</strong> Festive season approaching — historical +40% conversion rate. Activate packages.
        </Alert>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Revenue MTD"          value="₹27.2L"  sub="4 branches"    change="+18%"  icon="💰" accent="#c9a84c" />
        <StatCard label="Active Bookings"       value="109"     sub="Next 30 days"  change="+12%"  icon="📅" />
        <StatCard label="Avg Conversion"        value="66%"     sub="Leads → Book"  change="+4%"   icon="📈" />
        <StatCard label="Outstanding"           value="₹18L"    sub="All branches"  change="-8%"   icon="⚠️" />
      </div>

      {/* Branch Health + Revenue Chart */}
      <div className="grid grid-cols-[1fr_2fr] gap-5">
        {/* Branch Health */}
        <div className="card p-5">
          <SectionHead title="Branch Health Scores" />
          <div className="space-y-4">
            {mockBranchHealth.map((b) => (
              <div key={b.branch} className="flex items-center gap-3.5">
                <HealthRing score={b.score} size={54} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-slate-200 mb-1.5">{b.branch}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-slate-500 w-16 flex-shrink-0">Revenue</span>
                      <ProgressBar value={b.revenue / 9000} color={b.color} className="flex-1" />
                      <span className="text-slate-400 w-10 text-right">₹{(b.revenue / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-slate-500 w-16 flex-shrink-0">Conversion</span>
                      <ProgressBar value={b.conversion} color="#22c55e" className="flex-1" />
                      <span className="text-slate-400 w-10 text-right">{b.conversion}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card p-5">
          <SectionHead title="Branch Revenue — Last 6 Months" />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockRevenueData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <defs>
                {mockBranchHealth.map((b) => (
                  <linearGradient key={b.branch} id={`grad-${b.branch}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={b.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={b.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3e" />
              <XAxis dataKey="month" tick={chartStyle.tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle.tickStyle} axisLine={false} tickLine={false} />
              <Tooltip {...chartStyle} formatter={(v) => ['₹' + v + 'K']} />
              <Legend wrapperStyle={chartStyle.legendStyle} />
              {mockBranchHealth.map((b) => (
                <Area key={b.branch} type="monotone" dataKey={b.branch}
                  stroke={b.color} fill={`url(#grad-${b.branch})`} strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Leaderboard */}
      <div className="card p-5">
        <SectionHead title="🏆 Staff Performance Leaderboard" />
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                {['Rank', 'Name', 'Branch', 'Leads', 'Closed', 'Revenue', 'Follow-up Rate', 'Conv. %'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockStaff.map((s, i) => (
                <tr key={s.name}>
                  <td>{['🥇', '🥈', '🥉', '4th', '5th'][i]}</td>
                  <td className="font-medium text-slate-200">{s.name}</td>
                  <td><Badge type="gray">{s.branch}</Badge></td>
                  <td>{s.leads}</td>
                  <td className="text-emerald-400 font-medium">{s.closed}</td>
                  <td>₹{(s.revenue / 100000).toFixed(1)}L</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ProgressBar
                        value={s.followup}
                        color={s.followup > 85 ? '#22c55e' : '#f97316'}
                        className="w-20"
                      />
                      <span className="text-[12px] text-slate-400">{s.followup}%</span>
                    </div>
                  </td>
                  <td className="text-[13px] font-bold" style={{ color: s.rank <= 2 ? '#22c55e' : '#94a3b8' }}>
                    {Math.round((s.closed / s.leads) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch Comparison Table */}
      <div className="card p-5">
        <SectionHead title="Branch Comparison Overview" />
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                {['Branch', 'Health', 'Revenue MTD', 'Bookings', 'Conversion', 'Outstanding', 'Staff Score'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockBranchHealth.map((b) => (
                <tr key={b.branch}>
                  <td className="font-medium text-slate-200">{b.branch}</td>
                  <td>
                    <span className="text-[13px] font-bold" style={{ color: b.score >= 80 ? '#22c55e' : b.score >= 65 ? '#f97316' : '#ef4444' }}>
                      {b.score}/100
                    </span>
                  </td>
                  <td>₹{(b.revenue / 100000).toFixed(1)}L</td>
                  <td>{b.bookings}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={b.conversion} color="#22c55e" className="w-16" />
                      <span className="text-[12px]">{b.conversion}%</span>
                    </div>
                  </td>
                  <td className={b.outstanding > 500000 ? 'text-red-400 font-medium' : 'text-slate-400'}>
                    ₹{(b.outstanding / 100000).toFixed(1)}L
                  </td>
                  <td>
                    <ProgressBar value={b.staffScore} color="#3b82f6" className="w-16" />
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
