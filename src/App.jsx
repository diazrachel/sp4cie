import { useContext } from 'react'
import { AuthContext, AuthProvider } from './context/AuthContext.jsx'
import { AppContext, AppProvider } from './context/AppContext.jsx'
import Landing      from './components/auth/Landing.jsx'
import Signup       from './components/auth/Signup.jsx'
import Login        from './components/auth/Login.jsx'
import ProfileSetup from './components/auth/ProfileSetup.jsx'
import Sidebar      from './components/Sidebar.jsx'
import Feed         from './components/Feed.jsx'
import Discover     from './components/Discover.jsx'
import CloudNine    from './components/CloudNine.jsx'
import FriendsPage  from './components/FriendsPage.jsx'
import MyMoon       from './components/MyMoon.jsx'
import RightPanel   from './components/RightPanel.jsx'
import ProfileModal from './components/ProfileModal.jsx'
import Starfield    from './components/Starfield.jsx'
import './styles/global.css'

const NAV = [
  { key:'home',     icon:'✦',  label:'feed'    },
  { key:'discover', icon:'🌌', label:'discover'},
  { key:'chat',     icon:'☁️', label:'cloud 9' },
  { key:'friends',  icon:'🌟', label:'friends' },
  { key:'moon',     icon:'🌙', label:'my moon' },
]

function MainApp() {
  const { tab, setTab, profileModal, setProfileModal, myFriendCount } = useContext(AppContext)
  const { logout } = useContext(AuthContext)

  return (
    <div className="app-shell">
      <Starfield />
      <div className="cloud-layer" aria-hidden>
        {[1,2,3,4].map(i => <div key={i} className={`cloud-drift cd${i}`} />)}
      </div>

      <button onClick={logout} style={{
        position:'fixed', top:14, right:18, zIndex:200,
        padding:'6px 14px', borderRadius:10,
        border:'1px solid rgba(255,255,255,.12)',
        background:'rgba(12,10,40,.7)', backdropFilter:'blur(8px)',
        fontFamily:"'Space Grotesk',sans-serif", fontSize:12.5, fontWeight:700,
        color:'var(--muted)', cursor:'pointer',
      }}>log out ✦</button>

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          {tab === 'home'     && <Feed />}
          {tab === 'discover' && <Discover />}
          {tab === 'chat'     && <CloudNine />}
          {tab === 'friends'  && <FriendsPage />}
          {tab === 'moon'     && <MyMoon />}
        </main>
        <RightPanel />
      </div>

      {/* mobile bottom nav */}
      <nav className="mobile-nav">
        {NAV.map(n => (
          <button key={n.key} className={`mobile-nav-btn ${tab===n.key?'active':''}`} onClick={() => setTab(n.key)}>
            <span className="nav-icon">{n.icon}</span>
            {n.label}
            {n.key==='friends' && myFriendCount > 0 && (
              <span style={{ position:'absolute', top:6, right:'calc(50% - 16px)', background:'linear-gradient(135deg,#c084fc,#f472b6)', color:'white', fontSize:9, fontWeight:800, padding:'1px 5px', borderRadius:20 }}>{myFriendCount}</span>
            )}
          </button>
        ))}
      </nav>

      {profileModal && <ProfileModal user={profileModal} onClose={() => setProfileModal(null)} />}
    </div>
  )
}

function AppRouter() {
  const { step } = useContext(AuthContext)
  if (step === 'loading')  return <div style={{ minHeight:'100vh', background:'#07071a', display:'flex', alignItems:'center', justifyContent:'center', color:'#c084fc', fontFamily:"'Space Grotesk',sans-serif", fontSize:18 }}>✦ loading sp4cie...</div>
  if (step === 'landing')  return <Landing />
  if (step === 'signup')   return <Signup />
  if (step === 'login')    return <Login />
  if (step === 'setup')    return <ProfileSetup />
  return <AppProvider><MainApp /></AppProvider>
}

export default function App() {
  return <AuthProvider><AppRouter /></AuthProvider>
}
