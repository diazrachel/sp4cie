import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'
import { MOODS, formatTime, nowTime } from '../data.js'

export const AppContext = createContext()

export function AppProvider({ children }) {
  const { myProfile, session, dbToProfile } = useAuth()

  const [tab, setTab]           = useState('home')
  const [posts, setPosts]       = useState([])
  const [users, setUsers]       = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [friendChats, setFriendChats]   = useState([])
  const [activeFriendChat, setActiveFriendChat] = useState(null)
  const [profileModal, setProfileModal] = useState(null)
  const [likedPosts, setLikedPosts]     = useState(new Set())
  const [boostedPosts, setBoostedPosts] = useState(new Set())
  const [following, setFollowing]       = useState(new Set())
  const [followers, setFollowers]       = useState(new Set())
  const [loading, setLoading]           = useState(true)

  const moods = MOODS
  const userId = session?.user?.id

  // ── INITIAL LOAD ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return
    Promise.all([
      loadPosts(),
      loadUsers(),
      loadChatMessages(),
      loadFollowData(),
      loadLikes(),
      loadFriendChats(),
    ]).finally(() => setLoading(false))
  }, [userId])

  // ── REALTIME SUBSCRIPTIONS ─────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return

    // new posts
    const postSub = supabase.channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' },
        payload => { loadPosts() })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' },
        payload => { setPosts(prev => prev.filter(p => p.id !== payload.old.id)) })
      .subscribe()

    // cloud nine chat
    const chatSub = supabase.channel('cloud_nine')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cloud_nine' },
        payload => { loadChatMessages() })
      .subscribe()

    // friend messages
    const dmSub = supabase.channel('friend_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'friend_messages' },
        payload => { loadFriendChats() })
      .subscribe()

    // follows
    const followSub = supabase.channel('follows')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follows' },
        () => loadFollowData())
      .subscribe()

    return () => {
      supabase.removeChannel(postSub)
      supabase.removeChannel(chatSub)
      supabase.removeChannel(dmSub)
      supabase.removeChannel(followSub)
    }
  }, [userId])

  // ── LOADERS ────────────────────────────────────────────────────────────────
  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select(`*, profiles(id, username, name, avatar, avatar_bg, banner_bg, mood, profile_theme), comments(id)`)
      .order('created_at', { ascending: false })
    if (data) {
      setPosts(data.map(p => ({
        id: p.id,
        authorId: p.author_id,
        author: p.profiles ? dbToProfile(p.profiles) : null,
        body: p.body || '',
        media: p.media_url || null,
        mediaType: p.media_type || null,
        tags: p.tags || [],
        mood: p.mood_label ? { label: p.mood_label, bg: p.mood_bg, color: p.mood_color } : null,
        likes: p.likes || 0,
        boosts: p.boosts || 0,
        comments: p.comments || [],
        createdAt: new Date(p.created_at).getTime(),
      })))
    }
  }

  async function loadUsers() {
    if (!userId) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', userId)
    if (data) setUsers(data.map(dbToProfile))
  }

  async function loadChatMessages() {
    const { data } = await supabase
      .from('cloud_nine')
      .select(`*, profiles(id, username, name, avatar, avatar_bg)`)
      .order('created_at', { ascending: true })
      .limit(100)
    if (data) {
      setChatMessages(data.map(m => ({
        id: m.id,
        userId: m.author_id,
        author: m.profiles ? dbToProfile(m.profiles) : null,
        text: m.body,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })))
    }
  }

  async function loadFollowData() {
    if (!userId) return
    // who I follow
    const { data: fing } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)
    if (fing) setFollowing(new Set(fing.map(r => r.following_id)))

    // who follows me
    const { data: fers } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', userId)
    if (fers) setFollowers(new Set(fers.map(r => r.follower_id)))
  }

  async function loadLikes() {
    if (!userId) return
    const { data } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', userId)
    if (data) setLikedPosts(new Set(data.map(r => r.post_id)))
  }

  async function loadFriendChats() {
    if (!userId) return
    const { data: memberRows } = await supabase
      .from('friend_chat_members')
      .select('chat_id')
      .eq('user_id', userId)
    if (!memberRows || memberRows.length === 0) return

    const chatIds = memberRows.map(r => r.chat_id)
    const { data: chats } = await supabase
      .from('friend_chats')
      .select('*')
      .in('id', chatIds)
    if (!chats) return

    const chatsWithData = await Promise.all(chats.map(async chat => {
      const { data: members } = await supabase
        .from('friend_chat_members')
        .select('user_id')
        .eq('chat_id', chat.id)
      const { data: messages } = await supabase
        .from('friend_messages')
        .select(`*, profiles(id, username, name, avatar, avatar_bg)`)
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: true })
      return {
        id: chat.id,
        isDM: chat.is_dm,
        name: chat.name,
        members: (members || []).map(m => m.user_id).filter(id => id !== userId),
        messages: (messages || []).map(m => ({
          id: m.id,
          userId: m.author_id,
          author: m.profiles ? dbToProfile(m.profiles) : null,
          text: m.body,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })),
      }
    }))
    setFriendChats(chatsWithData)
  }

  // ── FRIENDS (mutual follows) ───────────────────────────────────────────────
  const friends = useMemo(() => {
    const m = new Set()
    for (const id of following) { if (followers.has(id)) m.add(id) }
    return m
  }, [following, followers])

  const myStarCount      = followers.size
  const myFollowingCount = following.size
  const myFriendCount    = friends.size

  const getUserById = useCallback(id => {
    if (!id) return null
    if (id === userId) return myProfile
    return users.find(u => u.id === id) || null
  }, [users, myProfile, userId])

  // ── POSTS ──────────────────────────────────────────────────────────────────
  const addPost = useCallback(async ({ body, media, mediaType, mood }) => {
    if (!userId) return
    let mediaUrl = null
    // upload media to supabase storage if present
    if (media && mediaType) {
      const ext  = mediaType === 'video' ? 'mp4' : 'jpg'
      const path = `${userId}/${Date.now()}.${ext}`
      const blob = await fetch(media).then(r => r.blob())
      const { data: upload } = await supabase.storage
        .from('sp4cie-media')
        .upload(path, blob, { contentType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg' })
      if (upload) {
        const { data: urlData } = supabase.storage.from('sp4cie-media').getPublicUrl(path)
        mediaUrl = urlData?.publicUrl || null
      }
    }
    await supabase.from('posts').insert({
      author_id: userId,
      body: body || '',
      media_url: mediaUrl,
      media_type: media ? mediaType : null,
      tags: (body || '').match(/#\w+/g) || [],
      mood_label: mood?.label || null,
      mood_bg: mood?.bg || null,
      mood_color: mood?.color || null,
    })
    // realtime will trigger loadPosts
  }, [userId])

  const toggleLike = useCallback(async postId => {
    if (!userId) return
    const liked = likedPosts.has(postId)
    // optimistic update
    setLikedPosts(prev => { const n = new Set(prev); liked ? n.delete(postId) : n.add(postId); return n })
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p))
    if (liked) {
      await supabase.from('likes').delete().match({ user_id: userId, post_id: postId })
      await supabase.from('posts').update({ likes: posts.find(p=>p.id===postId)?.likes - 1 }).eq('id', postId)
    } else {
      await supabase.from('likes').insert({ user_id: userId, post_id: postId })
      await supabase.from('posts').update({ likes: (posts.find(p=>p.id===postId)?.likes || 0) + 1 }).eq('id', postId)
    }
  }, [userId, likedPosts, posts])

  const toggleBoost = useCallback(async postId => {
    if (!userId) return
    const boosted = boostedPosts.has(postId)
    setBoostedPosts(prev => { const n = new Set(prev); boosted ? n.delete(postId) : n.add(postId); return n })
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, boosts: p.boosts + (boosted ? -1 : 1) } : p))
    await supabase.from('posts').update({ boosts: (posts.find(p=>p.id===postId)?.boosts || 0) + (boosted ? -1 : 1) }).eq('id', postId)
  }, [userId, boostedPosts, posts])

  const addComment = useCallback(async (postId, text) => {
    if (!userId) return
    await supabase.from('comments').insert({ post_id: postId, author_id: userId, body: text })
    await loadPosts()
  }, [userId])

  const deletePost = useCallback(async postId => {
    if (!userId) return
    await supabase.from('posts').delete().eq('id', postId).eq('author_id', userId)
    setPosts(prev => prev.filter(p => p.id !== postId))
  }, [userId])

  // ── CLOUD NINE CHAT ────────────────────────────────────────────────────────
  const sendChat = useCallback(async text => {
    if (!userId) return
    await supabase.from('cloud_nine').insert({ author_id: userId, body: text })
    // realtime triggers loadChatMessages
  }, [userId])

  // ── FOLLOW ─────────────────────────────────────────────────────────────────
  const toggleFollow = useCallback(async targetId => {
    if (!userId || targetId === userId) return
    const isFollowing = following.has(targetId)
    // optimistic
    setFollowing(prev => { const n = new Set(prev); isFollowing ? n.delete(targetId) : n.add(targetId); return n })
    if (isFollowing) {
      await supabase.from('follows').delete().match({ follower_id: userId, following_id: targetId })
    } else {
      await supabase.from('follows').insert({ follower_id: userId, following_id: targetId })
    }
  }, [userId, following])

  // ── FRIEND CHATS ───────────────────────────────────────────────────────────
  const openFriendDM = useCallback(async friendId => {
    if (!userId) return
    // check if DM already exists
    const existing = friendChats.find(c => c.isDM && c.members.includes(friendId))
    if (existing) { setActiveFriendChat(existing.id); return }

    // create new DM
    const { data: chat } = await supabase.from('friend_chats').insert({ is_dm: true, name: null }).select().single()
    if (!chat) return
    await supabase.from('friend_chat_members').insert([
      { chat_id: chat.id, user_id: userId },
      { chat_id: chat.id, user_id: friendId },
    ])
    await loadFriendChats()
    setActiveFriendChat(chat.id)
  }, [userId, friendChats])

  const createGroupChat = useCallback(async (name, memberIds) => {
    if (!userId) return
    const { data: chat } = await supabase.from('friend_chats').insert({ is_dm: false, name: name || 'new group ✦' }).select().single()
    if (!chat) return
    await supabase.from('friend_chat_members').insert([
      { chat_id: chat.id, user_id: userId },
      ...memberIds.map(id => ({ chat_id: chat.id, user_id: id })),
    ])
    await loadFriendChats()
    setActiveFriendChat(chat.id)
  }, [userId])

  const sendFriendMessage = useCallback(async (chatId, text) => {
    if (!userId) return
    await supabase.from('friend_messages').insert({ chat_id: chatId, author_id: userId, body: text })
    await loadFriendChats()
  }, [userId])

  const leaveFriendChat = useCallback(async chatId => {
    if (!userId) return
    await supabase.from('friend_chat_members').delete().match({ chat_id: chatId, user_id: userId })
    setFriendChats(prev => prev.filter(c => c.id !== chatId))
    setActiveFriendChat(null)
  }, [userId])

  return (
    <AppContext.Provider value={{
      tab, setTab, loading,
      posts, addPost, toggleLike, likedPosts, toggleBoost, boostedPosts,
      addComment, deletePost,
      chatMessages, sendChat,
      friendChats, activeFriendChat, setActiveFriendChat,
      openFriendDM, createGroupChat, sendFriendMessage, leaveFriendChat,
      users, getUserById, moods,
      profileModal, setProfileModal,
      following, followers, friends,
      toggleFollow,
      myStarCount, myFollowingCount, myFriendCount,
      myProfile,
      formatTime,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() { return useContext(AppContext) }
