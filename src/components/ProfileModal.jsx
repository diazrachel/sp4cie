import { useApp } from "../context/AppContext";
import { PROFILE_THEMES } from "../data.js";

export default function ProfileModal({ user, onClose }) {
  const { following, followers, friends, toggleFollow, posts, openFriendDM, setTab } = useApp();
  if (!user) return null;

  const isFollowing = following.has(user.id);
  const isFriend    = friends.has(user.id);
  const theyFollowMe = followers.has(user.id);
  const userPosts   = posts.filter(p => p.authorId === user.id);
  const postCount   = userPosts.length;
  const theme       = PROFILE_THEMES[user.profileTheme] || PROFILE_THEMES.lunar;

  function handleFollow() { toggleFollow(user.id); }
  function handleMessage() {
    openFriendDM(user.id);
    setTab("friends");
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-banner" style={{ background: user.bannerBg }}>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-avi-row">
            <div className="modal-avi" style={{ background: user.avatarBg }}>{user.avatar}</div>
            <div style={{ marginLeft:"auto", display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
              {isFriend && (
                <button onClick={handleMessage}
                  style={{ padding:"8px 16px", borderRadius:12, border:"1px solid rgba(192,132,252,.3)", background:"rgba(192,132,252,.1)", color:"var(--accent)", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13.5, cursor:"pointer" }}>
                  💬 message
                </button>
              )}
              <button className="modal-follow-btn" onClick={handleFollow}
                style={isFollowing
                  ? { background:"rgba(255,255,255,.08)", color:"var(--text2)" }
                  : { background:"linear-gradient(135deg,#c084fc,#f472b6)", color:"white", boxShadow:"0 3px 14px rgba(192,132,252,.4)" }}>
                {isFollowing ? "✓ following" : "+ follow"}
              </button>
            </div>
          </div>

          {/* friend/follower status badge */}
          {(isFriend || theyFollowMe) && (
            <div style={{ marginBottom:10, display:"flex", gap:7, flexWrap:"wrap" }}>
              {isFriend && (
                <span style={{ padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700, background:"rgba(192,132,252,.12)", color:"var(--accent)", border:"1px solid rgba(192,132,252,.25)" }}>
                  💫 friends
                </span>
              )}
              {theyFollowMe && !isFriend && (
                <span style={{ padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700, background:"rgba(253,230,138,.1)", color:"#fde68a", border:"1px solid rgba(253,230,138,.25)" }}>
                  🌟 stars you
                </span>
              )}
            </div>
          )}

          <div className="modal-name">{user.name}</div>
          <div className="modal-handle">{user.handle}</div>
          {user.mood && <div style={{ fontSize:12.5, fontWeight:700, color:"var(--accent)", marginBottom:7 }}>{user.mood}</div>}
          <div className="modal-bio">{user.bio || "no bio ☁️"}</div>

          <div className="modal-stats">
            {[
              { val: user.followers + (isFollowing ? 1 : 0), label:"stars" },
              { val: user.following, label:"following" },
              { val: postCount, label:"posts" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"var(--text)" }}>{s.val}</div>
                <div style={{ fontSize:11, color:"var(--muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {user.badges?.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
              {user.badges.map((b,i) => (
                <span key={i} style={{ padding:"4px 11px", borderRadius:20, fontSize:12, fontWeight:700, background:"rgba(192,132,252,.1)", color:"var(--accent)", border:"1px solid rgba(192,132,252,.2)" }}>{b}</span>
              ))}
            </div>
          )}

          {user.interests?.length > 0 && (
            <div className="modal-interests">
              {user.interests.map((t,i) => (
                <span key={i} style={{ padding:"4px 12px", borderRadius:20, fontSize:12.5, fontWeight:700, background:"rgba(255,255,255,.05)", color:"var(--text2)", border:"1px solid var(--border)" }}>{t}</span>
              ))}
            </div>
          )}

          {user.aboutSections?.map((sec,i) => (
            <div key={i} style={{ padding:"10px 13px", borderRadius:11, border:"1px solid var(--border)", background:"rgba(255,255,255,.03)", marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:1, textTransform:"uppercase", color:"var(--accent)", marginBottom:4 }}>{sec.title}</div>
              <div style={{ fontSize:13.5, fontWeight:500, color:"var(--text2)", lineHeight:1.55 }}>{sec.text}</div>
            </div>
          ))}

          {userPosts.length > 0 && (
            <>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", color:"var(--muted)", marginBottom:10, marginTop:4 }}>
                recent posts ({postCount})
              </div>
              {userPosts.slice(0,3).map(p => (
                <div key={p.id} className="modal-mini-post">{p.body}</div>
              ))}
            </>
          )}

          {user.website && (
            <div style={{ marginTop:12, fontSize:13, fontWeight:700, color:"var(--accent)" }}>🔗 {user.website}</div>
          )}
        </div>
      </div>
    </div>
  );
}
