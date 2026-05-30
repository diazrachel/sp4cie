import { useApp } from '../context/AppContext.jsx'
import { useState, useRef } from 'react'
import PostCard from './PostCard.jsx'
import MediaCapture from './media/MediaCapture.jsx'

export default function Feed() {
  const { posts, addPost, moods, myProfile } = useApp()
  const [draft, setDraft]           = useState('')
  const [selectedMood, setMood]     = useState(moods[0])
  const [customMood, setCustomMood] = useState('')
  const [showMoods, setShowMoods]   = useState(false)
  const [media, setMedia]           = useState(null)
  const [mediaType, setMediaType]   = useState(null)
  const [audioFile, setAudioFile]   = useState(null)
  const [audioName, setAudioName]   = useState('')
  const [showCapture, setShowCapture] = useState(false)
  const [posting, setPosting]       = useState(false)
  const audioRef = useRef(null)
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

  function handleCapture({ url, type }) {
    setMedia(url)
    setMediaType(type)
  }

  function handleAudio(e) {
    const f = e.target.files[0]
    if (!f) return
    setAudioFile(f)
    setAudioName(f.name)
    e.target.value = ''
  }

  const activeMood = customMood.trim()
    ? { label: customMood.trim(), bg: '#ede7f6', color: '#7c3aed' }
    : selectedMood

  async function handlePost() {
    if (!draft.trim() && !media) return
    setPosting(true)
    await addPost({ body: draft.trim(), media, mediaType, audioFile, mood: activeMood })
    setDraft(''); setMedia(null); setMediaType(null)
    setAudioFile(null); setAudioName(''); setShowMoods(false); setCustomMood('')
    setPosting(false)
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">orbit feed ✦</div>
      </div>

      {/* Composer */}
      <div className="composer">
        <div className="composer-top">
          <div className="composer-avi" style={{ background: myProfile?.avatarBg }}>
            {myProfile?.profilePicUrl
              ? <img src={myProfile.profilePicUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
              : myProfile?.avatar}
          </div>
          <textarea className="composer-ta"
            placeholder="what's floating through your cosmos? ✦"
            value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.metaKey && handlePost()}
          />
        </div>

        {/* media preview */}
        {media && (
          <div className="composer-media-preview" style={{ marginTop:10 }}>
            {mediaType==='image'
              ? <img src={media} alt="preview" style={{ width:'100%', maxHeight:260, objectFit:'cover', borderRadius:12 }} />
              : <video src={media} controls style={{ width:'100%', maxHeight:260, borderRadius:12 }} />}
            <button className="remove-media" onClick={() => { setMedia(null); setMediaType(null) }}>✕</button>
          </div>
        )}

        {/* audio preview */}
        {audioFile && (
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10, padding:'8px 12px', borderRadius:10, background:'rgba(192,132,252,.1)', border:'1px solid rgba(192,132,252,.2)' }}>
            <span style={{ fontSize:18 }}>🎵</span>
            <span style={{ fontSize:13, color:'var(--text2)', fontWeight:600, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{audioName}</span>
            <button onClick={() => { setAudioFile(null); setAudioName('') }} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:16 }}>✕</button>
          </div>
        )}

        <div className="composer-footer">
          <div className="composer-tools">
            {/* media button — opens camera on mobile, capture screen either way */}
            <button className="tool-btn" title="photo/video" onClick={() => setShowCapture(true)}>
              {isMobile ? '📸' : '🖼️'}
            </button>
            {/* audio */}
            <input ref={audioRef} type="file" accept="audio/*" style={{ display:'none' }} onChange={handleAudio} />
            <button className="tool-btn" title="add music" onClick={() => audioRef.current.click()}>🎵</button>
            <button className={`tool-btn ${showMoods?'active':''}`} onClick={() => setShowMoods(!showMoods)}>
              {activeMood.label.split(' ')[0]} mood
            </button>
          </div>
          <button className="post-btn" onClick={handlePost} disabled={(!draft.trim() && !media) || posting}>
            {posting ? '✦ posting...' : 'orbit ✦'}
          </button>
        </div>

        {/* mood picker */}
        {showMoods && (
          <div style={{ marginTop:10 }}>
            <div className="mood-selector">
              {moods.map(m => (
                <button key={m.label}
                  className={`mood-chip ${selectedMood.label===m.label&&!customMood?'selected':''}`}
                  style={{ background:m.bg+'33', color:m.color, borderColor:m.color+'66' }}
                  onClick={() => { setMood(m); setCustomMood('') }}>
                  {m.label}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, marginTop:10, alignItems:'center' }}>
              <input
                style={{ flex:1, padding:'7px 12px', borderRadius:10, border:'1px solid rgba(192,132,252,.3)', background:'rgba(255,255,255,.05)', fontFamily:"'Space Grotesk',sans-serif", fontSize:13, color:'var(--text)', outline:'none' }}
                placeholder="or type your own mood... ✨"
                value={customMood}
                onChange={e => setCustomMood(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✦</div>
          <div style={{ fontWeight:700, marginBottom:8 }}>nothing in orbit yet</div>
          <div style={{ fontSize:13.5, color:'var(--muted)', fontWeight:500 }}>
            be the first to post something ☁️
          </div>
        </div>
      ) : (
        posts.map(p => <PostCard key={p.id} post={p} />)
      )}

      {showCapture && <MediaCapture onCapture={handleCapture} onClose={() => setShowCapture(false)} />}
    </div>
  )
}
