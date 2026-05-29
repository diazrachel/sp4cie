import { useAuth } from "../../context/AuthContext";

export default function Landing() {
  const { goTo } = useAuth();
  return (
    <div className="auth-shell">
      <div className="cloud-layer" aria-hidden>
        {[1,2,3,4].map(i => <div key={i} className={`cloud-drift cd${i}`} />)}
      </div>
      <div className="landing-card">
        <span className="landing-icon">🌙</span>
        <div className="landing-logo">sp4cie</div>
        <p className="landing-tag">
          a <strong>soft cosmic corner</strong> of the internet.<br />
          post, orbit, float in the clouds. ✦
        </p>
        <div className="landing-btns">
          <button className="btn-primary" onClick={() => goTo("signup")}>join the orbit ✦</button>
          <button className="btn-secondary" onClick={() => goTo("login")}>log back in 🌙</button>
        </div>
        <div className="landing-features">
          {[["🌙","my moon"],["✦","orbit feed"],["☁️","cloud nine"],["🌌","discover"],["🎵","music player"],["✨","cosmic profiles"]].map(([icon,label]) => (
            <div key={label} className="lf"><span className="lf-icon">{icon}</span>{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
