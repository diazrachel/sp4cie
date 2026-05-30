import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export const AuthContext = createContext()

// Internal fake email so Supabase auth works without real emails
function usernameToEmail(username) {
  return `${username.toLowerCase().trim()}@sp4cie.app`
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [step, setStep]       = useState('loading')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else setStep('landing')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else { setProfile(null); setStep('landing') }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) { setProfile(data); setStep('app') }
    else setStep('setup')
  }

  async function signup({ username, password }) {
    const uname = username.toLowerCase().trim()
    if (uname.length < 3) return { error: 'Username must be at least 3 characters' }
    if (/[^a-zA-Z0-9_.]/.test(uname)) return { error: 'Letters, numbers, _ and . only' }
    if (password.length < 6) return { error: 'Password must be at least 6 characters' }
    // check username taken
    const { data: existing } = await supabase.from('profiles').select('id').eq('username', uname).maybeSingle()
    if (existing) return { error: 'That handle is already taken 🌙' }
    const email = usernameToEmail(uname)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username: uname } }
    })
    if (error) return { error: error.message }
    return { success: true }
  }

  async function login({ username, password }) {
    const uname = username.toLowerCase().trim()
    const email = usernameToEmail(uname)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: 'Wrong username or password 🌙' }
    return { success: true }
  }

  async function completeSetup(profileData) {
    const userId = session?.user?.id
    if (!userId) return { error: 'Not logged in' }
    const username = profileData.username || session.user.user_metadata?.username || `star_${Date.now()}`
    const { error } = await supabase.from('profiles').insert({
      id: userId,
      username: username.toLowerCase().trim(),
      name: profileData.name || username,
      avatar: profileData.avatar || '🌙',
      avatar_bg: profileData.avatarBg || 'linear-gradient(135deg,#ede7f6,#d1c4e9)',
      banner_bg: profileData.bannerBg || 'linear-gradient(135deg,#b39ddb,#9fa8da)',
      bio: profileData.bio || '',
      mood: profileData.mood || '🌙 lunar',
      profile_theme: profileData.profileTheme || 'lunar',
      profile_font: profileData.profileFont || 'sans',
      interests: profileData.interests || [],
      badges: ['🌟 early star'],
      about_sections: profileData.aboutSections || [{ title: 'about me', text: 'new to sp4cie ✦' }],
      current_song: '',
      custom_css: '',
      custom_html: '',
      profile_pic_url: null,
      banner_url: null,
      profile_music_url: null,
    })
    if (error) return { error: error.message }
    await loadProfile(userId)
    return { success: true }
  }

  async function updateProfile(updates) {
    const userId = session?.user?.id
    if (!userId) return { error: 'Not logged in' }
    const map = {
      name:'name', avatar:'avatar', avatarBg:'avatar_bg', bannerBg:'banner_bg',
      bio:'bio', website:'website', mood:'mood', profileTheme:'profile_theme',
      profileFont:'profile_font', interests:'interests', badges:'badges',
      aboutSections:'about_sections', currentSong:'current_song',
      customCss:'custom_css', customHtml:'custom_html',
      profilePicUrl:'profile_pic_url', bannerUrl:'banner_url',
      profileMusicUrl:'profile_music_url',
    }
    const dbUpdates = {}
    for (const [k, v] of Object.entries(updates)) {
      if (map[k] !== undefined) dbUpdates[map[k]] = v
    }
    const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId)
    if (!error) await loadProfile(userId)
    return error ? { error: error.message } : { success: true }
  }

  async function logout() { await supabase.auth.signOut() }
  function goTo(s) { setStep(s) }

  function dbToProfile(row) {
    if (!row) return null
    return {
      id: row.id,
      username: row.username,
      name: row.name || row.username,
      handle: `@${row.username}`,
      avatar: row.avatar || '🌙',
      avatarBg: row.avatar_bg || 'linear-gradient(135deg,#ede7f6,#d1c4e9)',
      bannerBg: row.banner_bg || 'linear-gradient(135deg,#b39ddb,#9fa8da)',
      profilePicUrl: row.profile_pic_url || null,
      bannerUrl: row.banner_url || null,
      bio: row.bio || '',
      website: row.website || '',
      mood: row.mood || '🌙 lunar',
      profileTheme: row.profile_theme || 'lunar',
      profileFont: row.profile_font || 'sans',
      interests: row.interests || [],
      badges: row.badges || [],
      aboutSections: row.about_sections || [],
      currentSong: row.current_song || '',
      customCss: row.custom_css || '',
      customHtml: row.custom_html || '',
      profileMusicUrl: row.profile_music_url || null,
      isOnline: true,
    }
  }

  const myProfile = dbToProfile(profile)

  return (
    <AuthContext.Provider value={{
      session, step, goTo, myProfile,
      signup, login, logout,
      completeSetup, updateProfile, dbToProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
