// ─── NO SEED USERS — real users only ─────────────────────────────────────────
export const SEED_USERS = [];

// ─── MOODS ───────────────────────────────────────────────────────────────────
export const MOODS = [
  { label:"☁️ dreamy",   bg:"#e8eaf6", color:"#5c6bc0" },
  { label:"☕ cozy",     bg:"#fff8e1", color:"#f9a825" },
  { label:"🌿 soft",     bg:"#e8f5e9", color:"#388e3c" },
  { label:"✨ sparkly",  bg:"#fce4ec", color:"#c2185b" },
  { label:"🌙 moody",    bg:"#ede7f6", color:"#6a1b9a" },
  { label:"🍰 sweet",    bg:"#fff3e0", color:"#e65100" },
  { label:"🌤️ airy",     bg:"#e3f2fd", color:"#1565c0" },
  { label:"🔮 mystic",   bg:"#f3e5f5", color:"#7b1fa2" },
  { label:"🌙 lunar",    bg:"#e8eaf6", color:"#3949ab" },
  { label:"⭐ cosmic",   bg:"#ede7f6", color:"#512da8" },
];

// ─── PROFILE THEMES ──────────────────────────────────────────────────────────
export const PROFILE_THEMES = {
  aurora:  { name:"aurora",   bg:"linear-gradient(160deg,#1a1a2e 0%,#16213e 40%,#0f3460 70%,#533483 100%)", card:"rgba(255,255,255,0.07)", text:"#e8d5ff", accent:"#c084fc" },
  nebula:  { name:"nebula",   bg:"linear-gradient(160deg,#0d0d1a 0%,#1a0a2e 50%,#2d1b69 100%)",             card:"rgba(255,255,255,0.06)", text:"#ffd6e0", accent:"#fb7185" },
  void:    { name:"void",     bg:"linear-gradient(160deg,#020209 0%,#0a0a1a 50%,#1a1a2e 100%)",             card:"rgba(255,255,255,0.05)", text:"#c4b5fd", accent:"#a78bfa" },
  sky:     { name:"sky",      bg:"linear-gradient(160deg,#e0f2fe 0%,#bae6fd 50%,#e0e7ff 100%)",             card:"rgba(255,255,255,0.6)",  text:"#1e3a5f", accent:"#0ea5e9" },
  forest:  { name:"forest",   bg:"linear-gradient(160deg,#f0fdf4 0%,#dcfce7 50%,#d1fae5 100%)",             card:"rgba(255,255,255,0.6)",  text:"#14532d", accent:"#16a34a" },
  candy:   { name:"candy",    bg:"linear-gradient(160deg,#fff0f6 0%,#ffe4f0 50%,#fef3c7 100%)",             card:"rgba(255,255,255,0.65)", text:"#831843", accent:"#ec4899" },
  galaxy:  { name:"galaxy",   bg:"linear-gradient(160deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",             card:"rgba(255,255,255,0.06)", text:"#e2d9f3", accent:"#818cf8" },
  lunar:   { name:"lunar",    bg:"linear-gradient(160deg,#13111c 0%,#1e1b2e 50%,#2d2b3d 100%)",             card:"rgba(255,255,255,0.07)", text:"#e2e8f0", accent:"#94a3b8" },
  sunrise: { name:"sunrise",  bg:"linear-gradient(160deg,#fff7ed 0%,#fed7aa 50%,#fde68a 100%)",             card:"rgba(255,255,255,0.6)",  text:"#7c2d12", accent:"#ea580c" },
  blossom: { name:"blossom",  bg:"linear-gradient(160deg,#fdf2f8 0%,#fce7f3 50%,#ede9fe 100%)",             card:"rgba(255,255,255,0.65)", text:"#701a75", accent:"#d946ef" },
};

// ─── PROFILE FONTS ───────────────────────────────────────────────────────────
export const PROFILE_FONTS = {
  serif:       { name:"serif",       family:"'Georgia', serif",         label:"Elegant ✦" },
  sans:        { name:"sans",        family:"'Nunito', sans-serif",      label:"Clean ○" },
  mono:        { name:"mono",        family:"'Courier New', monospace",  label:"Retro ▪" },
  rounded:     { name:"rounded",     family:"'Nunito', sans-serif",      label:"Soft ◦" },
  handwritten: { name:"handwritten", family:"'Georgia', cursive",        label:"Dreamy ☽" },
};

// ─── AVATAR OPTIONS ───────────────────────────────────────────────────────────
export const AVATAR_OPTIONS = [
  "🌷","🌸","🌻","🌺","🍀","🌿","🌙","⭐","✨","☁️",
  "🌤️","🦋","🐚","🦊","🐸","🎀","🍰","🍄","🌈","🔮",
  "🪐","💫","🌟","🌠","🌌","🦄","🐉","🦚","🌊","❄️",
];

// ─── BANNER GRADIENTS ─────────────────────────────────────────────────────────
export const BANNERS = [
  "linear-gradient(135deg,#f9a8c9,#c5b8f0)",
  "linear-gradient(135deg,#c5b8f0,#9de0c8)",
  "linear-gradient(135deg,#fde68a,#ffb99a)",
  "linear-gradient(135deg,#b3e5fc,#b39ddb)",
  "linear-gradient(135deg,#a5d6a7,#80cbc4)",
  "linear-gradient(135deg,#f48fb1,#fff176)",
  "linear-gradient(135deg,#81d4fa,#f9a8c9)",
  "linear-gradient(135deg,#ce93d8,#80cbc4)",
  "linear-gradient(135deg,#1a1a2e,#533483)",
  "linear-gradient(135deg,#0f0c29,#302b63)",
  "linear-gradient(135deg,#020209,#1a1a2e)",
  "linear-gradient(135deg,#13111c,#2d2b3d)",
];

// ─── INTEREST OPTIONS ─────────────────────────────────────────────────────────
export const INTEREST_OPTIONS = [
  "☁️ cloud watching","🌸 soft aesthetics","🎨 art & design","📷 photography",
  "🎵 music","🌿 cottagecore","🍰 baking","📚 books","🎮 gaming","🌙 night owl",
  "🏺 ceramics","🎹 music production","🌅 sunsets","☕ coffee","🍄 foraging",
  "✨ stickers","🌱 plants","🎀 vintage","🌈 rainbows","🔮 mystical",
  "🪐 space","💫 stars","🌌 galaxies","🦋 butterflies","🎭 theatre",
  "🖥️ pixel art","🌊 ocean","❄️ winter","🎬 film","🍓 soft food",
];

// ─── BADGES ───────────────────────────────────────────────────────────────────
export const BADGE_CATALOG = [
  "🌟 early star","🎨 creator","💫 rising","📷 photographer","⭐ verified",
  "🔥 trending","🌿 nature lover","🏺 artisan","🌙 night owl","🎮 gamer",
  "💜 og member","🍰 baker","🎀 fashionista","🌸 sweetie","☁️ cloud chaser",
  "🌅 early bird","🎵 musician","📚 bookworm","🔮 mystic","🪐 space nerd",
];

// ─── EMPTY SEEDS (no bots) ────────────────────────────────────────────────────
export const SEED_POSTS = [];
export const SEED_CHAT  = [];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function formatTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000)    return "just now";
  if (diff < 3600000)  return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return `${Math.floor(diff/86400000)}d ago`;
}

export function nowTime() {
  return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
}

// kept for cloud nine typing feel — no bots use this anymore
export const CHAT_AUTO_REPLIES = [];
