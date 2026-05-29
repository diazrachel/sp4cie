import { useApp } from "../context/AppContext";

export default function Sidebar() {
  const { tab, setTab, users, setProfileModal, myFriendCount, friends } = useApp();

  const nav = [
    { key:"home",     icon:"✦",  label:"orbit feed" },
    { key:"discover", icon:"🌌", label:"discover" },
    { key:"chat",     icon:"☁️", label:"cloud nine" },
    { key:"friends",  icon:"🌟", label:"friends & stars", badge: myFriendCount > 0 ? myFriendCount : null },
    { key:"moon",     icon:"🌙", label:"my moon" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">✦</span> sp4cie
      </div>

      <div className="nav-sec">navigate</div>
      {nav.map(n => (
        <button key={n.key} className={`nav-btn ${tab === n.key ? "active" : ""}`} onClick={() => setTab(n.key)}>
          <span className="nav-icon">{n.icon}</span>
          {n.label}
          {n.badge && (
            <span style={{ marginLeft:"auto", background:"linear-gradient(135deg,#c084fc,#f472b6)", color:"white", fontSize:11, fontWeight:800, padding:"2px 8px", borderRadius:20, boxShadow:"0 2px 8px rgba(192,132,252,.4)" }}>
              {n.badge}
            </span>
          )}
        </button>
      ))}

      <div className="nav-sec" style={{ marginTop:12 }}>floating by</div>
      {users.map(u => (
        <div key={u.id} className="online-item" onClick={() => setProfileModal(u)}>
          <div className="online-avi" style={{ background: u.avatarBg }}>{u.avatar}</div>
          <span>{u.name.split(" ")[0]}</span>
          {friends?.has(u.id) && <span style={{ fontSize:10, color:"var(--accent)", fontWeight:700 }}>💫</span>}
          <div className={u.isOnline ? "dot-on" : "dot-off"} />
        </div>
      ))}
    </aside>
  );
}
