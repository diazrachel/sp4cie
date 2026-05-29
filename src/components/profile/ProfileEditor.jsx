import { useApp } from "../../context/AppContext";
import { useState } from "react";
import {
  AVATAR_OPTIONS, BANNERS, PROFILE_THEMES, PROFILE_FONTS,
  MOODS, INTEREST_OPTIONS, BADGE_CATALOG
} from "../../data.js";

export default function ProfileEditor({ onSave, onClose }) {
  const { myProfile } = useApp();
  const [form, setForm] = useState({ ...myProfile });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  function toggleInterest(i) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i)
        ? f.interests.filter(x => x !== i)
        : [...f.interests, i],
    }));
  }

  function toggleBadge(b) {
    setForm(f => ({
      ...f,
      badges: (f.badges || []).includes(b)
        ? f.badges.filter(x => x !== b)
        : [...(f.badges || []), b],
    }));
  }

  function addAboutSection() {
    setForm(f => ({ ...f, aboutSections: [...(f.aboutSections || []), { title:"new section", text:"" }] }));
  }
  function updateAboutSection(i, key, val) {
    setForm(f => ({
      ...f,
      aboutSections: f.aboutSections.map((s, idx) => idx === i ? { ...s, [key]: val } : s),
    }));
  }
  function removeAboutSection(i) {
    setForm(f => ({ ...f, aboutSections: f.aboutSections.filter((_, idx) => idx !== i) }));
  }

  const songs = [
    "no song", "all i want", "the night will always win",
    "slow burn", "eclipse", "moon river", "cosmic dancer", "saturn",
  ];

  return (
    <div className="edit-overlay">
      <div className="edit-panel">
        <div className="edit-header">
          <h2>customize my moon 🌙</h2>
          <button className="edit-close" onClick={onClose}>✕</button>
        </div>

        <div className="edit-body">

          {/* AVATAR */}
          <div>
            <div className="edit-section-title">avatar</div>
            <div className="avi-picker">
              {AVATAR_OPTIONS.map(a => (
                <button key={a} className={`avi-opt ${form.avatar === a ? "sel" : ""}`}
                  onClick={() => set("avatar", a)}>{a}</button>
              ))}
            </div>
          </div>

          {/* BANNER */}
          <div>
            <div className="edit-section-title">profile banner</div>
            <div className="banner-picker">
              {BANNERS.map(bg => (
                <div key={bg} className={`banner-opt ${form.bannerBg === bg ? "sel" : ""}`}
                  style={{ background: bg }} onClick={() => set("bannerBg", bg)} />
              ))}
            </div>
          </div>

          {/* PAGE THEME */}
          <div>
            <div className="edit-section-title">page theme</div>
            <div className="theme-picker">
              {Object.values(PROFILE_THEMES).map(t => (
                <div key={t.name} className={`theme-opt ${form.profileTheme === t.name ? "sel" : ""}`}
                  onClick={() => set("profileTheme", t.name)}>
                  <div className="theme-preview" style={{ background: t.bg }} />
                  <span className="theme-label">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FONT */}
          <div>
            <div className="edit-section-title">profile font</div>
            <div className="font-picker">
              {Object.values(PROFILE_FONTS).map(f => (
                <button key={f.name} className={`font-opt ${form.profileFont === f.name ? "sel" : ""}`}
                  style={{ fontFamily: f.family }} onClick={() => set("profileFont", f.name)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* DISPLAY NAME */}
          <div>
            <label className="edit-label">display name</label>
            <input className="edit-input" value={form.name}
              onChange={e => set("name", e.target.value)} placeholder="your name..." />
          </div>

          {/* HANDLE */}
          <div>
            <label className="edit-label">handle</label>
            <input className="edit-input" value={form.handle}
              onChange={e => set("handle", e.target.value)} placeholder="@yourhandle" />
          </div>

          {/* BIO */}
          <div>
            <label className="edit-label">bio</label>
            <textarea className="edit-input edit-textarea" value={form.bio}
              onChange={e => set("bio", e.target.value)}
              placeholder="tell the cosmos about yourself..." maxLength={200} />
            <div style={{ fontSize:11, color:"var(--muted)", marginTop:3, textAlign:"right" }}>{(form.bio||"").length}/200</div>
          </div>

          {/* WEBSITE */}
          <div>
            <label className="edit-label">website</label>
            <input className="edit-input" value={form.website}
              onChange={e => set("website", e.target.value)} placeholder="yoursite.com" />
          </div>

          {/* MOOD */}
          <div>
            <div className="edit-section-title">current mood</div>
            <div className="setup-mood-grid">
              {MOODS.map(m => (
                <button key={m.label} className={`setup-mood-btn ${form.mood === m.label ? "sel" : ""}`}
                  style={{ background: m.bg + "33", color: m.color }}
                  onClick={() => set("mood", m.label)}>{m.label}</button>
              ))}
            </div>
          </div>

          {/* MUSIC */}
          <div>
            <div className="edit-section-title">profile song 🎵</div>
            <select className="edit-input" value={form.currentSong || ""}
              onChange={e => set("currentSong", e.target.value)}
              style={{ cursor:"pointer" }}>
              {songs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* INTERESTS */}
          <div>
            <div className="edit-section-title">interests</div>
            <div className="interest-chips">
              {INTEREST_OPTIONS.map(i => (
                <button key={i} className={`int-btn ${(form.interests||[]).includes(i) ? "sel" : ""}`}
                  onClick={() => toggleInterest(i)}>{i}</button>
              ))}
            </div>
          </div>

          {/* BADGES */}
          <div>
            <div className="edit-section-title">badges (pick up to 5)</div>
            <div className="interest-chips">
              {BADGE_CATALOG.map(b => {
                const selected = (form.badges||[]).includes(b);
                const maxed    = !selected && (form.badges||[]).length >= 5;
                return (
                  <button key={b} className={`int-btn ${selected ? "sel" : ""}`}
                    disabled={maxed}
                    style={maxed ? { opacity:.4, cursor:"not-allowed" } : {}}
                    onClick={() => toggleBadge(b)}>{b}</button>
                );
              })}
            </div>
          </div>

          {/* ABOUT SECTIONS */}
          <div>
            <div className="edit-section-title">about sections</div>
            {(form.aboutSections || []).map((sec, i) => (
              <div key={i} className="about-section-editor">
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                  <input className="edit-input" style={{ flex:1 }} value={sec.title}
                    onChange={e => updateAboutSection(i, "title", e.target.value)}
                    placeholder="section title..." />
                  <button onClick={() => removeAboutSection(i)}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"var(--coral)", fontSize:16, padding:"4px 8px", borderRadius:8 }}>✕</button>
                </div>
                <textarea className="edit-input edit-textarea" style={{ minHeight:60 }} value={sec.text}
                  onChange={e => updateAboutSection(i, "text", e.target.value)}
                  placeholder="write something..." />
              </div>
            ))}
            <button className="add-section-btn" onClick={addAboutSection}>+ add section</button>
          </div>

          <button className="save-btn" onClick={() => onSave(form)}>save my moon ✦</button>
        </div>
      </div>
    </div>
  );
}
