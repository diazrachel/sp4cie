// ─── SEED USERS ──────────────────────────────────────────────────────────────
export const SEED_USERS = [
  {
    id:"nova", name:"nova starling", handle:"@novastarling",
    avatar:"🌸", avatarBg:"linear-gradient(135deg,#fce4ec,#f3e5f5)",
    bannerBg:"linear-gradient(135deg,#f8bbd0,#ce93d8)",
    bio:"making tiny digital gardens 🌱 soft things only. she/her ✨",
    website:"novastarling.co",
    interests:["🎨 art","🌿 plants","🎵 indie pop","✨ stickers","🌙 moon phases"],
    mood:"☁️ dreamy", followers:842, following:391, isOnline:true,
    profileTheme:"aurora", profileFont:"serif", profileColor:"#ce93d8",
    badges:["🌟 early star","🎨 creator","💫 rising"],
    aboutSections:[{title:"about me",text:"i make things. mostly art and sadness lol"},{title:"currently",text:"listening to mitski on repeat 🎵"}],
    spotifyEmbed: null,
  },
  {
    id:"clem", name:"clem fox", handle:"@clemfox",
    avatar:"🦊", avatarBg:"linear-gradient(135deg,#fff8e1,#ffe0b2)",
    bannerBg:"linear-gradient(135deg,#ffcc80,#ffab91)",
    bio:"photographer 📷 bookworm 📚 coffee shop regular",
    website:"clemfox.film",
    interests:["📷 photography","☕ coffee","📚 books","🌅 sunsets"],
    mood:"☕ cozy", followers:1204, following:520, isOnline:true,
    profileTheme:"nebula", profileFont:"mono", profileColor:"#ffab91",
    badges:["📷 photographer","⭐ verified","🔥 trending"],
    aboutSections:[{title:"about me",text:"chasing golden hour forever"},{title:"currently",text:"reading: the secret history"}],
    spotifyEmbed: null,
  },
  {
    id:"rae", name:"rae bloom", handle:"@raebloom",
    avatar:"🌻", avatarBg:"linear-gradient(135deg,#e8f5e9,#b2dfdb)",
    bannerBg:"linear-gradient(135deg,#a5d6a7,#80cbc4)",
    bio:"she/her 🌻 ceramics & cottagecore 🍄 slow living",
    website:"",
    interests:["🏺 ceramics","🍄 foraging","🌿 cottagecore","🎨 watercolor"],
    mood:"🌿 soft", followers:673, following:289, isOnline:false,
    profileTheme:"forest", profileFont:"handwritten", profileColor:"#80cbc4",
    badges:["🌿 nature lover","🏺 artisan"],
    aboutSections:[{title:"about me",text:"slow living advocate 🌿"},{title:"currently",text:"making a new glaze recipe"}],
    spotifyEmbed: null,
  },
  {
    id:"kit", name:"kit vela", handle:"@kitvela",
    avatar:"🌙", avatarBg:"linear-gradient(135deg,#ede7f6,#d1c4e9)",
    bannerBg:"linear-gradient(135deg,#b39ddb,#9fa8da)",
    bio:"🌙 night owl. synth music & pixel art. cozy games forever",
    website:"kitvela.itch.io",
    interests:["🎮 games","🎹 synth","🌙 night","🖥️ pixel art"],
    mood:"🌙 moody", followers:2110, following:840, isOnline:true,
    profileTheme:"void", profileFont:"mono", profileColor:"#b39ddb",
    badges:["🌙 night owl","🎮 gamer","💜 og member"],
    aboutSections:[{title:"about me",text:"i make music and games sometimes"},{title:"currently",text:"composing at 2am as usual"}],
    spotifyEmbed: null,
  },
  {
    id:"pearl", name:"pearl misu", handle:"@pearlmisu",
    avatar:"🐚", avatarBg:"linear-gradient(135deg,#fce4ec,#fff9c4)",
    bannerBg:"linear-gradient(135deg,#f48fb1,#fff176)",
    bio:"baker 🍰 vintage collector 🎀 soft pop girlie. she/they",
    website:"",
    interests:["🍰 baking","🎀 vintage","🌸 kawaii","💿 pop"],
    mood:"🍰 sweet", followers:967, following:445, isOnline:true,
    profileTheme:"candy", profileFont:"rounded", profileColor:"#f48fb1",
    badges:["🍰 baker","🎀 fashionista","🌸 sweetie"],
    aboutSections:[{title:"about me",text:"baking is my love language 🍓"},{title:"currently",text:"testing a new macaroon recipe"}],
    spotifyEmbed: null,
  },
  {
    id:"sol", name:"sol haven", handle:"@solhaven",
    avatar:"🌤️", avatarBg:"linear-gradient(135deg,#e3f2fd,#b3e5fc)",
    bannerBg:"linear-gradient(135deg,#81d4fa,#b3e5fc)",
    bio:"cloud chaser ☁️ weather nerd 🌦️ morning person somehow",
    website:"",
    interests:["☁️ clouds","🌦️ weather","🌅 sunrise","📸 sky photos"],
    mood:"☁️ drifting", followers:534, following:310, isOnline:false,
    profileTheme:"sky", profileFont:"serif", profileColor:"#81d4fa",
    badges:["☁️ cloud chaser","🌅 early bird"],
    aboutSections:[{title:"about me",text:"professional cloud watcher ☁️"}],
    spotifyEmbed: null,
  },
];

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
  serif:       { name:"serif",       family:"'Georgia', serif",                          label:"Elegant ✦" },
  sans:        { name:"sans",        family:"'Nunito', sans-serif",                      label:"Clean ○" },
  mono:        { name:"mono",        family:"'Courier New', monospace",                  label:"Retro ▪" },
  rounded:     { name:"rounded",     family:"'Nunito', sans-serif",                      label:"Soft ◦" },
  handwritten: { name:"handwritten", family:"'Georgia', cursive",                        label:"Dreamy ☽" },
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

// ─── SEED POSTS ───────────────────────────────────────────────────────────────
export const SEED_POSTS = [
  { id:"p1", authorId:"clem",  body:"golden hour hit different today 🌅 sharing because it felt too good to keep",         media:null, mediaType:null, tags:["#photography","#goldenHour"], mood:{ label:"☀️ glowing", bg:"#fff8e1", color:"#f9a825" }, createdAt:Date.now()-3*60000,      likes:47, comments:[], boosts:12 },
  { id:"p2", authorId:"pearl", body:"tried a new lavender earl grey shortbread recipe and honestly?? life changing 🍋",    media:null, mediaType:null, tags:["#baking","#cottagecore"],    mood:{ label:"🍰 content", bg:"#fce4ec", color:"#c2185b" }, createdAt:Date.now()-12*60000,     likes:83, comments:[], boosts:29 },
  { id:"p3", authorId:"nova",  body:"reminder that you're allowed to rest. log off. touch grass. your little digital garden can wait 🌱", media:null, mediaType:null, tags:["#softLife","#cloudMind"], mood:{ label:"🌸 gentle", bg:"#ede7f6", color:"#6a1b9a" }, createdAt:Date.now()-31*60000, likes:201, comments:[], boosts:88 },
  { id:"p4", authorId:"kit",   body:"working on this ambient synth piece at 2am and everything feels possible ☁️ the void is productive tonight", media:null, mediaType:null, tags:["#music","#nightOwl","#sp4cie"], mood:{ label:"🌙 wired", bg:"#ede7f6", color:"#512da8" }, createdAt:Date.now()-60*60000,  likes:132, comments:[], boosts:41 },
  { id:"p5", authorId:"rae",   body:"my ceramics class made little pinch pots today. mine looks like a tiny nervous frog and i love him 🐸", media:null, mediaType:null, tags:["#ceramics","#art"],          mood:{ label:"🏺 creative",bg:"#e8f5e9", color:"#388e3c" }, createdAt:Date.now()-2*3600000, likes:95, comments:[], boosts:22 },
  { id:"p6", authorId:"sol",   body:"the clouds this morning were giving main character energy ☁️✨ woke up at 6am just for this sky", media:null, mediaType:null, tags:["#cloudWatching","#sp4cie"],  mood:{ label:"🌤️ airy",   bg:"#e3f2fd", color:"#1565c0" }, createdAt:Date.now()-3*3600000, likes:68, comments:[], boosts:18 },
];

// ─── SEED CHAT ────────────────────────────────────────────────────────────────
export const SEED_CHAT = [
  { id:"c1", userId:"nova",  text:"omg did anyone see the cloud formations today?? 🌤️", time:"10:24am" },
  { id:"c2", userId:"pearl", text:"YES omg looked like cotton candy 🍬☁️",               time:"10:25am" },
  { id:"c3", userId:"kit",   text:"i missed it 😭 someone share photos pls",              time:"10:26am" },
  { id:"c4", userId:"sol",   text:"posting to my moon right now hold on ☁️",              time:"10:27am" },
  { id:"c5", userId:"clem",  text:"you all are so cute lol 🌸",                           time:"10:28am" },
];

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

export const CHAT_AUTO_REPLIES = [
  "omg yes!! ☁️","same energy 🌸","wait really?? 👀","hehe 🍄",
  "yesss 💕","sending love ✨","cloud brain activated ☁️✨","this is so real 🌿",
  "🫧🫧🫧","literally same","i felt that","no thoughts, head empty ☁️",
  "ok but why is this so true","besties for real","☁️ vibes","mood 🌙",
];
