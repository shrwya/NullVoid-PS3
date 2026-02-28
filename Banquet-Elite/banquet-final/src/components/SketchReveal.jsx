import React, { useRef, useEffect, useCallback } from 'react'

/* ────────────────────────────────────────────────────────────────────────────
   SketchReveal — Vizcom-inspired reveal effect
   Hover over the canvas to reveal the colored render inside a draggable box
   ──────────────────────────────────────────────────────────────────────────── */

export default function SketchReveal({ className = '' }) {
  const containerRef = useRef(null)
  const boxRef       = useRef(null)
  const colorRef     = useRef(null)
  const mouseRef     = useRef({ x: -400, y: -400 })
  const posRef       = useRef({ x: -400, y: -400 })
  const rafRef       = useRef(null)
  const BOX = { w: 220, h: 220 }

  const animate = useCallback(() => {
    const m = mouseRef.current
    const p = posRef.current
    p.x += (m.x - BOX.w / 2 - p.x) * 0.1
    p.y += (m.y - BOX.h / 2 - p.y) * 0.1

    if (boxRef.current) {
      boxRef.current.style.left = p.x + 'px'
      boxRef.current.style.top  = p.y + 'px'
    }

    if (colorRef.current && containerRef.current) {
      const scene = containerRef.current.getBoundingClientRect()
      const bL = p.x, bR = p.x + BOX.w, bT = p.y, bB = p.y + BOX.h
      const sL = scene.left, sR = scene.right, sT = scene.top, sB = scene.bottom
      const clipL = Math.max(0, bL - sL)
      const clipT = Math.max(0, bT - sT)
      const clipR = Math.max(0, sR - bR)
      const clipB = Math.max(0, sB - bB)
      colorRef.current.style.clipPath = `inset(${clipT}px ${clipR}px ${clipB}px ${clipL}px)`
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  const onMouseMove = (e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
    if (boxRef.current) boxRef.current.style.display = 'block'
  }
  const onMouseLeave = () => {
    mouseRef.current = { x: -400, y: -400 }
    if (boxRef.current) boxRef.current.style.display = 'none'
    if (colorRef.current) colorRef.current.style.clipPath = 'inset(0 100% 0 0)'
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-visible select-none cursor-none ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* ── SKETCH LAYER ── */}
      <SketchLayer />

      {/* ── COLOR LAYER (clipped) ── */}
      <div
        ref={colorRef}
        className="absolute inset-0"
        style={{ clipPath: 'inset(0 100% 0 0)', transition: 'none' }}
      >
        <ColorLayer />
      </div>

      {/* ── REVEAL BOX ── */}
      <div
        ref={boxRef}
        className="fixed pointer-events-none z-[9999]"
        style={{ display: 'none', width: BOX.w, height: BOX.h }}
      >
        {/* Outer dashed border */}
        <div className="absolute inset-0 border-2 border-orange-400 rounded-sm" />
        {/* Corner handles */}
        {[
          { top: -3, left: -3 }, { top: -3, right: -3 },
          { bottom: -3, left: -3 }, { bottom: -3, right: -3 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-sm"
            style={s}
          />
        ))}
        {/* Inner glow */}
        <div className="absolute inset-0 bg-orange-400/5" />
        {/* Label */}
        <div className="absolute -top-6 left-0 text-[10px] text-orange-400 bg-black/60 px-1.5 py-0.5 rounded font-mono">
          RENDER PREVIEW
        </div>
      </div>
    </div>
  )
}

/* ── SVG SKETCH LAYER ─────────────────────────────────────────────────────── */
function SketchLayer() {
  return (
    <svg
      viewBox="0 0 900 400"
      className="w-full h-full"
      style={{ background: 'transparent' }}
    >
      {/* Grid */}
      <g stroke="#2a3850" strokeWidth="0.5" opacity="0.6">
        {[300, 400, 500, 600, 700].map(x => <line key={x} x1={x} y1={0} x2={x} y2={400} />)}
        {[120, 200, 280, 320].map(y => <line key={y} x1={0} y1={y} x2={900} y2={y} />)}
      </g>

      {/* Car sketch */}
      <g stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M130 300 Q170 295 210 285 L310 225 L430 200 L590 196 L700 204 L775 236 L808 286 L808 308 Z" />
        <path d="M310 225 Q355 180 398 170 L534 166 Q594 168 634 192 L700 204" />
        <path d="M130 300 Q110 306 106 295 Q100 272 128 262 L190 252" />
        <path d="M808 308 Q826 308 830 290 Q828 264 806 254" />
        <path d="M320 223 Q352 190 382 178 L428 173 L428 220 Z" strokeWidth="1.2" />
        <path d="M434 173 L434 220 L548 216 L548 173 Z" strokeWidth="1.2" />
        <path d="M554 174 L554 215 L624 203 L614 178 Z" strokeWidth="1.2" />
        <path d="M210 308 Q248 288 285 308 Q280 330 248 335 Q215 332 210 308" />
        <path d="M638 306 Q676 286 712 306 Q707 330 675 335 Q643 332 638 306" />
        <line x1="350" y1="168" x2="350" y2="380" stroke="#1e2a3e" strokeWidth="0.8" strokeDasharray="6 4" />
        <line x1="525" y1="163" x2="525" y2="380" stroke="#1e2a3e" strokeWidth="0.8" strokeDasharray="6 4" />
      </g>
      {/* Hatching */}
      <g stroke="#475569" strokeWidth="0.6" opacity="0.4">
        {[0,18,36,54].map(o => <line key={o} x1={310+o} y1={295} x2={355+o} y2={250} />)}
        {[0,18,36].map(o => <line key={o} x1={700+o} y1={260} x2={765+o} y2={230} />)}
      </g>
    </svg>
  )
}

/* ── SVG COLOR LAYER ──────────────────────────────────────────────────────── */
function ColorLayer() {
  return (
    <svg viewBox="0 0 900 400" className="w-full h-full">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4843a" />
          <stop offset="45%" stopColor="#b85e1a" />
          <stop offset="100%" stopColor="#7a3a0a" />
        </linearGradient>
        <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c87830" />
          <stop offset="100%" stopColor="#8a4410" />
        </linearGradient>
        <radialGradient id="wheel" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(200,230,255,0.65)" />
          <stop offset="100%" stopColor="rgba(120,180,255,0.25)" />
        </linearGradient>
        <filter id="carShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>

      <ellipse cx="470" cy="334" rx="310" ry="18" fill="rgba(0,0,0,0.3)" />
      <g filter="url(#carShadow)">
        <path d="M130 300 Q170 295 210 285 L310 225 L430 200 L590 196 L700 204 L775 236 L808 286 L808 308 Z" fill="url(#body)" />
        <path d="M310 225 Q355 180 398 170 L534 166 Q594 168 634 192 L700 204 L590 196 L430 200 Z" fill="url(#roof)" />
        <path d="M210 285 Q415 265 608 260 L700 270 L700 204 L590 196 L430 200 L310 225 Z" fill="rgba(255,150,50,0.12)" />
      </g>

      {/* Windows */}
      <path d="M320 223 Q352 190 382 178 L428 173 L428 220 Z" fill="url(#glass)" stroke="#8a5010" strokeWidth="1.5" />
      <path d="M434 173 L434 220 L548 216 L548 173 Z" fill="url(#glass)" stroke="#8a5010" strokeWidth="1.5" />
      <path d="M554 174 L554 215 L624 203 L614 178 Z" fill="url(#glass)" stroke="#8a5010" strokeWidth="1.5" />
      <path d="M335 210 Q355 193 372 185 L380 180 L366 207 Z" fill="rgba(255,255,255,0.28)" />
      <path d="M445 196 L448 175 L490 173 L490 197 Z" fill="rgba(255,255,255,0.18)" />

      {/* Bumpers */}
      <path d="M130 300 Q110 306 106 295 Q100 272 128 262 L190 252 L210 285 Z" fill="#7a3a0a" />
      <rect x="109" y="277" width="24" height="8" rx="2" fill="#e8a040" />
      <path d="M808 308 Q826 308 830 290 Q828 264 806 254 L806 282 Z" fill="#7a3a0a" />
      <rect x="806" y="274" width="20" height="8" rx="2" fill="#e8a040" />

      {/* Wheels */}
      {[248, 674].map((cx, i) => {
        const cy = i === 0 ? 322 : 318
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={42} fill="url(#wheel)" />
            <circle cx={cx} cy={cy} r={30} fill="#222" />
            <circle cx={cx} cy={cy} r={18} fill="#444" />
            <circle cx={cx} cy={cy} r={7} fill="#666" />
            <g stroke="#666" strokeWidth="2.5">
              <line x1={cx} y1={cy - 18} x2={cx} y2={cy + 18} />
              <line x1={cx - 18} y1={cy} x2={cx + 18} y2={cy} />
              <line x1={cx - 13} y1={cy - 13} x2={cx + 13} y2={cy + 13} />
              <line x1={cx + 13} y1={cy - 13} x2={cx - 13} y2={cy + 13} />
            </g>
            <path d={`M${cx-30} ${cy-10} Q${cx-18} ${cy-28} ${cx} ${cy-30}`} stroke="rgba(255,255,255,0.18)" strokeWidth="3" fill="none" />
          </g>
        )
      })}
      {/* Body shine */}
      <path d="M240 264 Q450 242 655 242 Q705 244 740 254 Q705 238 655 234 Q450 228 240 248 Z" fill="rgba(255,190,80,0.22)" />
    </svg>
  )
}
