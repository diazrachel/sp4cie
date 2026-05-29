import { useApp } from "../context/AppContext";
import { useState, useRef, useEffect } from "react";

export default function PostCard({ post }) {
  const { getUserById, toggleLike, likedPosts, toggleBoost, boostedPosts, addComment, setProfileModal, deletePost, myProfile, formatTime } = useApp();
  const author = post.authorId === "me" ? myProfile : getUserById(post.authorId);
  const liked   = likedPosts.has(post.id);
  const boosted = boostedPosts.has(post.id);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState("");
  const [menuOpen, setMenuOpen]         = useState(false);
  const menuRef = useRef(null);
  const isOwn   = post.authorId === "me";

  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!author) return null;

  function submitComment() {
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText("");
    setShowComments(true);
  }

  function renderBody(text) {
    return text.split(/(\s+)/).map((w, i) =>
      w.startsWith("#") ? <span key={i} className="post-tag">{w}</span> : w
    );
  }

  return (
    <article className="post">
      <div className="post-header">
        <div className="post-avi" style={{ background: author.avatarBg }}
          onClick={() => post.authorId !== "me" && setProfileModal(author)}>
          {author.avatar}
        </div>
        <div className="post-meta">
          <div className="post-name" onClick={() => post.authorId !== "me" && setProfileModal(author)}>{author.name}</div>
          <div className="post-handle">{author.handle}</div>
        </div>
        <div className="post-time">{formatTime(post.createdAt)}</div>
        {isOwn && (
          <div className="post-menu" ref={menuRef}>
            <button className="post-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>···</button>
            {menuOpen && (
              <div className="post-menu-dd">
                <button className="danger" onClick={() => { deletePost(post.id); setMenuOpen(false); }}>🗑️ delete</button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.mood && (
        <div className="post-mood-badge" style={{ background: post.mood.bg + "22", color: post.mood.color }}>
          {post.mood.label}
        </div>
      )}

      {post.body && <div className="post-body">{renderBody(post.body)}</div>}

      {post.media && post.mediaType === "image" && <img className="post-media" src={post.media} alt="post" />}
      {post.media && post.mediaType === "video" && <video className="post-video" src={post.media} controls />}

      <div className="post-actions">
        <button className={`act-btn ${liked ? "liked" : ""}`} onClick={() => toggleLike(post.id)}>
          {liked ? "♥" : "♡"} {post.likes}
        </button>
        <button className="act-btn" onClick={() => setShowComments(!showComments)}>
          💬 {post.comments.length > 0 ? post.comments.length : "reply"}
        </button>
        <button className={`act-btn ${boosted ? "boosted" : ""}`} onClick={() => toggleBoost(post.id)}>
          ✦ {boosted ? "boosted" : "boost"} {post.boosts > 0 ? post.boosts : ""}
        </button>
      </div>

      {showComments && (
        <div className="comments-area">
          {post.comments.map(c => {
            const cu = c.userId === "me" ? myProfile : getUserById(c.userId);
            return (
              <div key={c.id} className="comment">
                <div className="comment-avi" style={{ background: cu?.avatarBg || "var(--cloud-soft)" }}>{cu?.avatar || "✦"}</div>
                <div className="comment-bubble">
                  <div className="comment-author">{cu?.name || "you"}</div>
                  <div className="comment-text">{c.text}</div>
                </div>
              </div>
            );
          })}
          <div className="comment-input-row">
            <input className="comment-input" placeholder="float a reply ☁️"
              value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitComment()} />
            <button className="comment-send" onClick={submitComment}>send ✦</button>
          </div>
        </div>
      )}
    </article>
  );
}
