import React from 'react'
import SketchReveal from '../components/SketchReveal'
import PortalLoginCard from '../components/PortalLoginCard'

const PORTALS = ['owner', 'sales', 'kitchen', 'inventory', 'property', 'vendor', 'finance']

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      {/* ── Racing car animation section (DO NOT MODIFY) ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{ height: 180, background: '#0c0f14' }}
      >
        {/* Background giant text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ opacity: 0.06 }}
        >
          <span
            className="font-display whitespace-nowrap"
            style={{ fontSize: 'clamp(80px, 12vw, 160px)', letterSpacing: '-3px', color: 'white' }}
          >
            Make it real.
          </span>
        </div>

        {/* Sketch reveal canvas */}
        <SketchReveal className="w-full h-full" />

        {/* Floating portal labels */}
        <div className="absolute top-3 left-4 flex gap-2 pointer-events-none">
          {[
            { label: 'Owner',   color: '#c9a84c', bg: 'rgba(201,168,76,0.15)',  border: 'rgba(201,168,76,0.3)' },
            { label: 'Sales',   color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)' },
            { label: 'Kitchen', color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.3)' },
          ].map((p) => (
            <div
              key={p.label}
              className="text-[10px] font-bold px-2 py-1 rounded-full font-body border"
              style={{ color: p.color, background: p.bg, borderColor: p.border }}
            >
              {p.label}
            </div>
          ))}
        </div>

        {/* Sub text */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="text-[11px] text-slate-500">
            Hover to reveal — Vizcom-style sketch-to-render
          </div>
          <div className="text-[11px] text-amber-400/60">
            🏛 BanquetOS — Management Platform v1.0
          </div>
        </div>
      </div>

      {/* ── Multi-portal login section ── */}
      <div className="px-6 py-14 max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border2 bg-surface2 text-[11px] text-slate-500 uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse inline-block" />
            Select Your Portal
          </div>
          <h2 className="font-display text-4xl text-white mb-3" style={{ letterSpacing: '-1px' }}>
            Portal Access
          </h2>
          <p className="text-slate-500 text-[14px] max-w-md mx-auto">
            Sign in to your designated portal below. Each portal provides role-specific tools and dashboards.
          </p>
        </div>

        {/* Portal grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTALS.map((key) => (
            <PortalLoginCard key={key} portalKey={key} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-[12px] text-slate-600">
          BanquetOS v1.0 &nbsp;·&nbsp; Credentials managed by your administrator
        </div>
      </div>
    </div>
  )
}
