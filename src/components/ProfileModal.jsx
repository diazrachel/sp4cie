import React from 'react'
import { useApp } from '../context/AppContext.jsx'
import { PROFILE_THEMES, PROFILE_FONTS } from '../data.js'

export default function ProfileModal({ user, onClose }) {
  const { following, followers, friends, toggleFollow, posts, openFriendDM } = useApp()
  if (!user) return null

  const isFollowing = following.has(user.id)
  const isFriend    = friends.has(user.id)
  const theyFollowMe = followers.has(user.id)
  const userPosts   = posts.filter(p => p.authorId === user.id)
  const theme       = PROFILE_THEMES[user.profileTheme] || PROFILE_THEMES.lunar
  const font        = PROFILE_FONTS[user.profileFont]   || PROFILE_FONTS.sans

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{ background: theme.bg, fontFamily: font.family, maxWidth: 560, width:'95vw' }}
      >
        {/* inject custom CSS if they have it */}
        {user.customCss && <style>{user.customCss.replace(/<[^>]*>/g,'')}</style>}

        {/* Banner */}
        <div style={{ height: 140, position:'relative', borderRadius:'22px 22px 0 0', overflow:'hidden', background: user.bannerUrl ? 'transparent' : user.bannerBg }}>
          {user.bannerUrl && <img src={user.bannerUrl} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
          <button
            onClick={onClose}
            style={{ position:'absolute', top:12, right:12, width:32, height:32, borderRadius:'50%', border:'none', background:'rgba(0,0,0,.5)', color:'white', cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}
          >✕</button>
        </div>

        <div style={{ padding:'0 22px 24px', background: theme.card, backdropFilter:'blur(10px)' }}>
          {/* avatar row */}
          <div style={{ display:'flex', alignItems:'flex-end', gap:14, marginTop:-36, marginBottom:14 }}>
            <div style={{ width:76, height:76, borderRadius:'50%', background:user.avatarBg, border:`4px solid ${theme.bg}`, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0, boxShadow:'0 4px 20px rgba(0,0,0,.4)' }}>
              {user.profilePicUrl
                ? <img src={user.profilePicUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                : user.avatar}
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
              {isFriend && (
                <button onClick={() => { openFriendDM(user.id); onClose() }}
                  style={{ padding:'8px 16px', borderRadius:12, border:`1px solid ${theme.accent}44`, background:theme.accent+'18', color:theme.accent, fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13.5, cursor:'pointer' }}>
                  💬 message
                </button>
              )}
              <button onClick={() => toggleFollow(user.id)}
                style={isFollowing
                  ? { padding:'8px 18px', borderRadius:12, border:'1px solid rgba(255,255,255,.15)', background:'rgba(255,255,255,.08)', color:theme.text, fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13.5, cursor:'pointer' }
                  : { padding:'8px 18px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#c084fc,#f472b6)', color:'white', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13.5, cursor:'pointer', boxShadow:'0 3px 14px rgba(192,132,252,.4)' }}>
                {isFollowing ? '✓ following' : '+ follow'}
              </button>
            </div>
          </div>

          {/* relationship badges */}
          {(isFriend || theyFollowMe) && (
            <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:10 }}>
              {isFriend && <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, background:theme.accent+'18', color:theme.accent, border:`1px solid ${theme.accent}33` }}>💫 friends</span>}
              {theyFollowMe && !isFriend && <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, background:'rgba(253,230,138,.1)', color:'#fde68a', border:'1px solid rgba(253,230,138,.25)' }}>🌟 stars you</span>}
            </div>
          )}

          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:theme.text }}>{user.name}</div>
          <div style={{ fontSize:13, color:theme.text+'88', fontWeight:600, marginBottom:6 }}>{user.handle}</div>
          {user.mood && <div style={{ display:'inline-block', padding:'4px 13px', borderRadius:20, fontSize:12, fontWeight:700, background:theme.accent+'22', color:theme.accent, marginBottom:10 }}>{user.mood}</div>}
          <div style={{ fontSize:14.5, fontWeight:500, lineHeight:1.65, fontStyle:'italic', color:theme.text+'cc', marginBottom:14 }}>{user.bio || 'no bio yet ☁️'}</div>

          {/* stats */}
          <div style={{ display:'flex', gap:24, marginBottom:14 }}>
            {[
              { val: user.followers+(isFollowing?1:0), label:'stars' },
              { val: user.following, label:'following' },
              { val: userPosts.length, label:'posts' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:theme.text }}>{s.val}</div>
                <div style={{ fontSize:11, color:theme.text+'77', fontWeight:700, textTransform:'uppercase', letterSpacing:.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* badges */}
          {user.badges?.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
              {user.badges.map((b,i) => <span key={i} style={{ padding:'4px 11px', borderRadius:20, fontSize:12, fontWeight:700, background:theme.accent+'12', color:theme.accent, border:`1px solid ${theme.accent}22` }}>{b}</span>)}
            </div>
          )}

          {/* interests */}
          {user.interests?.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
              {user.interests.map((t,i) => <span key={i} style={{ padding:'5px 13px', borderRadius:20, fontSize:12.5, fontWeight:700, background:theme.card, color:theme.text+'cc', border:`1px solid ${theme.accent}22` }}>{t}</span>)}
            </div>
          )}

          {/* profile music */}
          {user.profileMusicUrl && <MiniMusicPlayer url={user.profileMusicUrl} name={user.currentSong} accent={theme.accent} />}

          {/* about sections */}
          {user.aboutSections?.map((sec,i) => (
            <div key={i} style={{ padding:'12px 14px', borderRadius:12, border:`1px solid ${theme.accent}22`, background:theme.accent+'0d', marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:1, textTransform:'uppercase', color:theme.accent, marginBottom:5 }}>{sec.title}</div>
              <div style={{ fontSize:14, fontWeight:500, color:theme.text+'cc', lineHeight:1.6 }}>{sec.text}</div>
            </div>
          ))}

          {/* custom HTML */}
          {user.customHtml && (
            <div style={{ padding:14, borderRadius:12, border:`1px solid ${theme.accent}22`, background:theme.accent+'08', marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:1, textTransform:'uppercase', color:theme.accent, marginBottom:8 }}>✦ custom section</div>
              <div dangerouslySetInnerHTML={{ __html: user.customHtml }} />
            </div>
          )}

          {/* recent posts */}
          {userPosts.length > 0 && (
            <>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', color:theme.text+'66', marginBottom:10, marginTop:4 }}>recent posts</div>
              {userPosts.slice(0,3).map(p => (
                <div key={p.id} style={{ padding:12, borderRadius:12, border:`1px solid ${theme.accent}18`, background:'rgba(255,255,255,.03)', marginBottom:8, fontSize:13.5, fontWeight:500, color:theme.text+'cc', lineHeight:1.5 }}>
                  {p.body}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function MiniMusicPlayer({ url, name, accent }) {
  const [playing, setPlaying] = React.useState(false)
  const [volume, setVolume]   = React.useState(0.5)
  const audioRef = React.useRef(null)
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
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:12, background:'rgba(255,255,255,.05)', border:`1px solid ${accent}22`, marginBottom:14 }}>
      <audio ref={audioRef} src={url} onEnded={()=>setPlaying(false)} />
      <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${accent},#f472b6)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer', flexShrink:0, animation:playing?'spin 3s linear infinite':'none', boxShadow:`0 2px 12px ${accent}44` }} onClick={toggle}>🎵</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700, color:accent, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name||'profile song'}</div>
        <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{playing?'now playing ♪':'tap to play'}</div>
      </div>
      <input type="range" min="0" max="1" step="0.05" value={volume} onChange={changeVolume}
        style={{ width:60, accentColor:accent, cursor:'pointer' }} title="volume" />
      <button onClick={toggle} style={{ width:32, height:32, borderRadius:'50%', border:'none', background:`linear-gradient(135deg,${accent},#f472b6)`, color:'white', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {playing?'⏸':'▶'}
      </button>
    </div>
  )
}
