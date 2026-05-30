import { useApp } from '../context/AppContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useState, useRef } from 'react'
import PostCard from './PostCard.jsx'
import ProfileEditor from './profile/ProfileEditor.jsx'
import { PROFILE_THEMES, PROFILE_FONTS } from '../data.js'
import { supabase } from '../lib/supabase.js'

function MusicPlayer({ url, name }) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume]   = useState(0.5)
  const audioRef = useRef(null)
  if (!url) return null
  function toggle() {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.volume = volume; audioRef.current.play(); setPlaying(true) }
  }
  function changeVolume(e) {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }
  return (
    <div className="music-player">
      <audio ref={audioRef} src={url} onEnded={() => setPlaying(false)} />
      <div className={`music-disc ${!playing?'paused':''}`}>🎵</div>
      <div className="music-info">
        <div className="music-title">{name || 'profile song'}</div>
        <div className="music-artist">tap to {playing?'pause':'play'}</div>
      </div>
      <input type="range" min="0" max="1" step="0.05" value={volume} onChange={changeVolume}
        style={{ width:50, accentColor:'var(--accent)', cursor:'pointer' }} title="volume" />
      <button className="music-play-btn" onClick={toggle}>{playing?'⏸':'▶'}</button>
    </div>
  )
}

export default function MyMoon() {
  const { myProfile, posts, myStarCount, myFollowingCount, myFriendCount } = useApp()
  const { updateProfile, session } = useAuth()
  const [editing, setEditing]     = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [uploadingPic, setUploadingPic]  = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadingMusic, setUploadingMusic]   = useState(false)
  const picRef    = useRef(null)
  const bannerRef = useRef(null)
  const musicRef  = useRef(null)

  const myPosts = posts.filter(p => p.authorId === myProfile?.id)
  const theme   = PROFILE_THEMES[myProfile?.profileTheme] || PROFILE_THEMES.lunar
  const font    = PROFILE_FONTS[myProfile?.profileFont]   || PROFILE_FONTS.sans

  async function uploadMedia(file, type) {
    const userId  = session?.user?.id
    if (!userId) return null
    const ext     = file.name.split('.').pop()
    const path    = `${userId}/${type}_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('sp4cie-media').upload(path, file, { upsert:true })
    if (error) { alert('Upload failed: ' + error.message); return null }
    const { data } = supabase.storage.from('sp4cie-media').getPublicUrl(path)
    return data?.publicUrl || null
  }

  async function handleProfilePic(e) {
    const file = e.target.files[0]; if (!file) return
    setUploadingPic(true)
    const url = await uploadMedia(file, 'avatar')
    if (url) await updateProfile({ profilePicUrl: url })
    setUploadingPic(false); e.target.value = ''
  }

  async function handleBanner(e) {
    const file = e.target.files[0]; if (!file) return
    setUploadingBanner(true)
    const url = await uploadMedia(file, 'banner')
    if (url) await updateProfile({ bannerUrl: url })
    setUploadingBanner(false); e.target.value = ''
  }

  async function handleMusic(e) {
    const file = e.target.files[0]; if (!file) return
    setUploadingMusic(true)
    const url = await uploadMedia(file, 'music')
    if (url) await updateProfile({ profileMusicUrl: url, currentSong: file.name.replace(/\.[^.]+$/, '') })
    setUploadingMusic(false); e.target.value = ''
  }

  function handleSave(updates) { updateProfile(updates); setEditing(false) }

  if (!myProfile) return <div className="empty-state"><div className="empty-icon">🌙</div>loading your moon...</div>

  // render custom HTML/CSS if set
  const hasCustom = myProfile.customHtml || myProfile.customCss

  return (
    <div className="moon-page" style={{ background:theme.bg, borderRadius:18, minHeight:'calc(100vh - 52px)', fontFamily:font.family }}>

      {/* custom CSS injection */}
      {myProfile.customCss && (
        <style>{myProfile.customCss.replace(/<[^>]*>/g,'')}</style>
      )}

      {/* Banner */}
      <div className="moon-banner" style={{ background: myProfile.bannerUrl ? 'transparent' : myProfile.bannerBg, position:'relative' }}>
        {myProfile.bannerUrl && (
          <img src={myProfile.bannerUrl} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        )}
        <div className="moon-banner-overlay" />
        {['✦','✧','⭐','✦','✧'].map((s,i) => (
          <span key={i} aria-hidden style={{ position:'absolute', top:`${20+i*12}%`, left:`${10+i*18}%`, fontSize:i%2===0?14:10, opacity:.5, color:'rgba(255,255,255,.7)', pointerEvents:'none' }}>{s}</span>
        ))}
        {/* banner upload button */}
        <button onClick={() => bannerRef.current.click()}
          style={{ position:'absolute', bottom:12, right:12, padding:'6px 13px', borderRadius:10, border:'1px solid rgba(255,255,255,.3)', background:'rgba(0,0,0,.45)', backdropFilter:'blur(6px)', color:'white', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12.5, cursor:'pointer', zIndex:2 }}>
          {uploadingBanner ? '⏳ uploading...' : '🖼️ change banner'}
        </button>
        <input ref={bannerRef} type="file" accept="image/*,image/gif" style={{ display:'none' }} onChange={handleBanner} />
      </div>

      <div className="moon-profile-card" style={{ background:theme.card, backdropFilter:'blur(10px)', color:theme.text }}>
        <div className="moon-avi-row">
          {/* avatar — clickable to upload */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <div className="moon-avi" style={{ background:myProfile.avatarBg, borderColor:theme.accent, overflow:'hidden', cursor:'pointer' }}
              onClick={() => picRef.current.click()}>
              {myProfile.profilePicUrl
                ? <img src={myProfile.profilePicUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                : myProfile.avatar}
            </div>
            <div style={{ position:'absolute', bottom:2, right:2, width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#c084fc,#f472b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,.4)', pointerEvents:'none' }}>
              {uploadingPic ? '⏳' : '📷'}
            </div>
            <input ref={picRef} type="file" accept="image/*,image/gif" style={{ display:'none' }} onChange={handleProfilePic} />
          </div>

          <button className="moon-edit-btn" style={{ borderColor:theme.accent+'55', color:theme.text }} onClick={() => setEditing(true)}>
            ✏️ customize
          </button>
        </div>

        <div className="moon-name" style={{ color:theme.text }}>{myProfile.name}</div>
        <div className="moon-handle" style={{ color:theme.text+'99' }}>{myProfile.handle}</div>
        <div className="moon-mood-badge" style={{ background:theme.accent+'22', color:theme.accent }}>{myProfile.mood}</div>
        <div className="moon-bio" style={{ color:theme.text+'cc' }}>{myProfile.bio || 'no bio yet — customize your moon ✦'}</div>
        {myProfile.website && <div style={{ fontSize:13, fontWeight:700, color:theme.accent, marginBottom:10 }}>🔗 {myProfile.website}</div>}

        <div className="moon-stats">
          {[
            { val:myPosts.length,    label:'posts'    },
            { val:myStarCount,       label:'stars'    },
            { val:myFollowingCount,  label:'following'},
            { val:myFriendCount,     label:'friends'  },
          ].map(s => (
            <div key={s.label}>
              <div className="moon-stat-num" style={{ color:theme.text }}>{s.val}</div>
              <div className="moon-stat-label" style={{ color:theme.text+'88' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {myProfile.badges?.length > 0 && (
          <div className="moon-badges" style={{ marginBottom:14 }}>
            {myProfile.badges.map((b,i) => <span key={i} className="moon-badge" style={{ background:theme.accent+'18', borderColor:theme.accent+'44', color:theme.accent }}>{b}</span>)}
          </div>
        )}

        {myProfile.interests?.length > 0 && (
          <div className="moon-interests">
            {myProfile.interests.map((tag,i) => <span key={i} className="moon-interest" style={{ background:theme.card, borderColor:theme.accent+'33', color:theme.text+'cc' }}>{tag}</span>)}
          </div>
        )}

        {/* profile music */}
        <div style={{ marginTop:12 }}>
          <MusicPlayer url={myProfile.profileMusicUrl} name={myProfile.currentSong} />
          <button onClick={() => musicRef.current.click()}
            style={{ width:'100%', marginTop:8, padding:'8px', borderRadius:10, border:'1px dashed rgba(192,132,252,.3)', background:'transparent', color:'rgba(192,132,252,.7)', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', transition:'all .15s' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(192,132,252,.6)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(192,132,252,.3)'}>
            {uploadingMusic ? '⏳ uploading...' : `🎵 ${myProfile.profileMusicUrl ? 'change' : 'add'} profile song`}
          </button>
          <input ref={musicRef} type="file" accept="audio/*" style={{ display:'none' }} onChange={handleMusic} />
        </div>

        {myProfile.aboutSections?.map((sec,i) => (
          <div key={i} className="moon-about-section" style={{ background:theme.accent+'0d', borderColor:theme.accent+'22' }}>
            <div className="moon-about-title" style={{ color:theme.accent }}>{sec.title}</div>
            <div className="moon-about-text" style={{ color:theme.text+'cc' }}>{sec.text}</div>
          </div>
        ))}

        {/* custom HTML section */}
        {myProfile.customHtml && (
          <div style={{ marginTop:14, padding:14, borderRadius:13, border:`1px solid ${theme.accent}33`, background:theme.accent+'08', overflow:'hidden' }}>
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:1, textTransform:'uppercase', color:theme.accent, marginBottom:8 }}>✦ custom section</div>
            <div dangerouslySetInnerHTML={{ __html: myProfile.customHtml }} />
          </div>
        )}
      </div>

      {/* tabs + posts */}
      <div style={{ padding:'0 24px 24px' }}>
        <div className="tabs-row" style={{ background:theme.card, borderColor:theme.accent+'22' }}>
          {[['posts','✦ my posts'],['media','🖼️ media'],['liked','♥ liked']].map(([k,l]) => (
            <button key={k} className={`tab-btn ${activeTab===k?'active':''}`}
              style={activeTab===k?{background:theme.accent+'22',color:theme.text}:{color:theme.text+'77'}}
              onClick={() => setActiveTab(k)}>{l}</button>
          ))}
        </div>

        {activeTab==='posts' && (
          myPosts.length===0
            ? <div className="empty-state" style={{ color:theme.text+'77' }}><div className="empty-icon">🌙</div>no posts yet!</div>
            : myPosts.map(p => <PostCard key={p.id} post={p} />)
        )}
        {activeTab==='media' && (() => {
          const mp = myPosts.filter(p=>p.media)
          return mp.length===0
            ? <div className="empty-state" style={{ color:theme.text+'77' }}><div className="empty-icon">🖼️</div>no media yet</div>
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {mp.map(p=>(
                  <div key={p.id} style={{ aspectRatio:'1', overflow:'hidden', borderRadius:10, background:'rgba(255,255,255,.05)' }}>
                    {p.mediaType==='image'
                      ? <img src={p.media} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <video src={p.media} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                  </div>
                ))}
              </div>
        })()}
        {activeTab==='liked' && <div className="empty-state" style={{ color:theme.text+'77' }}><div className="empty-icon">♡</div>posts you ♥ appear here</div>}
      </div>

      {editing && <ProfileEditor onSave={handleSave} onClose={() => setEditing(false)} />}
    </div>
  )
}
