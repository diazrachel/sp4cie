# ✦ sp4cie

a soft, cosmic social media app — myspace meets the stars.

## features

- 🔐 **auth** — sign up with email + username + password, login, logout, session persistence
- 🧙 **onboarding wizard** — 3-step profile setup (avatar, banner, theme → bio, mood, interests → preview)
- ✦ **orbit feed** — post text, photos & videos with moods, hashtags, likes, boosts, comments; delete your own posts
- 🌌 **discover** — search/filter/follow users; see their badges, posts count, mood
- ☁️ **cloud nine** — unique floating chat where messages drift and gently fade like clouds, with auto-replies
- 🌙 **my moon** — full myspace-style profile with:
  - 10 page themes (aurora, nebula, void, sky, forest, candy, galaxy, lunar, sunrise, blossom)
  - 5 font styles
  - 12 banner gradients
  - 30 avatar emojis
  - music player (song selector)
  - mood badge
  - badges (from a catalog of 20)
  - interests (30 options)
  - custom about sections (add/remove/edit)
  - posts, media grid, liked tabs
- 👤 **profile modals** — full view of any user (about sections, badges, interests, posts, follow button)
- 🌠 **animated starfield** — 120 twinkling stars in the background
- ☁️ **drifting clouds** — soft cloud shapes drift across the cosmos

## quick start

```bash
npm install
npm run dev
# open http://localhost:5173
```

---

## 🚀 deploying as a real website

### option 1 — vercel (easiest, free)

1. push your project to github:
   ```bash
   git init
   git add .
   git commit -m "sp4cie launch ✦"
   gh repo create sp4cie --public --push --source=.
   ```
2. go to **vercel.com** → sign up with github
3. click **"add new project"** → import your sp4cie repo
4. vercel auto-detects vite. just click **deploy**
5. you'll get a live URL like `sp4cie.vercel.app` instantly ✦
6. for a custom domain (e.g. `sp4cie.com`): buy it on namecheap/google domains, then add it in vercel → project → settings → domains

### option 2 — netlify (also free)

1. push to github (same as above)
2. go to **netlify.com** → new site from git → pick your repo
3. build command: `npm run build`
4. publish directory: `dist`
5. click deploy. done!

### option 3 — deploy manually

```bash
npm run build       # creates a /dist folder
```
then upload the `/dist` folder to any static host:
- **github pages** — push dist to gh-pages branch
- **cloudflare pages** — drag & drop dist folder at pages.cloudflare.com
- **firebase hosting** — `firebase deploy`

---

## ⚠️ important notes for going live

### authentication
right now passwords are stored in **localStorage** (fine for demo/prototype).
for a real production app you need a backend:

**recommended stack:**
- **backend**: supabase (free tier, postgres + auth built in)
- **auth**: supabase auth handles password hashing, sessions, email verification
- **database**: supabase postgres for posts, users, follows, chat messages
- **file storage**: supabase storage for photos/videos (or cloudinary)

**supabase quickstart:**
```bash
npm install @supabase/supabase-js
```
replace localStorage calls in `AuthContext.jsx` with supabase auth calls.
posts/chat would go in supabase tables instead of useState.

### media uploads
currently photos/videos are stored as blob: URLs (memory only, lost on refresh).
for persistence: upload to **cloudinary** or **supabase storage** and save the URL.

### real-time chat
for cloud nine to work in real-time across users:
use **supabase realtime** (built in) or **pusher** to broadcast messages.

---

## project structure

```
sp4cie/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data.js                     ← all seed data, constants, moods, themes
    ├── context/
    │   ├── AuthContext.jsx          ← auth state: signup, login, session
    │   └── AppContext.jsx           ← app state: posts, chat, users, profile
    ├── styles/
    │   └── global.css              ← full space+cloud theme
    └── components/
        ├── auth/
        │   ├── Landing.jsx
        │   ├── Signup.jsx
        │   ├── Login.jsx
        │   └── ProfileSetup.jsx    ← 3-step onboarding
        ├── profile/
        │   └── ProfileEditor.jsx   ← full myspace-style customizer
        ├── Starfield.jsx           ← twinkling star background
        ├── Sidebar.jsx
        ├── Feed.jsx                ← orbit feed + composer
        ├── Discover.jsx            ← browse + follow users
        ├── CloudNine.jsx           ← floating cloud chat
        ├── MyMoon.jsx              ← themed profile page
        ├── PostCard.jsx            ← post with likes/comments/boosts
        ├── ProfileModal.jsx        ← user profile popup
        └── RightPanel.jsx          ← mini card, chat, suggestions
```
