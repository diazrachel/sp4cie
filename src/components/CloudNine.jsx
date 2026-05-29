import { useApp } from "../context/AppContext";
import { useState, useRef, useEffect } from "react";

export default function CloudNine() {
  const { chatMessages, sendChat, users, getUserById, myProfile } = useApp();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [chatMessages]);

  function handleSend() {
    if (!draft.trim()) return;
    sendChat(draft.trim());
    setDraft("");
  }

  const onlineCount = users.filter(u => u.isOnline).length + 1;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">cloud nine ☁️</div>
        <span style={{ fontSize:12.5, color:"var(--muted)", fontWeight:600 }}>
          messages drift & fade like real clouds ✨
        </span>
      </div>

      <div className="cloud-nine-shell">
        <div className="cloud-nine-bg" />

        <div className="cloud-nine-header">
          <div style={{ fontSize:28 }}>☁️</div>
          <div>
            <div className="cloud-nine-title">cloud nine</div>
            <div className="cloud-nine-sub">
              {users.length + 1} {users.length + 1 === 1 ? "member" : "members"} · {onlineCount} online now
            </div>
          </div>
          <div className="cn-members">
            {[myProfile, ...users].slice(0,6).map(u => (
              <div key={u.id} className="cn-member-avi" style={{ background:u.avatarBg }} title={u.name}>{u.avatar}</div>
            ))}
          </div>
        </div>

        <div className="cloud-nine-msgs">
          <div style={{
            textAlign:"center", padding:"10px 16px", borderRadius:12,
            background:"rgba(192,132,252,.06)", border:"1px solid rgba(192,132,252,.1)",
            fontSize:12.5, color:"var(--muted)", fontWeight:600, marginBottom:4,
          }}>
            ☁️ welcome to cloud nine — a soft space where messages drift like clouds and fade gently into the sky.
            {users.length === 0 && " invite friends to join sp4cie and chat here together ✨"}
          </div>

          {chatMessages.map((msg, idx) => {
            const isMe    = msg.userId === "me";
            const user    = isMe ? myProfile : getUserById(msg.userId);
            const isFading = idx < chatMessages.length - 6;
            return (
              <div key={msg.id} className={`cn-msg ${isMe ? "mine" : ""} ${isFading ? "fading" : ""}`}>
                <div className="cn-avi" style={{ background:user?.avatarBg||"var(--cloud-soft)" }}>
                  {user?.avatar||"☁️"}
                </div>
                <div className="cn-bubble-wrap">
                  <div className="cn-name">{isMe ? "you" : user?.name?.split(" ")[0]}</div>
                  <div className="cn-bubble">{msg.text}</div>
                  <div className="cn-time">{msg.time}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="cloud-nine-footer">
          <input className="cn-input"
            placeholder="float something into the sky... ☁️"
            value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()} />
          <button className="cn-send" onClick={handleSend}>→</button>
        </div>
      </div>
    </div>
  );
}
