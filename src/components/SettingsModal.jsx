import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'

export default function SettingsModal({ onClose }) {
  const { logout } = useAuth()
  const [tab, setTab]           = useState('account')
  const [newPw, setNewPw]       = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg]       = useState('')
  const [pwErr, setPwErr]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  async function changePassword() {
    setPwErr(''); setPwMsg('')
    if (newPw.length < 6) { setPwErr('Password must be at least 6 characters'); return }
    if (newPw !== confirmPw) { setPwErr("Passwords don't match"); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setLoading(false)
    if (error) setPwErr(error.message)
    else { setPwMsg('Password updated! ✦'); setNewPw(''); setConfirmPw('') }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}
        style={{ background:'#12103a', maxWidth:420, width:'95vw' }}>

        <div style={{ padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, background:'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            ⚙️ settings
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'var(--muted)', padding:'4px 8px', borderRadius:8 }}>✕</button>
        </div>

        {/* tabs */}
        <div style={{ display:'flex', gap:3, padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
          {['account','about'].map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{ flex:1, padding:'8px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13.5,
                background: tab===t ? 'rgba(192,132,252,.15)' : 'transparent',
                color: tab===t ? 'var(--accent)' : 'var(--muted)',
              }}>{t}</button>
          ))}
        </div>

        <div style={{ padding:'20px' }}>
          {tab === 'account' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* change password */}
              <div style={{ padding:'16px', borderRadius:14, border:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.03)' }}>
                <div style={{ fontSize:13.5, fontWeight:800, color:'var(--text)', marginBottom:14 }}>🔑 change password</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ position:'relative' }}>
                    <input
                      type={showPw?'text':'password'}
                      placeholder="new password"
                      value={newPw}
                      onChange={e=>{setNewPw(e.target.value);setPwErr('');setPwMsg('')}}
                      style={{ width:'100%', padding:'10px 40px 10px 14px', borderRadius:11, border:'1px solid rgba(192,132,252,.2)', background:'rgba(255,255,255,.05)', fontFamily:"'Space Grotesk',sans-serif", fontSize:14, color:'var(--text)', outline:'none' }}
                    />
                    <button type="button" onClick={()=>setShowPw(s=>!s)}
                      style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'var(--muted)' }}>
                      {showPw?'🙈':'👁️'}
                    </button>
                  </div>
                  <input
                    type={showPw?'text':'password'}
                    placeholder="confirm new password"
                    value={confirmPw}
                    onChange={e=>{setConfirmPw(e.target.value);setPwErr('');setPwMsg('')}}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:11, border:'1px solid rgba(192,132,252,.2)', background:'rgba(255,255,255,.05)', fontFamily:"'Space Grotesk',sans-serif", fontSize:14, color:'var(--text)', outline:'none' }}
                  />
                  {pwErr && <div style={{ fontSize:13, color:'#fb7185', fontWeight:700 }}>{pwErr}</div>}
                  {pwMsg && <div style={{ fontSize:13, color:'#6ee7b7', fontWeight:700 }}>{pwMsg}</div>}
                  <button onClick={changePassword} disabled={loading}
                    style={{ padding:'10px', borderRadius:11, border:'none', background:'linear-gradient(135deg,#c084fc,#f472b6)', color:'white', fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:14, cursor:'pointer', opacity:loading?.6:1 }}>
                    {loading ? 'updating...' : 'update password ✦'}
                  </button>
                </div>
              </div>

              {/* logout */}
              <button onClick={logout}
                style={{ padding:'13px', borderRadius:13, border:'1px solid rgba(251,113,133,.25)', background:'rgba(251,113,133,.08)', color:'#fb7185', fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:15, cursor:'pointer', transition:'all .15s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(251,113,133,.15)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(251,113,133,.08)'}>
                log out of sp4cie
              </button>
            </div>
          )}

          {tab === 'about' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10, color:'var(--text2)', fontSize:14, fontWeight:500, lineHeight:1.65 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, background:'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:4 }}>
                ✦ sp4cie
              </div>
              <p>a soft cosmic corner of the internet 🌙</p>
              <p>myspace meets the stars — customize your moon, post to the orbit feed, chat in cloud nine, and find your people ✦</p>
              <p style={{ color:'var(--muted)', fontSize:13 }}>built with love ☁️</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
