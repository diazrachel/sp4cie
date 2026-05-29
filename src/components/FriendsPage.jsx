import { useApp } from "../context/AppContext";
import { useState, useRef, useEffect } from "react";

function ChatWindow({ chat, onClose }) {
  const { getUserById, myProfile, sendFriendMessage, leaveFriendChat } = useApp();
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chat?.messages]);

  if (!chat) return null;

  const otherUser = chat.isDM ? getUserById(chat.members[0]) : null;
  const chatName  = chat.isDM
    ? (otherUser?.name || "friend")
    : chat.name;

  function handleSend() {
    if (!draft.trim()) return;
    sendFriendMessage(chat.id, draft.trim());
    setDraft("");
  }

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      background:"rgba(7,5,20,.95)", border:"1px solid rgba(192,132,252,.2)",
      borderRadius:18, overflow:"hidden", height:"100%",
      boxShadow:"0 8px 48px rgba(0,0,0,.5), 0 0 30px rgba(192,132,252,.1)",
    }}>
      {/* header */}
      <div style={{
        padding:"13px 16px", borderBottom:"1px solid rgba(255,255,255,.07)",
        display:"flex", alignItems:"center", gap:12,
        background:"rgba(192,132,252,.05)",
      }}>
        {chat.isDM && otherUser ? (
          <>
            <div style={{ width:36, height:36, borderRadius:"50%", background:otherUser.avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, border:"2px solid rgba(192,132,252,.3)" }}>
              {otherUser.avatar}
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"var(--text)" }}>{otherUser.name}</div>
              <div style={{ fontSize:11, color:"var(--muted)", fontWeight:600 }}>
                {otherUser.isOnline ? "🟢 online" : "⚫ offline"} · {otherUser.mood}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#c084fc,#f472b6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
              ✦
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"var(--text)" }}>{chatName}</div>
              <div style={{ fontSize:11, color:"var(--muted)", fontWeight:600 }}>
                {chat.members.length + 1} friends
              </div>
            </div>
          </>
        )}
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          <button
            onClick={() => leaveFriendChat(chat.id)}
            style={{ padding:"5px 10px", borderRadius:8, border:"1px solid rgba(255,100,100,.2)", background:"rgba(255,100,100,.08)", color:"#fb7185", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}
          >
            leave
          </button>
          <button onClick={onClose}
            style={{ padding:"5px 10px", borderRadius:8, border:"1px solid var(--border)", background:"rgba(255,255,255,.05)", color:"var(--muted)", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}
        ref={r => r && (r.scrollTop = r.scrollHeight)}>
        {chat.messages.length === 0 && (
          <div style={{ textAlign:"center", color:"var(--muted)", fontSize:13.5, fontWeight:600, padding:"32px 0" }}>
            <div style={{ fontSize:32, marginBottom:10 }}>{chat.isDM ? otherUser?.avatar || "🌙" : "✦"}</div>
            start the conversation with {chat.isDM ? otherUser?.name?.split(" ")[0] : "your friends"} ☁️
          </div>
        )}
        {chat.messages.map(msg => {
          const isMe = msg.userId === "me";
          const user = isMe ? myProfile : getUserById(msg.userId);
          return (
            <div key={msg.id} style={{ display:"flex", gap:9, alignItems:"flex-end", flexDirection: isMe ? "row-reverse" : "row", animation:"fadeUp .2s ease" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:user?.avatarBg||"var(--cloud-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>
                {user?.avatar}
              </div>
              <div style={{ maxWidth:"70%" }}>
                {!isMe && <div style={{ fontSize:11, fontWeight:800, color:"var(--accent)", marginBottom:3 }}>{user?.name?.split(" ")[0]}</div>}
                <div style={{
                  padding:"9px 13px", borderRadius:16,
                  background: isMe ? "linear-gradient(135deg,rgba(192,132,252,.3),rgba(244,114,182,.2))" : "rgba(255,255,255,.07)",
                  border: `1px solid ${isMe ? "rgba(192,132,252,.25)" : "rgba(255,255,255,.06)"}`,
                  fontSize:14, fontWeight:500, color:"var(--text)", lineHeight:1.45,
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize:10, color:"var(--muted)", marginTop:3, textAlign: isMe ? "right" : "left" }}>{msg.time}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* input */}
      <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", gap:8 }}>
        <input
          style={{ flex:1, padding:"10px 15px", borderRadius:24, border:"1px solid rgba(192,132,252,.2)", background:"rgba(255,255,255,.05)", fontFamily:"'Space Grotesk',sans-serif", fontSize:14, color:"var(--text)", outline:"none", fontWeight:500 }}
          placeholder={`message ${chat.isDM ? otherUser?.name?.split(" ")[0] || "friend" : chatName}... ☁️`}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} style={{ width:42, height:42, borderRadius:"50%", border:"none", background:"linear-gradient(135deg,#c084fc,#f472b6)", color:"white", fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 12px rgba(192,132,252,.4)", transition:"transform .15s", flexShrink:0 }}
          onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
        >→</button>
      </div>
    </div>
  );
}

function CreateGroupModal({ friends, onClose, onCreate }) {
  const [name, setName]         = useState("");
  const [selected, setSelected] = useState(new Set());

  function toggle(id) {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,15,.75)", backdropFilter:"blur(14px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20, animation:"fadeIn .2s" }}>
      <div style={{ background:"#12103a", border:"1px solid rgba(192,132,252,.2)", borderRadius:22, width:"min(420px,100%)", padding:"26px 24px", boxShadow:"0 16px 60px rgba(0,0,0,.5),0 0 40px rgba(192,132,252,.1)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, background:"linear-gradient(135deg,#c084fc,#f472b6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            new group ✦
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--muted)", padding:"4px 8px", borderRadius:8 }}>✕</button>
        </div>

        <label style={{ fontSize:11.5, fontWeight:700, color:"var(--muted)", letterSpacing:.5, display:"block", marginBottom:6 }}>GROUP NAME</label>
        <input
          style={{ width:"100%", padding:"10px 14px", borderRadius:11, border:"1px solid rgba(192,132,252,.15)", background:"rgba(255,255,255,.05)", fontFamily:"'Space Grotesk',sans-serif", fontSize:14, color:"var(--text)", outline:"none", marginBottom:18 }}
          placeholder="name your group... ✦"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label style={{ fontSize:11.5, fontWeight:700, color:"var(--muted)", letterSpacing:.5, display:"block", marginBottom:10 }}>PICK FRIENDS</label>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
          {friends.map(u => (
            <div key={u.id}
              onClick={() => toggle(u.id)}
              style={{
                display:"flex", alignItems:"center", gap:11, padding:"10px 13px",
                borderRadius:12, cursor:"pointer",
                border:`1.5px solid ${selected.has(u.id) ? "rgba(192,132,252,.4)" : "rgba(255,255,255,.07)"}`,
                background: selected.has(u.id) ? "rgba(192,132,252,.1)" : "rgba(255,255,255,.03)",
                transition:"all .15s",
              }}
            >
              <div style={{ width:34, height:34, borderRadius:"50%", background:u.avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{u.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13.5, color:"var(--text)" }}>{u.name}</div>
                <div style={{ fontSize:12, color:"var(--muted)", fontWeight:600 }}>{u.handle}</div>
              </div>
              <div style={{
                width:22, height:22, borderRadius:"50%",
                border:`2px solid ${selected.has(u.id) ? "var(--accent)" : "var(--border)"}`,
                background: selected.has(u.id) ? "var(--accent)" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"white", fontSize:13, flexShrink:0,
              }}>
                {selected.has(u.id) ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>

        <button
          disabled={selected.size === 0}
          onClick={() => onCreate(name || "cosmic group ✦", [...selected])}
          style={{
            width:"100%", padding:12, borderRadius:13, border:"none",
            background: selected.size > 0 ? "linear-gradient(135deg,#c084fc,#f472b6)" : "rgba(255,255,255,.08)",
            color: selected.size > 0 ? "white" : "var(--muted)",
            fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:15, cursor: selected.size > 0 ? "pointer" : "not-allowed",
            boxShadow: selected.size > 0 ? "0 4px 20px rgba(192,132,252,.35)" : "none",
            transition:"all .2s",
          }}
        >
          create group ✦
        </button>
      </div>
    </div>
  );
}

export default function FriendsPage() {
  const {
    users, friends, following, followers, toggleFollow,
    getUserById, setProfileModal,
    friendChats, activeFriendChat, setActiveFriendChat,
    openFriendDM, createGroupChat,
    myProfile, myStarCount, myFollowingCount, myFriendCount,
    posts,
  } = useApp();

  const [view, setView]             = useState("friends"); // friends | stars | following
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [search, setSearch]         = useState("");

  const friendList  = users.filter(u => friends.has(u.id));
  const starList    = users.filter(u => followers.has(u.id));
  const followingList = users.filter(u => following.has(u.id));
  const activeChat  = friendChats.find(c => c.id === activeFriendChat);

  function handleCreateGroup(name, memberIds) {
    createGroupChat(name, memberIds);
    setShowCreateGroup(false);
  }

  const q = search.toLowerCase();
  function filterUsers(list) {
    if (!q) return list;
    return list.filter(u => u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q));
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">friends & stars 🌟</div>
      </div>

      {/* stats bar */}
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        {[
          { label:"stars", val:myStarCount, icon:"🌟", key:"stars" },
          { label:"following", val:myFollowingCount, icon:"✦", key:"following" },
          { label:"friends", val:myFriendCount, icon:"💫", key:"friends" },
        ].map(s => (
          <button key={s.key}
            onClick={() => setView(s.key)}
            style={{
              flex:1, padding:"12px 8px", borderRadius:14,
              border:`1px solid ${view===s.key ? "rgba(192,132,252,.4)" : "rgba(255,255,255,.07)"}`,
              background: view===s.key ? "rgba(192,132,252,.12)" : "rgba(255,255,255,.04)",
              cursor:"pointer", transition:"all .15s", textAlign:"center",
            }}>
            <div style={{ fontSize:20 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"var(--text)", marginTop:2 }}>{s.val}</div>
            <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:.5 }}>{s.label}</div>
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: activeChat ? "1fr 1fr" : "1fr", gap:16 }}>

        {/* LEFT: people list + chats */}
        <div>
          {/* friend chats list */}
          {friendChats.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div className="widget-title">💬 your chats</div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {friendChats.map(c => {
                  const other = c.isDM ? getUserById(c.members[0]) : null;
                  const lastMsg = c.messages[c.messages.length-1];
                  return (
                    <div key={c.id}
                      onClick={() => setActiveFriendChat(c.id)}
                      style={{
                        display:"flex", alignItems:"center", gap:11, padding:"11px 13px",
                        borderRadius:13, cursor:"pointer",
                        border:`1px solid ${activeFriendChat===c.id ? "rgba(192,132,252,.4)" : "rgba(255,255,255,.07)"}`,
                        background: activeFriendChat===c.id ? "rgba(192,132,252,.1)" : "rgba(255,255,255,.03)",
                        transition:"all .15s",
                      }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background: c.isDM ? (other?.avatarBg||"var(--cloud-soft)") : "linear-gradient(135deg,#c084fc,#f472b6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>
                        {c.isDM ? (other?.avatar||"🌙") : "✦"}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {c.isDM ? (other?.name||"friend") : c.name}
                        </div>
                        <div style={{ fontSize:12, color:"var(--muted)", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {lastMsg ? lastMsg.text : "say hi ☁️"}
                        </div>
                      </div>
                      {c.messages.length > 0 && (
                        <div style={{ fontSize:11, color:"var(--muted)", fontWeight:600, flexShrink:0 }}>
                          {c.messages[c.messages.length-1]?.time}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* search */}
          <input className="search-input" placeholder="🌟 search..."
            value={search} onChange={e => setSearch(e.target.value)} />

          {/* view: friends */}
          {view === "friends" && (
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div className="widget-title" style={{ marginBottom:0 }}>💫 friends ({friendList.length})</div>
                {friendList.length > 1 && (
                  <button onClick={() => setShowCreateGroup(true)}
                    style={{ padding:"6px 13px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#c084fc,#f472b6)", color:"white", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12.5, cursor:"pointer" }}>
                    + group ✦
                  </button>
                )}
              </div>

              {filterUsers(friendList).length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💫</div>
                  {friendList.length === 0
                    ? "no friends yet — follow someone and they might star you back!"
                    : "no friends match that search"}
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {filterUsers(friendList).map(u => (
                    <FriendCard key={u.id} u={u} onChat={() => { openFriendDM(u.id); setActiveFriendChat(friendChats.find(c=>c.isDM&&c.members.includes(u.id))?.id || `dm_${u.id}_new`); }}
                      onProfile={() => setProfileModal(u)} posts={posts} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* view: stars (your followers) */}
          {view === "stars" && (
            <div>
              <div className="widget-title">🌟 your stars ({starList.length})</div>
              <p style={{ fontSize:13, color:"var(--muted)", fontWeight:600, marginBottom:12, fontStyle:"italic" }}>
                these people follow you ✦ if you follow them back you become friends!
              </p>
              {filterUsers(starList).length === 0 ? (
                <div className="empty-state"><div className="empty-icon">🌟</div>no stars yet — keep posting!</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {filterUsers(starList).map(u => (
                    <StarCard key={u.id} u={u} isMutual={friends.has(u.id)} iFollowThem={following.has(u.id)}
                      onProfile={() => setProfileModal(u)} posts={posts} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* view: following */}
          {view === "following" && (
            <div>
              <div className="widget-title">✦ following ({followingList.length})</div>
              {filterUsers(followingList).length === 0 ? (
                <div className="empty-state"><div className="empty-icon">✦</div>not following anyone yet — check out discover!</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {filterUsers(followingList).map(u => (
                    <StarCard key={u.id} u={u} isMutual={friends.has(u.id)} iFollowThem={true}
                      onProfile={() => setProfileModal(u)} posts={posts} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: active chat */}
        {activeChat && (
          <ChatWindow chat={activeChat} onClose={() => setActiveFriendChat(null)} />
        )}
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          friends={friendList}
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}

function FriendCard({ u, onChat, onProfile, posts }) {
  const postCount = posts.filter(p => p.authorId === u.id).length;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:14, border:"1px solid rgba(192,132,252,.15)", background:"rgba(255,255,255,.04)", transition:"all .15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor="rgba(192,132,252,.3)"}
      onMouseLeave={e => e.currentTarget.style.borderColor="rgba(192,132,252,.15)"}>
      <div style={{ position:"relative", cursor:"pointer" }} onClick={onProfile}>
        <div style={{ width:46, height:46, borderRadius:"50%", background:u.avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, border:"2px solid rgba(192,132,252,.3)" }}>
          {u.avatar}
        </div>
        <div style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background: u.isOnline ? "#4ade80" : "var(--muted)", border:"2px solid #07071a" }} />
      </div>
      <div style={{ flex:1, minWidth:0, cursor:"pointer" }} onClick={onProfile}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontWeight:800, fontSize:14.5, color:"var(--text)" }}>{u.name}</span>
          <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"rgba(192,132,252,.12)", color:"var(--accent)", border:"1px solid rgba(192,132,252,.2)" }}>💫 friends</span>
        </div>
        <div style={{ fontSize:12, color:"var(--muted)", fontWeight:600 }}>{u.handle} · {u.mood}</div>
        <div style={{ fontSize:11.5, color:"var(--text2)", fontWeight:600, marginTop:2 }}>
          {u.followers} stars · {postCount} posts
        </div>
      </div>
      <button onClick={onChat}
        style={{ padding:"7px 14px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#c084fc,#f472b6)", color:"white", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", flexShrink:0, boxShadow:"0 2px 10px rgba(192,132,252,.35)" }}>
        💬 chat
      </button>
    </div>
  );
}

function StarCard({ u, isMutual, iFollowThem, onProfile, posts }) {
  const { toggleFollow } = useApp();
  const postCount = posts.filter(p => p.authorId === u.id).length;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:14, border:`1px solid ${isMutual ? "rgba(192,132,252,.2)" : "rgba(255,255,255,.07)"}`, background:"rgba(255,255,255,.04)", transition:"all .15s" }}>
      <div style={{ cursor:"pointer" }} onClick={onProfile}>
        <div style={{ width:44, height:44, borderRadius:"50%", background:u.avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{u.avatar}</div>
      </div>
      <div style={{ flex:1, minWidth:0, cursor:"pointer" }} onClick={onProfile}>
        <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
          <span style={{ fontWeight:800, fontSize:14, color:"var(--text)" }}>{u.name}</span>
          {isMutual && <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"rgba(192,132,252,.12)", color:"var(--accent)", border:"1px solid rgba(192,132,252,.2)" }}>💫 friends</span>}
        </div>
        <div style={{ fontSize:12, color:"var(--muted)", fontWeight:600 }}>{u.handle} · {postCount} posts</div>
      </div>
      <button
        onClick={() => toggleFollow(u.id)}
        style={{
          padding:"7px 13px", borderRadius:10, border:"none", flexShrink:0,
          background: iFollowThem ? "rgba(255,255,255,.08)" : "linear-gradient(135deg,#c084fc,#f472b6)",
          color: iFollowThem ? "var(--text2)" : "white",
          fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12.5, cursor:"pointer",
        }}>
        {iFollowThem ? "✓ following" : "+ follow back"}
      </button>
    </div>
  );
}
