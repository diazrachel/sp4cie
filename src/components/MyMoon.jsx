import { useApp } from "../context/AppContext";
import { useState } from "react";
import PostCard from "./PostCard";
import ProfileEditor from "./profile/ProfileEditor";
import { PROFILE_THEMES, PROFILE_FONTS } from "../data.js";

function MusicPlayer({ song }) {
  const [playing, setPlaying] = useState(false);
  const songs = [
    { title:"no song set",              artist:"add one in edit ✦" },
    { title:"all i want",               artist:"kodaline" },
    { title:"the night will always win",artist:"manchester orchestra" },
    { title:"slow burn",                artist:"kacey musgraves" },
    { title:"eclipse",                  artist:"pink floyd" },
    { title:"saturn",                   artist:"stevie wonder" },
    { title:"moon river",               artist:"audrey hepburn" },
    { title:"cosmic dancer",            artist:"t.rex" },
  ];
  const current = songs.find(s => s.title === song) || songs[0];
  return (
    <div className="music-player">
      <div className={`music-disc ${!playing ? "paused" : ""}`}>🎵</div>
      <div className="music-info">
        <div className="music-title">{current.title}</div>
        <div className="music-artist">{current.artist}</div>
      </div>
      <button className="music-play-btn" onClick={() => setPlaying(!playing)}>
        {playing ? "⏸" : "▶"}
      </button>
    </div>
  );
}

export default function MyMoon() {
  const { myProfile, updateMyProfile, posts, myStarCount, myFollowingCount, myFriendCount } = useApp();
  const [editing, setEditing]     = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const myPosts = posts.filter(p => p.authorId === "me");
  const theme   = PROFILE_THEMES[myProfile.profileTheme] || PROFILE_THEMES.lunar;
  const font    = PROFILE_FONTS[myProfile.profileFont]   || PROFILE_FONTS.sans;

  function handleSave(updates) { updateMyProfile(updates); setEditing(false); }

  return (
    <div className="moon-page" style={{ background:theme.bg, borderRadius:18, minHeight:"calc(100vh - 52px)", fontFamily:font.family }}>

      <div className="moon-banner" style={{ background:myProfile.bannerBg }}>
        <div className="moon-banner-overlay" />
        {["✦","✧","⭐","✦","✧"].map((s,i) => (
          <span key={i} aria-hidden style={{ position:"absolute", top:`${20+i*12}%`, left:`${10+i*18}%`, fontSize:i%2===0?14:10, opacity:.5, color:"rgba(255,255,255,.7)", pointerEvents:"none" }}>{s}</span>
        ))}
      </div>

      <div className="moon-profile-card" style={{ background:theme.card, backdropFilter:"blur(10px)", color:theme.text }}>
        <div className="moon-avi-row">
          <div className="moon-avi" style={{ background:myProfile.avatarBg, borderColor:theme.accent }}>{myProfile.avatar}</div>
          <button className="moon-edit-btn" style={{ borderColor:theme.accent+"55", color:theme.text }} onClick={() => setEditing(true)}>
            ✏️ customize
          </button>
        </div>

        <div className="moon-name" style={{ color:theme.text }}>{myProfile.name}</div>
        <div className="moon-handle" style={{ color:theme.text+"99" }}>{myProfile.handle}</div>
        <div className="moon-mood-badge" style={{ background:theme.accent+"22", color:theme.accent }}>{myProfile.mood}</div>
        <div className="moon-bio" style={{ color:theme.text+"cc" }}>{myProfile.bio || "no bio yet — customize your moon ✦"}</div>
        {myProfile.website && (
          <div style={{ fontSize:13, fontWeight:700, color:theme.accent, marginBottom:10 }}>🔗 {myProfile.website}</div>
        )}

        {/* stats — uses live counts, labels stars/following/friends */}
        <div className="moon-stats">
          <div>
            <div className="moon-stat-num" style={{ color:theme.text }}>{myPosts.length}</div>
            <div className="moon-stat-label" style={{ color:theme.text+"88" }}>posts</div>
          </div>
          <div>
            <div className="moon-stat-num" style={{ color:theme.text }}>{myStarCount}</div>
            <div className="moon-stat-label" style={{ color:theme.text+"88" }}>stars</div>
          </div>
          <div>
            <div className="moon-stat-num" style={{ color:theme.text }}>{myFollowingCount}</div>
            <div className="moon-stat-label" style={{ color:theme.text+"88" }}>following</div>
          </div>
          <div>
            <div className="moon-stat-num" style={{ color:theme.text }}>{myFriendCount}</div>
            <div className="moon-stat-label" style={{ color:theme.text+"88" }}>friends</div>
          </div>
        </div>

        {myProfile.badges?.length > 0 && (
          <div className="moon-badges" style={{ marginBottom:14 }}>
            {myProfile.badges.map((b,i) => (
              <span key={i} className="moon-badge" style={{ background:theme.accent+"18", borderColor:theme.accent+"44", color:theme.accent }}>{b}</span>
            ))}
          </div>
        )}

        {myProfile.interests?.length > 0 && (
          <div className="moon-interests">
            {myProfile.interests.map((tag,i) => (
              <span key={i} className="moon-interest" style={{ background:theme.card, borderColor:theme.accent+"33", color:theme.text+"cc" }}>{tag}</span>
            ))}
          </div>
        )}

        <MusicPlayer song={myProfile.currentSong || ""} />

        {myProfile.aboutSections?.map((sec,i) => (
          <div key={i} className="moon-about-section" style={{ background:theme.accent+"0d", borderColor:theme.accent+"22" }}>
            <div className="moon-about-title" style={{ color:theme.accent }}>{sec.title}</div>
            <div className="moon-about-text" style={{ color:theme.text+"cc" }}>{sec.text}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:"0 24px 24px" }}>
        <div className="tabs-row" style={{ background:theme.card, borderColor:theme.accent+"22" }}>
          {[
            { key:"posts",  label:"✦ my posts" },
            { key:"media",  label:"🖼️ media" },
            { key:"liked",  label:"♥ liked" },
          ].map(t => (
            <button key={t.key} className={`tab-btn ${activeTab===t.key?"active":""}`}
              style={activeTab===t.key ? { background:theme.accent+"22", color:theme.text } : { color:theme.text+"77" }}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "posts" && (
          myPosts.length === 0
            ? <div className="empty-state" style={{ color:theme.text+"77" }}><div className="empty-icon">🌙</div>no posts yet — go orbit something!</div>
            : myPosts.map(p => <PostCard key={p.id} post={p} />)
        )}

        {activeTab === "media" && (() => {
          const mp = myPosts.filter(p => p.media);
          return mp.length === 0
            ? <div className="empty-state" style={{ color:theme.text+"77" }}><div className="empty-icon">🖼️</div>no photos or videos yet</div>
            : <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, borderRadius:12, overflow:"hidden" }}>
                {mp.map(p => (
                  <div key={p.id} style={{ aspectRatio:"1", overflow:"hidden", borderRadius:10, background:"rgba(255,255,255,.05)" }}>
                    {p.mediaType==="image"
                      ? <img src={p.media} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <video src={p.media} style={{ width:"100%", height:"100%", objectFit:"cover" }} />}
                  </div>
                ))}
              </div>;
        })()}

        {activeTab === "liked" && (
          <div className="empty-state" style={{ color:theme.text+"77" }}><div className="empty-icon">♡</div>posts you ♥ will appear here</div>
        )}
      </div>

      {editing && <ProfileEditor onSave={handleSave} onClose={() => setEditing(false)} />}
    </div>
  );
}
