import { useApp } from "../context/AppContext";
import { useState, useRef, useEffect } from "react";

export default function RightPanel() {
  const {
    myProfile, myStarCount, myFollowingCount, myFriendCount,
    chatMessages, sendChat, users, getUserById,
    following, followers, friends,
    toggleFollow, setProfileModal, setTab,
    openFriendDM, setActiveFriendChat,
  } = useApp();

  const [chatDraft, setChatDraft] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMessages]);

  function handleSend() {
    if (!chatDraft.trim()) return;
    sendChat(chatDraft.trim());
    setChatDraft("");
  }

  const suggestions = users.filter(u => !following.has(u.id)).slice(0, 3);
  const friendList  = users.filter(u => friends.has(u.id));

  return (
    <aside className="right-panel">

      {/* My mini card */}
      <div className="me-card">
        <div className="me-avi-wrap">
          <div className="avi-ring" />
          <div className="me-avi" style={{ background: myProfile.avatarBg }}>{myProfile.avatar}</div>
        </div>
        <div className="me-name">{myProfile.name}</div>
        <div className="me-handle">{myProfile.handle}</div>
        <div className="me-mood">{myProfile.mood}</div>
        <div className="me-stats">
          <div>
            <div className="me-stat-num">{myStarCount}</div>
            <div className="me-stat-label">stars</div>
          </div>
          <div>
            <div className="me-stat-num">{myFollowingCount}</div>
            <div className="me-stat-label">following</div>
          </div>
          <div>
            <div className="me-stat-num">{myFriendCount}</div>
            <div className="me-stat-label">friends</div>
          </div>
        </div>
      </div>

      {/* Friends list */}
      {friendList.length > 0 && (
        <div>
          <div className="widget-title">
            🌟 friends ({friendList.length})
            <button
              onClick={() => setTab("friends")}
              style={{ marginLeft:"auto", fontSize:11.5, fontWeight:700, background:"none", border:"none", cursor:"pointer", color:"var(--accent)" }}
            >
              all →
            </button>
          </div>
          {friendList.slice(0, 4).map(u => (
            <div key={u.id}
              style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9, cursor:"pointer", padding:"5px 4px", borderRadius:10, transition:"background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background="var(--cloud-soft)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <div style={{ position:"relative" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:u.avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}
                  onClick={() => setProfileModal(u)}>
                  {u.avatar}
                </div>
                <div style={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", background: u.isOnline ? "#4ade80" : "var(--muted)", border:"2px solid var(--space)" }} />
              </div>
              <div style={{ flex:1, minWidth:0 }} onClick={() => setProfileModal(u)}>
                <div style={{ fontWeight:700, fontSize:13, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{u.name.split(" ")[0]}</div>
                <div style={{ fontSize:11, color:"var(--muted)", fontWeight:600 }}>{u.mood}</div>
              </div>
              <button
                title="open chat"
                onClick={() => { openFriendDM(u.id); setTab("friends"); }}
                style={{ padding:"5px 9px", borderRadius:9, border:"1px solid rgba(192,132,252,.2)", background:"rgba(192,132,252,.08)", color:"var(--accent)", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", flexShrink:0 }}
              >
                💬
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mini Cloud Nine */}
      <div>
        <div className="widget-title">
          ☁️ cloud nine
          <button onClick={() => setTab("chat")} style={{ marginLeft:"auto", fontSize:11.5, fontWeight:700, background:"none", border:"none", cursor:"pointer", color:"var(--accent)" }}>
            open →
          </button>
        </div>
        <div className="mini-chat">
          <div className="mini-chat-msgs">
            {chatMessages.slice(-5).map(msg => {
              const isMe = msg.userId === "me";
              const user = isMe ? myProfile : getUserById(msg.userId);
              return (
                <div key={msg.id} className={`mini-chat-row ${isMe ? "mine" : ""}`}>
                  <div className="mini-chat-avi" style={{ background: user?.avatarBg }}>{user?.avatar}</div>
                  <div className="mini-bubble">{msg.text}</div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <div className="mini-chat-input-row">
            <input className="mini-chat-input" placeholder="float something ☁️"
              value={chatDraft} onChange={e => setChatDraft(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()} />
            <button className="mini-chat-send" onClick={handleSend}>→</button>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <div className="widget-title">✦ orbits to discover</div>
          {suggestions.map(u => (
            <div key={u.id}
              style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10, cursor:"pointer", padding:"6px 4px", borderRadius:10, transition:"background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background="var(--cloud-soft)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
              onClick={() => setProfileModal(u)}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:u.avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{u.avatar}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", color:"var(--text)" }}>{u.name}</div>
                <div style={{ fontSize:11.5, color:"var(--muted)", fontWeight:600 }}>{u.handle}</div>
              </div>
              <button
                style={{ padding:"5px 11px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#c084fc,#f472b6)", color:"white", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", flexShrink:0 }}
                onClick={e => { e.stopPropagation(); toggleFollow(u.id); }}>+</button>
            </div>
          ))}
        </div>
      )}

      {/* Trending vibes */}
      <div>
        <div className="widget-title">🌌 trending vibes</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {["#sp4cie","#cloudMind","#softLife","#nightOwl","#cottagecore","#cloudNine","#orbitFeed","#spaceCore","#lunarAesthetic","#cosmicDreamer"].map(t => (
            <span key={t} className="vibe-tag">{t}</span>
          ))}
        </div>
      </div>

    </aside>
  );
}
