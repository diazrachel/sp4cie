import { useContext, useState } from 'react'
import { AuthContext, AuthProvider } from './context/AuthContext.jsx'
import { AppContext, AppProvider } from './context/AppContext.jsx'
import Landing       from './components/auth/Landing.jsx'
import Signup        from './components/auth/Signup.jsx'
import Login         from './components/auth/Login.jsx'
import ProfileSetup  from './components/auth/ProfileSetup.jsx'
import Sidebar       from './components/Sidebar.jsx'
import Feed          from './components/Feed.jsx'
import Discover      from './components/Discover.jsx'
import CloudNine     from './components/CloudNine.jsx'
import FriendsPage   from './components/FriendsPage.jsx'
import MyMoon        from './components/MyMoon.jsx'
import RightPanel    from './components/RightPanel.jsx'
import ProfileModal  from './components/ProfileModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import FloatingChat  from './components/FloatingChat.jsx'
import Starfield     from './components/Starfield.jsx'
import './styles/global.css'

const NAV = [
  { key:'home',     icon:'✦',  label:'feed'    },
  { key:'discover', icon:'🌌', label:'discover'},
  { key:'chat',     icon:'☁️', label:'cloud 9' },
  { key:'friends',  icon:'🌟', label:'friends' },
  { key:'moon',     icon:'🌙', label:'my moon' },
]

function MainApp() {
  const { tab, setTab, profileModal, setProfileModal, myFriendCount, activeFriendChat, setActiveFriendChat, openFriendDM } = useContext(AppContext)
  const [showSettings, setShowSettings]     = useState(false)
  const [floatingChatId, setFloatingChatId] = useState(null)

  // expose openFloatingChat so RightPanel + FriendsPage can use it
  function openFloatingChat(userId) {
    openFriendDM(userId).then?.(() => {})
    // after DM is opened, activeFriendChat will be set — we mirror it to floating
    setFloatingChatId('pending_' + userId)
  }

  // sync floating chat when activeFriendChat changes
  // (openFriendDM sets activeFriendChat after creating the DM)
  useState(() => {
    if (activeFriendChat && floatingChatId?.startsWith('pending_')) {
      setFloatingChatId(activeFriendChat)
    }
  })

  return (
    <div className="app-shell">
      <Starfield />
      <div className="cloud-layer" aria-hidden>{[1,2,3,4].map(i=><div key={i} className={`cloud-drift cd${i}`}/>)}</div>

      {/* settings gear */}
      <button onClick={()=>setShowSettings(true)} title="settings"
        style={{ position:'fixed', top:14, right:18, zIndex:200, width:38, height:38, borderRadius:'50%', border:'1px solid rgba(255,255,255,.12)', background:'rgba(12,10,40,.75)', backdropFilter:'blur(8px)', color:'var(--muted)', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
        onMouseEnter={e=>{e.currentTarget.style.color='var(--text)';e.currentTarget.style.borderColor='rgba(192,132,252,.4)'}}
        onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)';e.currentTarget.style.borderColor='rgba(255,255,255,.12)'}}>
        ⚙️
      </button>

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          {tab==='home'    &&<Feed/>}
          {tab==='discover'&&<Discover/>}
          {tab==='chat'    &&<CloudNine/>}
          {tab==='friends' &&<FriendsPage onOpenChat={id=>{openFriendDM(id)}}/>}
          {tab==='moon'    &&<MyMoon/>}
        </main>
        <RightPanel onOpenChat={id=>{openFriendDM(id)}}/>
      </div>

      {/* mobile bottom nav */}
      <nav className="mobile-nav">
        {NAV.map(n=>(
          <button key={n.key} className={`mobile-nav-btn ${tab===n.key?'active':''}`} onClick={()=>setTab(n.key)}>
            <span className="nav-icon">{n.icon}</span>{n.label}
            {n.key==='friends'&&myFriendCount>0&&(
              <span style={{ position:'absolute', top:6, right:'calc(50% - 16px)', background:'linear-gradient(135deg,#c084fc,#f472b6)', color:'white', fontSize:9, fontWeight:800, padding:'1px 5px', borderRadius:20 }}>{myFriendCount}</span>
            )}
          </button>
        ))}
        <button className="mobile-nav-btn" onClick={()=>setShowSettings(true)}>
          <span className="nav-icon">⚙️</span>settings
        </button>
      </nav>

      {/* floating chat bubble */}
      {activeFriendChat && (
        <FloatingChat
          chatId={activeFriendChat}
          onClose={() => setActiveFriendChat(null)}
        />
      )}

      {profileModal  && <ProfileModal user={profileModal} onClose={()=>setProfileModal(null)}/>}
      {showSettings  && <SettingsModal onClose={()=>setShowSettings(false)}/>}
    </div>
  )
}

function AppRouter() {
  const { step } = useContext(AuthContext)
  if (step==='loading') return (
    <div style={{ minHeight:'100vh', background:'#07071a', display:'flex', alignItems:'center', justifyContent:'center', color:'#c084fc', fontFamily:"'Space Grotesk',sans-serif", fontSize:18, flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:32, animation:'spin 2s linear infinite' }}>✦</div>
      loading sp4cie...
    </div>
  )
  if (step==='landing') return <Landing/>
  if (step==='signup')  return <Signup/>
  if (step==='login')   return <Login/>
  if (step==='setup')   return <ProfileSetup/>
  return <AppProvider><MainApp/></AppProvider>
}

export default function App() {
  return <AuthProvider><AppRouter/></AuthProvider>
}
