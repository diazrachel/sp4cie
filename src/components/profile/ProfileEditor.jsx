import { useApp } from '../../context/AppContext.jsx'
import { useState } from 'react'
import { AVATAR_OPTIONS, BANNERS, PROFILE_THEMES, PROFILE_FONTS, MOODS, INTEREST_OPTIONS, BADGE_CATALOG } from '../../data.js'

const TABS = ['look','vibe','about','custom']

export default function ProfileEditor({ onSave, onClose }) {
  const { myProfile } = useApp()
  const [form, setForm] = useState({ ...myProfile })
  const [tab, setTab]   = useState('look')
  const [newInterest, setNewInterest] = useState('')
  const [newMood, setNewMood]         = useState('')

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  function toggleInterest(i) {
    setForm(f=>({ ...f, interests: f.interests.includes(i) ? f.interests.filter(x=>x!==i) : [...f.interests, i] }))
  }
  function addCustomInterest() {
    const t = newInterest.trim()
    if (!t || form.interests.includes(t)) return
    setForm(f=>({...f, interests:[...f.interests, t]}))
    setNewInterest('')
  }
  function addCustomMood() {
    const t = newMood.trim()
    if (!t) return
    set('mood', t)
    setNewMood('')
  }
  function toggleBadge(b) {
    setForm(f=>({ ...f, badges: (f.badges||[]).includes(b) ? f.badges.filter(x=>x!==b) : [...(f.badges||[]), b] }))
  }
  function addAboutSection() {
    setForm(f=>({...f, aboutSections:[...(f.aboutSections||[]), {title:'new section',text:''}]}))
  }
  function updateAboutSection(i,k,v) {
    setForm(f=>({...f, aboutSections: f.aboutSections.map((s,idx)=>idx===i?{...s,[k]:v}:s)}))
  }
  function removeAboutSection(i) {
    setForm(f=>({...f, aboutSections: f.aboutSections.filter((_,idx)=>idx!==i)}))
  }

  return (
    <div className="edit-overlay">
      <div className="edit-panel">
        <div className="edit-header">
          <h2>customize my moon 🌙</h2>
          <button className="edit-close" onClick={onClose}>✕</button>
        </div>

        {/* tab bar */}
        <div style={{ display:'flex', gap:3, padding:'8px 12px', borderBottom:'1px solid var(--border)' }}>
          {TABS.map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{ flex:1, padding:'7px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13,
                background: tab===t ? 'rgba(192,132,252,.15)' : 'transparent',
                color: tab===t ? 'var(--accent)' : 'var(--muted)',
              }}>{t}</button>
          ))}
        </div>

        <div className="edit-body">

          {/* ── LOOK TAB ── */}
          {tab==='look' && <>
            <div>
              <div className="edit-section-title">avatar emoji</div>
              <div className="avi-picker">
                {AVATAR_OPTIONS.map(a=><button key={a} className={`avi-opt ${form.avatar===a?'sel':''}`} onClick={()=>set('avatar',a)}>{a}</button>)}
              </div>
              <p style={{ fontSize:12, color:'var(--muted)', marginTop:6, fontWeight:600 }}>💡 to upload a real photo, tap your avatar on your moon profile</p>
            </div>
            <div>
              <div className="edit-section-title">banner gradient</div>
              <div className="banner-picker">
                {BANNERS.map(bg=><div key={bg} className={`banner-opt ${form.bannerBg===bg?'sel':''}`} style={{ background:bg }} onClick={()=>set('bannerBg',bg)}/>)}
              </div>
              <p style={{ fontSize:12, color:'var(--muted)', marginTop:6, fontWeight:600 }}>💡 to upload a real banner photo/gif, tap "change banner" on your moon profile</p>
            </div>
            <div>
              <div className="edit-section-title">page theme</div>
              <div className="theme-picker">
                {Object.values(PROFILE_THEMES).map(t=>(
                  <div key={t.name} className={`theme-opt ${form.profileTheme===t.name?'sel':''}`} onClick={()=>set('profileTheme',t.name)}>
                    <div className="theme-preview" style={{ background:t.bg }}/>
                    <span className="theme-label">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="edit-section-title">font</div>
              <div className="font-picker">
                {Object.values(PROFILE_FONTS).map(f=>(
                  <button key={f.name} className={`font-opt ${form.profileFont===f.name?'sel':''}`}
                    style={{ fontFamily:f.family }} onClick={()=>set('profileFont',f.name)}>{f.label}</button>
                ))}
              </div>
            </div>
          </>}

          {/* ── VIBE TAB ── */}
          {tab==='vibe' && <>
            <div>
              <label className="edit-label">display name</label>
              <input className="edit-input" value={form.name||''} onChange={e=>set('name',e.target.value)} placeholder="your name..." />
            </div>
            <div>
              <label className="edit-label">handle</label>
              <input className="edit-input" value={form.handle||''} onChange={e=>set('handle',e.target.value)} placeholder="@yourhandle" />
            </div>
            <div>
              <label className="edit-label">bio</label>
              <textarea className="edit-input edit-textarea" value={form.bio||''} onChange={e=>set('bio',e.target.value)} placeholder="tell the cosmos about yourself..." maxLength={200}/>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:3, textAlign:'right' }}>{(form.bio||'').length}/200</div>
            </div>
            <div>
              <label className="edit-label">website</label>
              <input className="edit-input" value={form.website||''} onChange={e=>set('website',e.target.value)} placeholder="yoursite.com"/>
            </div>
            <div>
              <div className="edit-section-title">current mood</div>
              <div className="setup-mood-grid">
                {MOODS.map(m=>(
                  <button key={m.label} className={`setup-mood-btn ${form.mood===m.label?'sel':''}`}
                    style={{ background:m.bg+'33', color:m.color }} onClick={()=>set('mood',m.label)}>{m.label}</button>
                ))}
              </div>
              <div style={{ display:'flex', gap:8, marginTop:9 }}>
                <input className="edit-input" style={{ flex:1 }} placeholder="or type your own mood... ✨"
                  value={newMood} onChange={e=>setNewMood(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&addCustomMood()} />
                <button onClick={addCustomMood} style={addBtn}>+ set</button>
              </div>
              {form.mood && !MOODS.find(m=>m.label===form.mood) && (
                <div style={{ marginTop:7, padding:'5px 13px', borderRadius:20, background:'rgba(192,132,252,.12)', color:'var(--accent)', border:'1px solid rgba(192,132,252,.25)', fontSize:13, fontWeight:700, display:'inline-block' }}>
                  current: {form.mood}
                </div>
              )}
            </div>
            <div>
              <div className="edit-section-title">interests</div>
              <div className="interest-chips">
                {INTEREST_OPTIONS.map(i=>(
                  <button key={i} className={`int-btn ${(form.interests||[]).includes(i)?'sel':''}`} onClick={()=>toggleInterest(i)}>{i}</button>
                ))}
              </div>
              {/* custom interests */}
              <div style={{ marginTop:10, display:'flex', gap:8 }}>
                <input className="edit-input" style={{ flex:1 }} placeholder="add your own interest... ☁️"
                  value={newInterest} onChange={e=>setNewInterest(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&addCustomInterest()} />
                <button onClick={addCustomInterest} style={addBtn}>+ add</button>
              </div>
              <div style={{ marginTop:8, display:'flex', flexWrap:'wrap', gap:6 }}>
                {(form.interests||[]).filter(i=>!INTEREST_OPTIONS.includes(i)).map((tag,i)=>(
                  <span key={i} style={{ padding:'4px 12px', borderRadius:20, fontSize:12.5, fontWeight:700, background:'rgba(192,132,252,.12)', color:'var(--accent)', border:'1px solid rgba(192,132,252,.2)', cursor:'pointer' }}
                    onClick={()=>toggleInterest(tag)}>{tag} ✕</span>
                ))}
              </div>
            </div>
            <div>
              <div className="edit-section-title">badges (pick up to 5)</div>
              <div className="interest-chips">
                {BADGE_CATALOG.map(b=>{
                  const sel = (form.badges||[]).includes(b)
                  const maxed = !sel && (form.badges||[]).length >= 5
                  return <button key={b} className={`int-btn ${sel?'sel':''}`} disabled={maxed} style={maxed?{opacity:.4,cursor:'not-allowed'}:{}} onClick={()=>toggleBadge(b)}>{b}</button>
                })}
              </div>
            </div>
          </>}

          {/* ── ABOUT TAB ── */}
          {tab==='about' && <>
            <p style={{ fontSize:13, color:'var(--muted)', fontWeight:600, fontStyle:'italic' }}>
              add custom sections to your moon — like myspace! ✦
            </p>
            {(form.aboutSections||[]).map((sec,i)=>(
              <div key={i} className="about-section-editor">
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                  <input className="edit-input" style={{ flex:1 }} value={sec.title} onChange={e=>updateAboutSection(i,'title',e.target.value)} placeholder="section title..."/>
                  <button onClick={()=>removeAboutSection(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--coral)', fontSize:16, padding:'4px 8px', borderRadius:8 }}>✕</button>
                </div>
                <textarea className="edit-input edit-textarea" style={{ minHeight:60 }} value={sec.text} onChange={e=>updateAboutSection(i,'text',e.target.value)} placeholder="write something..."/>
              </div>
            ))}
            <button className="add-section-btn" onClick={addAboutSection}>+ add section</button>
          </>}

          {/* ── CUSTOM HTML/CSS TAB ── */}
          {tab==='custom' && <>
            <div style={{ padding:'10px 13px', borderRadius:11, background:'rgba(253,230,138,.08)', border:'1px solid rgba(253,230,138,.2)', marginBottom:4 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:'#fde68a', marginBottom:4 }}>⚠️ advanced — like myspace custom profiles!</div>
              <div style={{ fontSize:12, color:'var(--muted)', fontWeight:500, lineHeight:1.5 }}>
                paste custom CSS to style your moon page. use <code style={{ background:'rgba(255,255,255,.08)', padding:'1px 5px', borderRadius:4 }}>.moon-page</code>, <code style={{ background:'rgba(255,255,255,.08)', padding:'1px 5px', borderRadius:4 }}>.moon-name</code>, etc. HTML goes in the custom section below.
              </div>
            </div>
            <div>
              <label className="edit-label">custom CSS</label>
              <textarea className="edit-input edit-textarea" style={{ minHeight:140, fontFamily:'monospace', fontSize:13 }}
                value={form.customCss||''} onChange={e=>set('customCss',e.target.value)}
                placeholder={`.moon-page {\n  background: linear-gradient(135deg, #1a0a2e, #0d0d1a) !important;\n}\n.moon-name {\n  color: #f472b6 !important;\n  font-size: 28px !important;\n}`}
              />
            </div>
            <div>
              <label className="edit-label">custom HTML section</label>
              <textarea className="edit-input edit-textarea" style={{ minHeight:120, fontFamily:'monospace', fontSize:13 }}
                value={form.customHtml||''} onChange={e=>set('customHtml',e.target.value)}
                placeholder={`<div style="text-align:center; color:#c084fc">\n  <h3>✦ welcome to my moon ✦</h3>\n  <p>hover for a surprise...</p>\n</div>`}
              />
            </div>
            <p style={{ fontSize:11.5, color:'var(--muted)', fontWeight:600 }}>
              note: script tags are stripped for safety. inline styles and most HTML tags work fine ✦
            </p>
          </>}

          <button className="save-btn" onClick={() => onSave(form)}>save my moon ✦</button>
        </div>
      </div>
    </div>
  )
}

const addBtn = {
  padding:'8px 14px', borderRadius:10, border:'none',
  background:'linear-gradient(135deg,#c084fc,#f472b6)',
  color:'white', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer',
}
