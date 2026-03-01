import React, { useRef, useEffect, useCallback } from 'react'

/*
  SketchReveal — Full-page Vizcom-style hero
  ─────────────────────────────────────────
  • Sketch (grayscale) photo fills the entire area as base layer
  • Color photo sits on top, clipped to the reveal box region
  • A selection box (with corner handles + label) follows the mouse
  • The box uses position:fixed viewport coords; clip path mirrors them
    against the container's getBoundingClientRect → pixel-perfect reveal
*/

const BOX_W = 280
const BOX_H = 280

export default function SketchReveal({ className = '' }) {
  const containerRef = useRef(null)
  const boxRef       = useRef(null)
  const colorRef     = useRef(null)
  const mouseRef     = useRef({ x: -999, y: -999 })
  const posRef       = useRef({ x: -999, y: -999 })
  const rafRef       = useRef(null)
  const activeRef    = useRef(false)

  /* ── smooth spring follow + clip recalc ──────────────────────────── */
  const tick = useCallback(() => {
    const m  = mouseRef.current
    const p  = posRef.current

    // spring lerp — box centre chases mouse
    p.x += (m.x - BOX_W / 2 - p.x) * 0.12
    p.y += (m.y - BOX_H / 2 - p.y) * 0.12

    if (boxRef.current) {
      boxRef.current.style.left = p.x + 'px'
      boxRef.current.style.top  = p.y + 'px'
    }

    if (colorRef.current && containerRef.current) {
      const s  = containerRef.current.getBoundingClientRect()
      // box edges in viewport px
      const bL = p.x,          bR = p.x + BOX_W
      const bT = p.y,          bB = p.y + BOX_H
      // inset from container edges  (clamp to ≥ 0)
      const iL = Math.max(0, bL - s.left)
      const iT = Math.max(0, bT - s.top)
      const iR = Math.max(0, s.right  - bR)
      const iB = Math.max(0, s.bottom - bB)
      colorRef.current.style.clipPath = `inset(${iT}px ${iR}px ${iB}px ${iL}px)`
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tick])

  /* ── mouse handlers ──────────────────────────────────────────────── */
  const onMove = (e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
    if (!activeRef.current) {
      activeRef.current = true
      if (boxRef.current)   boxRef.current.style.opacity   = '1'
      if (colorRef.current) colorRef.current.style.opacity = '1'
    }
  }

  const onLeave = () => {
    activeRef.current = false
    mouseRef.current  = { x: -999, y: -999 }
    if (boxRef.current)   boxRef.current.style.opacity   = '0'
    if (colorRef.current) colorRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'crosshair', userSelect: 'none' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >

      {/* ── BASE: grayscale sketch ──────────────────────────────────── */}
      <img
        src="/images/banquet-sketch.jpg"
        alt=""
        draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          filter: 'grayscale(100%) contrast(1.15) brightness(0.88)',
          pointerEvents: 'none',
        }}
      />

      {/* Fine grid overlay — engineering-sketch feel */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none', opacity: 0.14 }}
      >
        <defs>
          <pattern id="sr-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#6B4F3B" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sr-grid)" />
      </svg>

      {/* ── COLOR LAYER: clipped to reveal box ─────────────────────── */}
      <div
        ref={colorRef}
        style={{
          position: 'absolute', inset: 0,
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        <img
          src="/images/banquet-color.jpg"
          alt=""
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />
        {/* Warm vignette over colour layer */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(74,51,39,0.35) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── SELECTION BOX (fixed → viewport coords) ────────────────── */}
      <div
        ref={boxRef}
        style={{
          position: 'fixed',
          width: BOX_W, height: BOX_H,
          pointerEvents: 'none', zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.18s ease',
        }}
      >
        {/* Main border */}
        <div style={{
          position: 'absolute', inset: 0,
          border: '1.5px solid #c9974a',
          boxShadow: '0 0 20px rgba(201,151,74,0.25), inset 0 0 20px rgba(201,151,74,0.05)',
        }} />

        {/* Corner handles — exactly like Vizcom */}
        {[
          { top: -4, left: -4 }, { top: -4, right: -4 },
          { bottom: -4, left: -4 }, { bottom: -4, right: -4 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', width: 8, height: 8,
            background: '#c9974a',
            boxShadow: '0 0 8px rgba(201,151,74,0.8)',
            ...pos,
          }} />
        ))}

        {/* Centre crosshair lines */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 1, background: 'rgba(201,151,74,0.2)',
          transform: 'translateX(-50%)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 1, background: 'rgba(201,151,74,0.2)',
          transform: 'translateY(-50%)',
        }} />

        {/* Label badge */}
        <div style={{
          position: 'absolute', top: -28, left: 0,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(42,21,10,0.82)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201,151,74,0.4)',
          padding: '4px 10px', borderRadius: 6,
          fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#c9974a',
          fontFamily: 'DM Sans, sans-serif',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%',
            background: '#c9974a', display: 'inline-block',
            animation: 'srPulse 1.5s ease-in-out infinite' }} />
          Venue Preview
        </div>

        {/* Dimension readout (bottom right) */}
        <div style={{
          position: 'absolute', bottom: -22, right: 0,
          fontSize: 8, fontWeight: 600, letterSpacing: '0.1em',
          color: 'rgba(201,151,74,0.6)', fontFamily: 'DM Sans, sans-serif',
        }}>
          {BOX_W} × {BOX_H}
        </div>

        <style>{`@keyframes srPulse{0%,100%{opacity:1;}50%{opacity:0.3;}}`}</style>
      </div>

      {/* Children (big text, CTAs, etc.) sit on top */}
      {/* NOTE: parent passes children via className slot only;
          text overlay is handled in Home.jsx */}
    </div>
  )
}