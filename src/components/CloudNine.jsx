import { useApp } from '../context/AppContext.jsx'
import { useState, useRef, useEffect } from 'react'

// Each message gets random drift params so they feel like individual clouds
function CloudMessage({ msg, index, total, myProfile, getUserById }) {
  const isMe   = msg.userId === myProfile?.id
  const user   = isMe ? myProfile : getUserById(msg.userId)
  const age    = total - index // how old (0 = newest)
  // older messages fade out more
  const opacity = Math.max(0.15, 1 - age * 0.08)
  // random horizontal offset so messages drift to different positions
  const drift   = ((index * 47) % 60) - 30 // -30 to +30px
  const delay   = (index % 5) * 0.3

  return (
    <div
      className={`cn-msg ${isMe?'mine':''}`}
      style={{
        opacity,
        transform: `translateX(${isMe ? -drift : drift}px)`,
        transition: 'opacity 2s ease, transform 1s ease',
        animation: `cloudFloat 0.6s cubic-bezier(.34,1.56,.64,1) ${delay}s both`,
        filter: age > 8 ? `blur(${(age-8)*0.4}px)` : 'none',
      }}
    >
      <div className="cn-avi" style={{ background:user?.avatarBg||'var(--cloud-soft)', overflow:'hidden' }}>
        {user?.profilePicUrl
          ? <img src={user.profilePicUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
          : (user?.avatar||'☁️')}
      </div>
      <div className="cn-bubble-wrap">
        <div className="cn-name">{isMe?'you':user?.name?.split(' ')[0]}</div>
        <div className="cn-bubble" style={{
          // older messages look more cloud-like (puffier, more transparent)
          background: isMe
            ? `linear-gradient(135deg,rgba(192,132,252,${Math.max(0.1,0.3-age*0.02)}),rgba(244,114,182,${Math.max(0.08,0.2-age*0.015)}))`
            : `rgba(255,255,255,${Math.max(0.03,0.09-age*0.006)})`,
          borderColor: `rgba(255,255,255,${Math.max(0.03,0.1-age*0.007)})`,
          backdropFilter: `blur(${Math.min(12, 4+age)}px)`,
        }}>
          {msg.text}
        </div>
        <div className="cn-time" style={{ opacity: Math.max(0, 1-age*0.15) }}>{msg.time}</div>
      </div>
    </div>
  )
}

export default function CloudNine() {
  const { chatMessages, sendChat, users, getUserById, myProfile } = useApp()
  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [chatMessages])

  function handleSend() {
    if (!draft.trim()) return
    sendChat(draft.trim())
    setDraft('')
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">cloud nine ☁️</div>
        <span style={{ fontSize:12.5, color:'var(--muted)', fontWeight:600 }}>messages drift & dissolve like real clouds</span>
      </div>

      <div className="cloud-nine-shell">
        <div className="cloud-nine-bg" />

        {/* drifting background clouds for atmosphere */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          {[...Array(5)].map((_,i) => (
            <div key={i} style={{
              position:'absolute',
              width: 80+i*40, height: 30+i*12,
              background: `rgba(255,255,255,${0.02+i*0.008})`,
              borderRadius: 50,
              top: `${15+i*16}%`,
              animation: `driftL ${40+i*15}s linear infinite`,
              animationDelay: `${-i*8}s`,
              filter: 'blur(6px)',
            }} />
          ))}
        </div>

        <div className="cloud-nine-header">
          <div style={{ fontSize:28 }}>☁️</div>
          <div>
            <div className="cloud-nine-title">cloud nine</div>
            <div className="cloud-nine-sub">
              {users.length+1} members · messages drift away like clouds ✨
            </div>
          </div>
          <div className="cn-members">
            {[myProfile,...users].slice(0,6).map(u => (
              <div key={u.id} className="cn-member-avi" style={{ background:u.avatarBg, overflow:'hidden' }} title={u.name}>
                {u.profilePicUrl
                  ? <img src={u.profilePicUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                  : u.avatar}
              </div>
            ))}
          </div>
        </div>

        <div className="cloud-nine-msgs" style={{ position:'relative', zIndex:2 }}>
          <div style={{ textAlign:'center', padding:'10px 16px', borderRadius:12, background:'rgba(192,132,252,.06)', border:'1px solid rgba(192,132,252,.1)', fontSize:12.5, color:'var(--muted)', fontWeight:600, marginBottom:4 }}>
            ☁️ messages float up and dissolve into the sky over time — only the newest stay clear ✨
          </div>

          {chatMessages.map((msg, idx) => (
            <CloudMessage
              key={msg.id}
              msg={msg}
              index={idx}
              total={chatMessages.length - 1}
              myProfile={myProfile}
              getUserById={getUserById}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="cloud-nine-footer">
          <input className="cn-input" placeholder="float something into the sky... ☁️"
            value={draft} onChange={e=>setDraft(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleSend()} />
          <button className="cn-send" onClick={handleSend}>→</button>
        </div>
      </div>
    </div>
  )
}
