import { useApp } from "../context/AppContext";
import { useState, useRef } from "react";
import PostCard from "./PostCard";

export default function Feed() {
  const { posts, addPost, moods, myProfile } = useApp();
  const [draft, setDraft]           = useState("");
  const [selectedMood, setMood]     = useState(moods[0]);
  const [media, setMedia]           = useState(null);
  const [mediaType, setMediaType]   = useState(null);
  const [showMoods, setShowMoods]   = useState(false);
  const fileRef = useRef(null);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setMedia(URL.createObjectURL(f));
    setMediaType(f.type.startsWith("video") ? "video" : "image");
    e.target.value = "";
  }

  function handlePost() {
    if (!draft.trim() && !media) return;
    addPost({ body: draft.trim(), media, mediaType, mood: selectedMood });
    setDraft(""); setMedia(null); setMediaType(null); setShowMoods(false);
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">orbit feed ✦</div>
      </div>

      {/* Composer */}
      <div className="composer">
        <div className="composer-top">
          <div className="composer-avi" style={{ background: myProfile.avatarBg }}>{myProfile.avatar}</div>
          <textarea className="composer-ta"
            placeholder="what's floating through your cosmos? ✦"
            value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && e.metaKey && handlePost()}
          />
        </div>

        {media && (
          <div className="composer-media-preview" style={{ marginTop: 10 }}>
            {mediaType === "image"
              ? <img src={media} alt="preview" style={{ width:"100%", maxHeight:240, objectFit:"cover", borderRadius:12 }} />
              : <video src={media} controls style={{ width:"100%", maxHeight:240, borderRadius:12 }} />}
            <button className="remove-media" onClick={() => { setMedia(null); setMediaType(null); }}>✕</button>
          </div>
        )}

        <div className="composer-footer">
          <div className="composer-tools">
            <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={handleFile} />
            <button className="tool-btn" title="photo" onClick={() => { fileRef.current.accept="image/*"; fileRef.current.click(); }}>🖼️</button>
            <button className="tool-btn" title="video" onClick={() => { fileRef.current.accept="video/*"; fileRef.current.click(); }}>🎞️</button>
            <button className={`tool-btn ${showMoods ? "active" : ""}`} onClick={() => setShowMoods(!showMoods)}>
              {selectedMood.label.split(" ")[0]} mood
            </button>
          </div>
          <button className="post-btn" onClick={handlePost} disabled={!draft.trim() && !media}>
            orbit ✦
          </button>
        </div>

        {showMoods && (
          <div className="mood-selector">
            {moods.map(m => (
              <button key={m.label} className={`mood-chip ${selectedMood.label === m.label ? "selected" : ""}`}
                style={{ background: m.bg + "33", color: m.color, borderColor: m.color + "66" }}
                onClick={() => { setMood(m); setShowMoods(false); }}>
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {posts.map(p => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
