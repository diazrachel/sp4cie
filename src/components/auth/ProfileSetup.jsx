import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { AVATAR_OPTIONS, BANNERS, MOODS, INTEREST_OPTIONS, PROFILE_THEMES } from '../../data.js'

export default function ProfileSetup() {
  const { session, completeSetup } = useAuth()
  const username = session?.user?.user_metadata?.username || 'star'
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    avatar:'🌙', bannerBg:BANNERS[8], bio:'',
    mood: MOODS[8], interests:[], profileTheme:'lunar',
  })
  const steps = ['your look','your vibe','welcome!']
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  function toggleInterest(i) {
    setForm(f=>({...f,interests:f.interests.includes(i)?f.interests.filter(x=>x!==i):[...f.interests,i]}))
  }
  const [finishing, setFinishing] = useState(false)
  const [finishErr, setFinishErr] = useState('')

  async function finish() {
    setFinishing(true)
    setFinishErr('')
    const res = await completeSetup({
      username,
      name: username,
      avatar: form.avatar,
      avatarBg: 'linear-gradient(135deg,#ede7f6,#d1c4e9)',
      bannerBg: form.bannerBg,
      bio: form.bio,
      mood: form.mood.label,
      interests: form.interests,
      profileTheme: form.profileTheme,
      profileFont: 'sans',
      aboutSections: [{ title:'about me', text: form.bio || 'new to sp4cie ✦' }],
    })
    setFinishing(false)
    if (res?.error) setFinishErr(res.error)
  }
  const themeKeys = Object.keys(PROFILE_THEMES).slice(0,6)
  return (
    <div className="auth-shell">
      <div className="cloud-layer" aria-hidden>{[1,2,3,4].map(i=><div key={i} className={`cloud-drift cd${i}`}/>)}</div>
      <div className="setup-card">
        <div className="auth-logo-small" style={{marginBottom:16}}>✦ sp4cie</div>
        <div className="step-dots">{steps.map((_,i)=><div key={i} className={`step-dot ${i===step?'active':i<step?'done':''}`}/>)}</div>
        {step===0 && (
          <div className="setup-step">
            <div className="auth-title" style={{fontSize:21}}>choose your look ✨</div>
            <div className="auth-sub">pick an avatar + banner</div>
            <label className="edit-label" style={{display:'block',marginBottom:6}}>avatar</label>
            <div className="setup-avi-grid">{AVATAR_OPTIONS.map(a=><button key={a} className={`setup-avi-btn ${form.avatar===a?'sel':''}`} onClick={()=>set('avatar',a)}>{a}</button>)}</div>
            <label className="edit-label" style={{display:'block',margin:'14px 0 6px'}}>banner</label>
            <div className="setup-banner-grid">{BANNERS.map(bg=><div key={bg} className={`setup-banner-btn ${form.bannerBg===bg?'sel':''}`} style={{background:bg}} onClick={()=>set('bannerBg',bg)}/>)}</div>
            <label className="edit-label" style={{display:'block',margin:'14px 0 6px'}}>page theme</label>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7}}>
              {themeKeys.map(k=>{const t=PROFILE_THEMES[k];return(<div key={k} className={`theme-opt ${form.profileTheme===k?'sel':''}`} onClick={()=>set('profileTheme',k)}><div className="theme-preview" style={{background:t.bg}}/><span className="theme-label">{t.name}</span></div>)})}
            </div>
            <div className="setup-nav"><button className="setup-next" onClick={()=>setStep(1)}>next ✦</button></div>
          </div>
        )}
        {step===1 && (
          <div className="setup-step">
            <div className="auth-title" style={{fontSize:21}}>set your vibe 🌙</div>
            <div className="auth-sub">tell the cosmos who you are</div>
            <div className="field-group" style={{marginBottom:13}}>
              <label className="field-label">bio (optional)</label>
              <textarea className="field-input" style={{resize:'vertical',minHeight:68,lineHeight:1.55,marginTop:4}}
                placeholder="tell the cosmos about yourself... ✦" value={form.bio} onChange={e=>set('bio',e.target.value)} maxLength={160}/>
              <span className="field-hint">{form.bio.length}/160</span>
            </div>
            <label className="edit-label" style={{display:'block',marginBottom:6}}>current mood</label>
            <div className="setup-mood-grid">{MOODS.map(m=><button key={m.label} className={`setup-mood-btn ${form.mood.label===m.label?'sel':''}`} style={{background:m.bg+'33',color:m.color}} onClick={()=>set('mood',m)}>{m.label}</button>)}</div>
            <label className="edit-label" style={{display:'block',margin:'13px 0 6px'}}>interests</label>
            <div className="setup-int-chips">{INTEREST_OPTIONS.slice(0,20).map(i=><button key={i} className={`setup-int-btn ${form.interests.includes(i)?'sel':''}`} onClick={()=>toggleInterest(i)}>{i}</button>)}</div>
            <div className="setup-nav"><button className="setup-back" onClick={()=>setStep(0)}>← back</button><button className="setup-next" onClick={()=>setStep(2)}>next ✦</button></div>
          </div>
        )}
        {step===2 && (
          <div className="setup-step">
            <div className="welcome-avi" style={{background:PROFILE_THEMES[form.profileTheme]?.bg||'#1a1040'}}>{form.avatar}</div>
            <div className="welcome-title">hi, {username}! 🌙</div>
            <div className="welcome-text">your moon is ready to orbit.<br/>float in and say hi to the cosmos ✦✨</div>
            <div className="setup-nav"><button className="setup-back" onClick={()=>setStep(1)}>← back</button><>
                {finishErr && <div style={{ color:'#fb7185', fontSize:13, fontWeight:700, textAlign:'center', marginBottom:8 }}>{finishErr}</div>}
                <button className="setup-next" onClick={finish} disabled={finishing}>
                  {finishing ? 'launching... 🌙' : 'enter sp4cie 🌙 →'}
                </button>
              </></div>
          </div>
        )}
      </div>
    </div>
  )
}
