import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { portalCredentials } from '../config/portalCredentials'
import SketchReveal from '../components/SketchReveal'

const ROLE_ROUTES = {
  owner:'/owner', sales:'/sales', kitchen:'/kitchen',
  inventory:'/inventory', property:'/property', vendor:'/vendor', finance:'/finance',
}

/* ── FadeUp wrapper — remounts each time heroKey changes → animation always fires ── */
function FadeUp({ delay = 0, children, style = {} }) {
  return (
    <div style={{
      opacity: 0,
      animation: `hFadeUp 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}s forwards`,
      ...style,
    }}>
      {children}
    </div>
  )
}

function OrnamentDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, margin:'8px 0 24px' }}>
      <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(212,192,168,0.6))' }} />
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" fill="rgba(201,151,74,0.55)"/>
      </svg>
      <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(212,192,168,0.6),transparent)' }} />
    </div>
  )
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      style={{ animation:'hSpin 0.8s linear infinite', flexShrink:0 }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
      <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" opacity="0.8"/>
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [phase, setPhase]     = useState('hero')
  const [heroKey, setHeroKey] = useState(0)
  const [transOut, setTransOut] = useState(false)
  const [loginIn, setLoginIn] = useState(false)
  const [id, setId]           = useState('')
  const [pw, setPw]           = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  useEffect(() => {
    if (phase === 'login') requestAnimationFrame(() => requestAnimationFrame(() => setLoginIn(true)))
    else setLoginIn(false)
  }, [phase])

  const goLogin = () => {
    setTransOut(true)
    setTimeout(() => { setPhase('login'); setTransOut(false) }, 380)
  }

  const goBack = () => {
    setPhase('hero')
    setHeroKey(k => k + 1)
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 360))
    let matched = null
    for (const [role, creds] of Object.entries(portalCredentials)) {
      if (id.trim() === creds.id && pw === creds.password) { matched = role; break }
    }
    if (matched) { login(matched); navigate(ROLE_ROUTES[matched]) }
    else { setError('Invalid credentials. Please try again.'); setLoading(false) }
  }

  return (
    <>
      {/* ── Global keyframes (only these two files use them) ── */}
      <style>{`
        @keyframes hFadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes hSpin  { to { transform:rotate(360deg); } }
        @keyframes hPulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        @keyframes hFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        .h-pulse { animation: hPulse 2s ease-in-out infinite; }
        .h-float { animation: hFloat 3.5s ease-in-out infinite; }
      `}</style>

      <div style={{ width:'100%', height:'100vh', overflow:'hidden', position:'relative',
        fontFamily:'DM Sans,system-ui,sans-serif', background:'#1a0e08' }}>

        {/* ══════════════════════════════════════════════════════════════
            HERO — full-screen SketchReveal with text overlay
            keyed on heroKey so every visit re-mounts FadeUp children
        ══════════════════════════════════════════════════════════════ */}
        <div
          key={`hero-${heroKey}`}
          style={{
            position:'absolute', inset:0, zIndex:1,
            opacity: transOut ? 0 : (phase==='hero' ? 1 : 0),
            transform: (transOut||phase==='login') ? 'scale(0.98)' : 'scale(1)',
            transition:'opacity 0.38s ease, transform 0.38s ease',
            pointerEvents: phase==='hero' ? 'all' : 'none',
          }}
        >
          {/* SketchReveal fills 100% of hero */}
          <SketchReveal style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
            className="absolute inset-0 w-full h-full" />

          {/* Dark gradient so text stays readable */}
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
            background:'linear-gradient(180deg, rgba(26,14,8,0.55) 0%, rgba(26,14,8,0.25) 40%, rgba(26,14,8,0.65) 100%)',
          }} />

          {/* ── NAVBAR ── */}
          <nav style={{
            position:'absolute', top:0, left:0, right:0, zIndex:10,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'28px 52px',
          }}>
            <FadeUp delay={0}>
              <div style={{ fontFamily:'Cormorant Garamond,Georgia,serif', fontSize:27,
                fontWeight:700, color:'#fff', letterSpacing:'-0.5px',
                textShadow:'0 2px 16px rgba(0,0,0,0.5)' }}>
                Banquet<span style={{ color:'#c9974a' }}>OS</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.38)',
                letterSpacing:'0.25em', textTransform:'uppercase', fontWeight:500 }}>
                Management Platform
              </div>
            </FadeUp>
          </nav>

          {/* ── BIG BACKGROUND TEXT ("Make it real" style) ── */}
          <div style={{
            position:'absolute', inset:0, zIndex:3, display:'flex',
            alignItems:'center', justifyContent:'center', pointerEvents:'none',
            overflow:'hidden',
          }}>
            <div style={{
              fontFamily:'Cormorant Garamond,Georgia,serif',
              fontSize:'clamp(80px,14vw,200px)', fontWeight:700,
              color:'rgba(255,255,255,0.06)', lineHeight:1, letterSpacing:'-4px',
              whiteSpace:'nowrap', userSelect:'none',
            }}>
              Make it real.
            </div>
          </div>

          {/* ── CENTRE CONTENT ── */}
          <div style={{
            position:'absolute', inset:0, zIndex:5,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            textAlign:'center', padding:'100px 32px 120px',
          }}>
            {/* Eyebrow */}
            <FadeUp delay={0.06}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                padding:'6px 18px', borderRadius:999,
                background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.15)',
                fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.72)',
                letterSpacing:'0.16em', textTransform:'uppercase',
                marginBottom:28, backdropFilter:'blur(8px)',
              }}>
                <span className="h-pulse" style={{ width:5, height:5, borderRadius:'50%',
                  background:'#c9974a', display:'inline-block' }} />
                Premium Banquet Management
              </div>
            </FadeUp>

            {/* Headline */}
            <FadeUp delay={0.13}>
              <h1 style={{
                fontFamily:'Cormorant Garamond,Georgia,serif',
                fontSize:'clamp(44px,6.5vw,82px)',
                fontWeight:600, lineHeight:1.07, letterSpacing:'-1.8px',
                color:'#fff', marginBottom:20, maxWidth:720,
                textShadow:'0 4px 28px rgba(0,0,0,0.55)',
              }}>
                Every Celebration,<br/>
                <em style={{ color:'#d4a867', fontStyle:'italic' }}>Perfectly Orchestrated</em>
              </h1>
            </FadeUp>

            {/* Sub */}
            <FadeUp delay={0.20}>
              <p style={{
                fontSize:17, color:'rgba(255,255,255,0.58)',
                maxWidth:440, lineHeight:1.78, marginBottom:48,
              }}>
                The all-in-one operations platform for banquet halls —
                from first inquiry to final settlement.
              </p>
            </FadeUp>

            {/* CTA */}
            <FadeUp delay={0.27}>
              <button
                onClick={goLogin}
                style={{
                  display:'inline-flex', alignItems:'center', gap:12,
                  padding:'15px 52px', borderRadius:999,
                  background:'linear-gradient(135deg,#6B4F3B 0%,#8B6B52 100%)',
                  color:'#fff', fontSize:15, fontWeight:600,
                  fontFamily:'DM Sans,sans-serif', border:'none', cursor:'pointer',
                  letterSpacing:'0.03em',
                  boxShadow:'0 8px 32px rgba(107,79,59,0.55),inset 0 1px 0 rgba(255,255,255,0.18)',
                  transition:'all 0.22s cubic-bezier(.22,.68,0,1.2)',
                }}
                onMouseEnter={e=>{
                  e.currentTarget.style.transform='translateY(-3px) scale(1.04)'
                  e.currentTarget.style.boxShadow='0 16px 40px rgba(107,79,59,0.65),inset 0 1px 0 rgba(255,255,255,0.18)'
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.transform='translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow='0 8px 32px rgba(107,79,59,0.55),inset 0 1px 0 rgba(255,255,255,0.18)'
                }}
              >
                Get Started
                <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9H14M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </FadeUp>

            {/* Tagline */}
            <FadeUp delay={0.34}>
              <p style={{ marginTop:20, fontSize:11,
                color:'rgba(255,255,255,0.28)', letterSpacing:'0.06em' }}>
                7 role-based portals · Multi-branch · Real-time operations
              </p>
            </FadeUp>

            {/* Portal pills */}
            <FadeUp delay={0.41}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:7,
                justifyContent:'center', marginTop:36 }}>
                {['Owner','Sales','Kitchen','Inventory','Property','Vendor','Finance'].map(f => (
                  <span key={f} style={{
                    padding:'4px 13px', borderRadius:999, fontSize:11, fontWeight:500,
                    background:'rgba(255,255,255,0.06)',
                    border:'1px solid rgba(255,255,255,0.12)',
                    color:'rgba(255,255,255,0.52)', backdropFilter:'blur(6px)',
                  }}>{f}</span>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* ── BOTTOM HINT ── */}
          <div style={{
            position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
            zIndex:5, textAlign:'center', pointerEvents:'none',
          }}>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)',
              letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:6 }}>
              Hover image to reveal colour
            </div>
            <div className="h-float" style={{ color:'rgba(255,255,255,0.2)' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            LOGIN PANEL (slides in over the blurred hero)
        ══════════════════════════════════════════════════════════════ */}

        {/* Blurred hero still visible behind login */}
        {phase === 'login' && (
          <div style={{ position:'absolute', inset:0, zIndex:1 }}>
            <div style={{
              position:'absolute', inset:0,
              backgroundImage:'url(/images/banquet-color.jpg)',
              backgroundSize:'cover', backgroundPosition:'center',
              filter:'brightness(0.28) blur(4px) saturate(0.5)',
              transform:'scale(1.06)',
            }} />
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(160deg,rgba(42,21,10,0.78) 0%,rgba(74,51,39,0.74) 100%)',
            }} />
          </div>
        )}

        {/* Login card */}
        <div style={{
          position:'absolute', inset:0, zIndex:10,
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'80px 24px 32px',
          opacity: phase==='login' ? 1 : 0,
          pointerEvents: phase==='login' ? 'all' : 'none',
          transition:'opacity 0.4s ease',
        }}>
          <div style={{
            width:'100%', maxWidth:416,
            background:'linear-gradient(145deg,rgba(255,255,255,0.97),rgba(253,248,242,0.97))',
            border:'1px solid rgba(232,213,190,0.9)', borderRadius:24,
            boxShadow:'0 32px 80px rgba(26,14,8,0.55),0 4px 16px rgba(26,14,8,0.25),inset 0 1px 0 rgba(255,255,255,0.9)',
            overflow:'hidden',
            opacity: loginIn ? 1 : 0,
            transform: loginIn ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            transition:'opacity 0.5s cubic-bezier(.22,.68,0,1.2),transform 0.5s cubic-bezier(.22,.68,0,1.2)',
          }}>
            {/* Accent top bar */}
            <div style={{ height:3, background:'linear-gradient(90deg,transparent,#c9974a,#8B6B52,transparent)' }} />
            {/* Corner glow */}
            <div style={{ position:'absolute', top:0, right:0, width:160, height:160,
              background:'radial-gradient(circle at 80% 20%,rgba(201,151,74,0.1) 0%,transparent 70%)',
              pointerEvents:'none' }} />

            <div style={{ padding:'26px 30px 30px' }}>
              {/* Back link */}
              <button onClick={goBack} style={{
                display:'inline-flex', alignItems:'center', gap:5, background:'none',
                border:'none', cursor:'pointer', padding:0, fontSize:11, color:'#b89878',
                fontWeight:500, letterSpacing:'0.04em', marginBottom:22, transition:'color 0.15s',
              }}
              onMouseEnter={e=>e.currentTarget.style.color='#6B4F3B'}
              onMouseLeave={e=>e.currentTarget.style.color='#b89878'}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Back to home
              </button>

              {/* Heading */}
              <div style={{ textAlign:'center', marginBottom:4 }}>
                <div style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:50, height:50, borderRadius:15, marginBottom:16,
                  background:'linear-gradient(135deg,rgba(107,79,59,0.1),rgba(201,151,74,0.1))',
                  border:'1.5px solid rgba(201,151,74,0.22)', fontSize:22,
                }}>🏛</div>
                <h2 style={{ fontFamily:'Cormorant Garamond,Georgia,serif',
                  fontSize:32, fontWeight:600, color:'#3A2518',
                  letterSpacing:'-0.7px', lineHeight:1.1, marginBottom:8 }}>
                  Welcome Back
                </h2>
                <p style={{ fontSize:13, color:'#a08060', lineHeight:1.55 }}>
                  Sign in with your portal credentials.<br/>
                  You'll be redirected to your dashboard automatically.
                </p>
              </div>

              <OrnamentDivider />

              <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Username */}
                <div>
                  <label style={{ display:'block', fontSize:10, color:'#a08060', marginBottom:6,
                    textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600 }}>
                    Username / ID
                  </label>
                  <div style={{ position:'relative' }}>
                    <div style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)',
                      color:'#c0a888', pointerEvents:'none', display:'flex' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <input type="text" value={id}
                      onChange={e=>{setId(e.target.value);setError('')}}
                      placeholder="e.g. owner, sales, kitchen…"
                      className="input" style={{ paddingLeft:34 }}
                      autoComplete="username" autoFocus required />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display:'block', fontSize:10, color:'#a08060', marginBottom:6,
                    textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600 }}>
                    Password
                  </label>
                  <div style={{ position:'relative' }}>
                    <div style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)',
                      color:'#c0a888', pointerEvents:'none', display:'flex' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </div>
                    <input type={showPw?'text':'password'} value={pw}
                      onChange={e=>{setPw(e.target.value);setError('')}}
                      placeholder="••••••••••" className="input"
                      style={{ paddingLeft:34, paddingRight:42 }}
                      autoComplete="current-password" required />
                    <button type="button" onClick={()=>setShowPw(v=>!v)} tabIndex={-1}
                      style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)',
                        background:'none', border:'none', cursor:'pointer', padding:2,
                        color:showPw?'#6B4F3B':'#c0a888', transition:'color 0.15s',
                        display:'flex', alignItems:'center' }}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
                    borderRadius:10, background:'#fef2f2', border:'1px solid #fecaca',
                    color:'#dc2626', fontSize:12,
                    animation:'hFadeUp 0.3s ease forwards',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                  width:'100%', padding:'13px 16px', borderRadius:13, marginTop:2,
                  fontSize:14, fontWeight:600, fontFamily:'DM Sans,sans-serif',
                  cursor:loading?'not-allowed':'pointer', border:'none',
                  transition:'all 0.22s cubic-bezier(.22,.68,0,1.2)',
                  background:loading
                    ?'rgba(107,79,59,0.25)'
                    :'linear-gradient(135deg,#6B4F3B 0%,#8B6B52 100%)',
                  color:loading?'#a08060':'#fff',
                  boxShadow:loading?'none':'0 6px 20px rgba(107,79,59,0.38),inset 0 1px 0 rgba(255,255,255,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                }}
                onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(107,79,59,0.48),inset 0 1px 0 rgba(255,255,255,0.15)' }}}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=loading?'none':'0 6px 20px rgba(107,79,59,0.38),inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                  {loading
                    ? <><Spinner/> Verifying…</>
                    : <>Sign In
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </>
                  }
                </button>
              </form>

              <div style={{ marginTop:18, textAlign:'center', fontSize:11, color:'#c0a888', lineHeight:1.5 }}>
                Access is role-based · Redirected automatically after sign-in
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, zIndex:20,
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'13px 48px',
          borderTop:'1px solid rgba(255,255,255,0.05)',
          background:'rgba(0,0,0,0.2)', backdropFilter:'blur(6px)',
          opacity: phase==='login' ? 1 : 0,
          transition:'opacity 0.4s ease 0.2s', pointerEvents:'none',
        }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', letterSpacing:'0.06em' }}>
            BanquetOS v1.0 &nbsp;·&nbsp; Credentials managed by your administrator
          </span>
        </div>

      </div>
    </>
  )
}