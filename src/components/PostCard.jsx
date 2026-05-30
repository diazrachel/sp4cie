import { useApp } from '../context/AppContext.jsx'
import { useState, useRef, useEffect } from 'react'

export default function PostCard({ post }) {
  const { getUserById, toggleLike, likedPosts, toggleBoost, boostedPosts, addComment, setProfileModal, deletePost, myProfile, formatTime } = useApp()
  const author  = post.authorId === myProfile?.id ? myProfile : (post.author || getUserById(post.authorId))
  const liked   = likedPosts.has(post.id)
  const boosted = boostedPosts.has(post.id)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText]   = useState('')
  const [menuOpen, setMenuOpen]         = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const menuRef  = useRef(null)
  const audioRef = useRef(null)
  const isOwn    = post.authorId === myProfile?.id

  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (!author) return null

  function submitComment() {
    if (!commentText.trim()) return
    addComment(post.id, commentText.trim())
    setCommentText('')
    setShowComments(true)
  }

  function toggleAudio() {
    if (!audioRef.current) return
    if (audioPlaying) { audioRef.current.pause(); setAudioPlaying(false) }
    else { audioRef.current.play(); setAudioPlaying(true) }
  }

  function renderBody(text) {
    return text.split(/(\s+)/).map((w,i) =>
      w.startsWith('#') ? <span key={i} className="post-tag">{w}</span> : w
    )
  }

  const avatarEl = author.profilePicUrl
    ? <img src={author.profilePicUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
    : author.avatar

  return (
    <article className="post">
      <div className="post-header">
        <div className="post-avi" style={{ background:author.avatarBg, overflow:'hidden' }}
          onClick={() => post.authorId !== myProfile?.id && setProfileModal(author)}>
          {avatarEl}
        </div>
        <div className="post-meta">
          <div className="post-name" onClick={() => post.authorId !== myProfile?.id && setProfileModal(author)}>{author.name}</div>
          <div className="post-handle">{author.handle}</div>
        </div>
        <div className="post-time">{formatTime(post.createdAt)}</div>
        {isOwn && (
          <div className="post-menu" ref={menuRef}>
            <button className="post-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>···</button>
            {menuOpen && (
              <div className="post-menu-dd">
                <button className="danger" onClick={() => { deletePost(post.id); setMenuOpen(false) }}>🗑️ delete</button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.mood && (
        <div className="post-mood-badge" style={{ background:post.mood.bg+'22', color:post.mood.color }}>
          {post.mood.label}
        </div>
      )}

      {post.body && <div className="post-body">{renderBody(post.body)}</div>}

      {post.media && post.mediaType==='image' && <img className="post-media" src={post.media} alt="post" />}
      {post.media && post.mediaType==='video' && <video className="post-video" src={post.media} controls />}

      {/* audio player */}
      {post.audioUrl && (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:12, background:'rgba(192,132,252,.08)', border:'1px solid rgba(192,132,252,.2)', marginBottom:12 }}>
          <audio ref={audioRef} src={post.audioUrl} onEnded={() => setAudioPlaying(false)} />
          <button onClick={toggleAudio} style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'linear-gradient(135deg,#c084fc,#f472b6)', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0, boxShadow:'0 2px 10px rgba(192,132,252,.4)' }}>
            {audioPlaying ? '⏸' : '▶'}
          </button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:'var(--accent)' }}>🎵 audio</div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>tap to {audioPlaying?'pause':'play'}</div>
          </div>
          {audioPlaying && (
            <div style={{ display:'flex', gap:2, alignItems:'flex-end', height:20 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ width:3, borderRadius:2, background:'var(--accent)', animation:`audioBar${i} .6s ease-in-out infinite alternate`, height: 8+i*3 }} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="post-actions">
        <button className={`act-btn ${liked?'liked':''}`} onClick={() => toggleLike(post.id)}>
          {liked?'♥':'♡'} {post.likes}
        </button>
        <button className="act-btn" onClick={() => setShowComments(!showComments)}>
          💬 {post.comments.length > 0 ? post.comments.length : 'reply'}
        </button>
        <button className={`act-btn ${boosted?'boosted':''}`} onClick={() => toggleBoost(post.id)}>
          ✦ {boosted?'boosted':'boost'} {post.boosts > 0 ? post.boosts : ''}
        </button>
      </div>

      {showComments && (
        <div className="comments-area">
          {post.comments.map(c => {
            const cu = c.userId === myProfile?.id ? myProfile : getUserById(c.userId)
            return (
              <div key={c.id} className="comment">
                <div className="comment-avi" style={{ background:cu?.avatarBg||'var(--cloud-soft)', overflow:'hidden' }}>
                  {cu?.profilePicUrl ? <img src={cu.profilePicUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} /> : cu?.avatar||'✦'}
                </div>
                <div className="comment-bubble">
                  <div className="comment-author">{cu?.name||'you'}</div>
                  <div className="comment-text">{c.text}</div>
                </div>
              </div>
            )
          })}
          <div className="comment-input-row">
            <input className="comment-input" placeholder="float a reply ☁️"
              value={commentText} onChange={e=>setCommentText(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&submitComment()} />
            <button className="comment-send" onClick={submitComment}>send ✦</button>
          </div>
        </div>
      )}
    </article>
  )
}
