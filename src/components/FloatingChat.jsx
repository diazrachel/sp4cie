import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function FloatingChat({ chatId, onClose }) {
  const { friendChats, sendFriendMessage, getUserById, myProfile, leaveFriendChat } = useApp()
  const chat = friendChats.find(c => c.id === chatId)
  const [draft, setDraft] = useState('')
  const [minimized, setMinimized] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (!minimized) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages, minimized])

  if (!chat) return null

  const otherUser = chat.isDM ? getUserById(chat.members[0]) : null
  const chatName  = chat.isDM ? (otherUser?.name || 'friend') : chat.name

  function handleSend() {
    if (!draft.trim()) return
    sendFriendMessage(chatId, draft.trim())
    setDraft('')
  }

  const avi = (u) => u?.profilePicUrl
    ? <img src={u.profilePicUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
    : u?.avatar

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      right: 20,
      width: minimized ? 240 : 320,
      zIndex: 500,
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,.6), 0 0 30px rgba(192,132,252,.2)',
      border: '1px solid rgba(192,132,252,.25)',
      background: '#12103a',
      transition: 'width .2s',
    }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
        background: 'linear-gradient(135deg,rgba(192,132,252,.2),rgba(244,114,182,.15))',
        borderBottom: minimized ? 'none' : '1px solid rgba(255,255,255,.07)',
        cursor: 'pointer',
      }} onClick={() => setMinimized(m => !m)}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:otherUser?.avatarBg||'linear-gradient(135deg,#c084fc,#f472b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, overflow:'hidden', flexShrink:0, border:'2px solid rgba(192,132,252,.4)' }}>
          {avi(otherUser)}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{chatName}</div>
          {otherUser && <div style={{ fontSize:11, color:'rgba(192,132,252,.8)', fontWeight:600 }}>{otherUser.isOnline ? '🟢 online' : '⚫ offline'}</div>}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          <button onClick={e => { e.stopPropagation(); setMinimized(m=>!m) }}
            style={{ background:'rgba(255,255,255,.08)', border:'none', borderRadius:'50%', width:26, height:26, color:'var(--text2)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {minimized ? '▲' : '▼'}
          </button>
          <button onClick={e => { e.stopPropagation(); onClose() }}
            style={{ background:'rgba(255,100,100,.15)', border:'none', borderRadius:'50%', width:26, height:26, color:'#fb7185', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' }}>
            ✕
          </button>
        </div>
      </div>

      {/* messages */}
      {!minimized && (
        <>
          <div style={{ height:240, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:8 }}>
            {chat.messages.length === 0 && (
              <div style={{ textAlign:'center', color:'var(--muted)', fontSize:13, fontWeight:600, padding:'24px 0' }}>
                {otherUser?.avatar || '🌙'}<br />
                <span style={{ marginTop:8, display:'block' }}>say hi to {chatName} ☁️</span>
              </div>
            )}
            {chat.messages.map(msg => {
              const isMe = msg.userId === myProfile?.id
              const user = isMe ? myProfile : getUserById(msg.userId)
              return (
                <div key={msg.id} style={{ display:'flex', gap:7, alignItems:'flex-end', flexDirection:isMe?'row-reverse':'row', animation:'fadeUp .2s ease' }}>
                  <div style={{ width:24, height:24, borderRadius:'50%', background:user?.avatarBg||'var(--cloud-soft)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, flexShrink:0, overflow:'hidden' }}>
                    {avi(user)}
                  </div>
                  <div style={{ maxWidth:'78%' }}>
                    <div style={{
                      padding:'8px 12px', borderRadius:14, fontSize:13.5, fontWeight:500, lineHeight:1.4,
                      background: isMe ? 'linear-gradient(135deg,rgba(192,132,252,.35),rgba(244,114,182,.25))' : 'rgba(255,255,255,.07)',
                      border: `1px solid ${isMe ? 'rgba(192,132,252,.3)' : 'rgba(255,255,255,.06)'}`,
                      color: 'var(--text)',
                    }}>{msg.text}</div>
                    <div style={{ fontSize:10, color:'var(--muted)', marginTop:2, textAlign:isMe?'right':'left' }}>{msg.time}</div>
                  </div>
                </div>
              )
            })}
            <div ref={endRef} />
          </div>

          {/* input */}
          <div style={{ display:'flex', gap:8, padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,.06)', background:'rgba(0,0,0,.2)' }}>
            <input
              style={{ flex:1, padding:'9px 13px', borderRadius:20, border:'1px solid rgba(192,132,252,.2)', background:'rgba(255,255,255,.06)', fontFamily:"'Space Grotesk',sans-serif", fontSize:13.5, color:'var(--text)', outline:'none' }}
              placeholder={`message ${chatName}... ☁️`}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}
              style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'linear-gradient(135deg,#c084fc,#f472b6)', color:'white', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 2px 10px rgba(192,132,252,.4)' }}>
              →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
