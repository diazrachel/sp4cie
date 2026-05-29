import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { signup, goTo } = useAuth();
  const [form, setForm] = useState({ email:"", username:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.email.includes("@")) e.email = "enter a valid email";
    if (form.username.length < 3)  e.username = "at least 3 characters";
    if (/[^a-zA-Z0-9_.]/.test(form.username)) e.username = "letters, numbers, _ and . only";
    if (form.password.length < 6)  e.password = "at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "passwords don't match";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setServerErr("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      const res = signup({ email:form.email.toLowerCase().trim(), username:form.username.trim(), password:form.password });
      setLoading(false);
      if (res.error) setServerErr(res.error);
    }, 700);
  }

  function set(k, v) { setForm(f => ({ ...f, [k]:v })); setErrors(e => ({ ...e, [k]:undefined })); }

  return (
    <div className="auth-shell">
      <div className="cloud-layer" aria-hidden>
        {[1,2,3,4].map(i => <div key={i} className={`cloud-drift cd${i}`} />)}
      </div>
      <div className="auth-card">
        <button className="auth-back" onClick={() => goTo("landing")}>← back</button>
        <div className="auth-logo-small">✦ sp4cie</div>
        <div className="auth-title">join the orbit</div>
        <div className="auth-sub">create your cosmic account ✨</div>

        {serverErr && <div className="auth-error">{serverErr}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label className="field-label">email</label>
            <input className={`field-input ${errors.email?"err":""}`} type="email"
              placeholder="your@email.com" value={form.email} onChange={e => set("email",e.target.value)} autoComplete="email" />
            {errors.email && <span className="field-hint err">{errors.email}</span>}
          </div>
          <div className="field-group">
            <label className="field-label">username</label>
            <input className={`field-input ${errors.username?"err":""}`} type="text"
              placeholder="@yourhandle" value={form.username} onChange={e => set("username",e.target.value)} autoComplete="username" />
            {errors.username
              ? <span className="field-hint err">{errors.username}</span>
              : <span className="field-hint">letters, numbers, _ and . only</span>}
          </div>
          <div className="field-group">
            <label className="field-label">password</label>
            <div className="pw-row">
              <input className={`field-input ${errors.password?"err":""}`} type={showPw?"text":"password"}
                placeholder="at least 6 characters" value={form.password}
                onChange={e => set("password",e.target.value)} autoComplete="new-password" />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(s=>!s)}>{showPw?"🙈":"👁️"}</button>
            </div>
            {errors.password && <span className="field-hint err">{errors.password}</span>}
          </div>
          <div className="field-group">
            <label className="field-label">confirm password</label>
            <div className="pw-row">
              <input className={`field-input ${errors.confirm?"err":""}`} type={showPw?"text":"password"}
                placeholder="same password again" value={form.confirm}
                onChange={e => set("confirm",e.target.value)} autoComplete="new-password" />
            </div>
            {errors.confirm && <span className="field-hint err">{errors.confirm}</span>}
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "launching you into orbit... 🌙" : "create account ✦"}
          </button>
        </form>
        <div className="auth-switch">already orbiting? <button onClick={() => goTo("login")}>log in</button></div>
      </div>
    </div>
  );
}
