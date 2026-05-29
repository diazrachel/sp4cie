import { useApp } from "../context/AppContext";
import { useState } from "react";

export default function Discover() {
  const { users, following, toggleFollow, setProfileModal, posts } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const match = u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q) || u.bio.toLowerCase().includes(q);
    if (filter === "following") return match && following.has(u.id);
    if (filter === "online")    return match && u.isOnline;
    return match;
  });

  function postCount(uid) { return posts.filter(p => p.authorId === uid).length; }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">discover 🌌</div>
      </div>

      <input className="search-input"
        placeholder="🌌 search by name, handle, or vibe..."
        value={search} onChange={e => setSearch(e.target.value)} />

      <div className="tabs-row">
        {[
          { key:"all",       label:"✦ everyone" },
          { key:"online",    label:"🟢 online" },
          { key:"following", label:"🌙 following" },
        ].map(f => (
          <button key={f.key} className={`tab-btn ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌌</div>
          <div style={{ fontWeight:700, marginBottom:8 }}>no one else here yet</div>
          <div style={{ fontSize:13.5, color:"var(--muted)", fontWeight:500 }}>
            invite your friends to join sp4cie and they'll show up here ✦
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌌</div>
          no orbits found matching that vibe
        </div>
      ) : (
        <div className="discover-grid">
          {filtered.map(u => (
            <div key={u.id} className="disc-card" onClick={() => setProfileModal(u)}>
              <div className="disc-banner" style={{ background:u.bannerBg }} />
              <div className="disc-body">
                <div className="disc-avi" style={{ background:u.avatarBg }}>{u.avatar}</div>
                <div className="disc-name">{u.name}</div>
                <div className="disc-handle">{u.handle}</div>
                <div className="disc-bio">{u.bio.slice(0,70)}{u.bio.length>70?"…":""}</div>
                <div style={{ display:"flex", gap:14, justifyContent:"center", marginBottom:10 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontWeight:800, fontSize:13.5, color:"var(--text)" }}>{u.followers+(following.has(u.id)?1:0)}</div>
                    <div style={{ fontSize:10, color:"var(--muted)", fontWeight:700, textTransform:"uppercase" }}>stars</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontWeight:800, fontSize:13.5, color:"var(--text)" }}>{postCount(u.id)}</div>
                    <div style={{ fontSize:10, color:"var(--muted)", fontWeight:700, textTransform:"uppercase" }}>posts</div>
                  </div>
                </div>
                {u.badges?.slice(0,2).map((b,i) => (
                  <span key={i} style={{ fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20, background:"rgba(192,132,252,.1)", color:"var(--accent)", border:"1px solid rgba(192,132,252,.2)", display:"inline-block", margin:"0 3px 6px" }}>{b}</span>
                ))}
                <button className="disc-follow-btn"
                  style={following.has(u.id)
                    ? { background:"rgba(255,255,255,.08)", color:"var(--text2)" }
                    : { background:"linear-gradient(135deg,#c084fc,#f472b6)", color:"white", boxShadow:"0 2px 12px rgba(192,132,252,.4)" }}
                  onClick={e => { e.stopPropagation(); toggleFollow(u.id); }}>
                  {following.has(u.id) ? "✓ following" : "+ follow"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
