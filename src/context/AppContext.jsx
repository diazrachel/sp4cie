import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'
import { MOODS, formatTime, nowTime } from '../data.js'

export const AppContext = createContext()

export function AppProvider({ children }) {
  const { myProfile, session, dbToProfile } = useAuth()
  const [tab, setTab]                   = useState('home')
  const [posts, setPosts]               = useState([])
  const [users, setUsers]               = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [friendChats, setFriendChats]   = useState([])
  const [activeFriendChat, setActiveFriendChat] = useState(null)
  const [profileModal, setProfileModal] = useState(null)
  const [likedPosts, setLikedPosts]     = useState(new Set())
  const [boostedPosts, setBoostedPosts] = useState(new Set())
  const [following, setFollowing]       = useState(new Set())
  const [followers, setFollowers]       = useState(new Set())
  const [trendingTags, setTrendingTags] = useState([])
  const [loading, setLoading]           = useState(true)
  const moods = MOODS
  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return
    Promise.all([loadPosts(), loadUsers(), loadChatMessages(), loadFollowData(), loadLikes(), loadFriendChats()])
      .finally(() => setLoading(false))
  }, [userId])

  // realtime
  useEffect(() => {
    if (!userId) return
    const postSub = supabase.channel('posts-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => loadPosts())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, p => setPosts(prev => prev.filter(x => x.id !== p.old.id)))
      .subscribe()
    const chatSub = supabase.channel('cn-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cloud_nine' }, () => loadChatMessages())
      .subscribe()
    const dmSub = supabase.channel('dm-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'friend_messages' }, () => loadFriendChats())
      .subscribe()
    const followSub = supabase.channel('follow-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follows' }, () => loadFollowData())
      .subscribe()
    return () => {
      supabase.removeChannel(postSub); supabase.removeChannel(chatSub)
      supabase.removeChannel(dmSub);   supabase.removeChannel(followSub)
    }
  }, [userId])

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(id,username,name,avatar,avatar_bg,banner_bg,mood,profile_theme,profile_pic_url), comments(id)')
      .order('created_at', { ascending: false })
    if (data) {
      const mapped = data.map(p => ({
        id: p.id, authorId: p.author_id,
        author: p.profiles ? dbToProfile(p.profiles) : null,
        body: p.body || '', media: p.media_url || null, mediaType: p.media_type || null,
        audioUrl: p.audio_url || null,
        tags: p.tags || [],
        mood: p.mood_label ? { label: p.mood_label, bg: p.mood_bg, color: p.mood_color } : null,
        likes: p.likes || 0, boosts: p.boosts || 0, comments: p.comments || [],
        createdAt: new Date(p.created_at).getTime(),
      }))
      setPosts(mapped)
      // compute trending tags from last 7 days
      const weekAgo = Date.now() - 7 * 24 * 3600000
      const recent = mapped.filter(p => p.createdAt > weekAgo)
      const tagCount = {}
      recent.forEach(p => p.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1 }))
      const sorted = Object.entries(tagCount).sort((a,b) => b[1]-a[1]).slice(0,10).map(([t,c]) => ({ tag:t, count:c }))
      setTrendingTags(sorted)
    }
  }

  async function loadUsers() {
    if (!userId) return
    const { data } = await supabase.from('profiles').select('*').neq('id', userId)
    if (data) setUsers(data.map(dbToProfile))
  }

  async function loadChatMessages() {
    const { data } = await supabase
      .from('cloud_nine')
      .select('*, profiles(id,username,name,avatar,avatar_bg)')
      .order('created_at', { ascending: true }).limit(100)
    if (data) setChatMessages(data.map(m => ({
      id: m.id, userId: m.author_id,
      author: m.profiles ? dbToProfile(m.profiles) : null,
      text: m.body,
      time: new Date(m.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    })))
  }

  async function loadFollowData() {
    if (!userId) return
    const [{ data: fing }, { data: fers }] = await Promise.all([
      supabase.from('follows').select('following_id').eq('follower_id', userId),
      supabase.from('follows').select('follower_id').eq('following_id', userId),
    ])
    if (fing) setFollowing(new Set(fing.map(r => r.following_id)))
    if (fers) setFollowers(new Set(fers.map(r => r.follower_id)))
  }

  async function loadLikes() {
    if (!userId) return
    const { data } = await supabase.from('likes').select('post_id').eq('user_id', userId)
    if (data) setLikedPosts(new Set(data.map(r => r.post_id)))
  }

  async function loadFriendChats() {
    if (!userId) return
    const { data: memberRows } = await supabase.from('friend_chat_members').select('chat_id').eq('user_id', userId)
    if (!memberRows?.length) return
    const chatIds = memberRows.map(r => r.chat_id)
    const { data: chats } = await supabase.from('friend_chats').select('*').in('id', chatIds)
    if (!chats) return
    const full = await Promise.all(chats.map(async chat => {
      const [{ data: members }, { data: messages }] = await Promise.all([
        supabase.from('friend_chat_members').select('user_id').eq('chat_id', chat.id),
        supabase.from('friend_messages').select('*, profiles(id,username,name,avatar,avatar_bg)').eq('chat_id', chat.id).order('created_at', { ascending: true }),
      ])
      return {
        id: chat.id, isDM: chat.is_dm, name: chat.name,
        members: (members||[]).map(m=>m.user_id).filter(id=>id!==userId),
        messages: (messages||[]).map(m=>({
          id:m.id, userId:m.author_id,
          author: m.profiles ? dbToProfile(m.profiles) : null,
          text:m.body,
          time: new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
        })),
      }
    }))
    setFriendChats(full)
  }

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

  // upload file to supabase storage, return public url
  async function uploadFile(file, bucket, path) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) return null
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    return urlData?.publicUrl || null
  }

  const addPost = useCallback(async ({ body, media, mediaType, audioFile, mood }) => {
    if (!userId) return
    let mediaUrl = null, audioUrl = null
    try {
      if (media) {
        const blob = await fetch(media).then(r => r.blob())
        const ext  = mediaType === 'video' ? 'mp4' : 'jpg'
        mediaUrl   = await uploadFile(blob, 'sp4cie-media', `${userId}/${Date.now()}.${ext}`)
      }
      if (audioFile) {
        audioUrl = await uploadFile(audioFile, 'sp4cie-media', `${userId}/audio_${Date.now()}.mp3`)
      }
    } catch(e) {
      console.warn('media upload failed, posting without media', e)
    }
    const { error } = await supabase.from('posts').insert({
      author_id: userId, body: body||'',
      media_url: mediaUrl, media_type: mediaUrl ? mediaType : null,
      audio_url: audioUrl,
      tags: (body||'').match(/#\w+/g)||[],
      mood_label: mood?.label||null, mood_bg: mood?.bg||null, mood_color: mood?.color||null,
    })
    if (error) console.error('post insert error:', error)
    else await loadPosts()
  }, [userId])

  const toggleLike = useCallback(async postId => {
    if (!userId) return
    const liked = likedPosts.has(postId)
    setLikedPosts(prev => { const n=new Set(prev); liked?n.delete(postId):n.add(postId); return n })
    setPosts(prev => prev.map(p => p.id===postId ? {...p, likes:p.likes+(liked?-1:1)} : p))
    if (liked) {
      await supabase.from('likes').delete().match({user_id:userId,post_id:postId})
      await supabase.rpc('decrement_likes', {post_id:postId}).catch(()=>null)
    } else {
      await supabase.from('likes').insert({user_id:userId,post_id:postId})
      await supabase.rpc('increment_likes', {post_id:postId}).catch(()=>null)
    }
  }, [userId, likedPosts])

  const toggleBoost = useCallback(async postId => {
    if (!userId) return
    const boosted = boostedPosts.has(postId)
    setBoostedPosts(prev => { const n=new Set(prev); boosted?n.delete(postId):n.add(postId); return n })
    setPosts(prev => prev.map(p => p.id===postId ? {...p, boosts:p.boosts+(boosted?-1:1)} : p))
    const cur = posts.find(p=>p.id===postId)?.boosts||0
    await supabase.from('posts').update({boosts:cur+(boosted?-1:1)}).eq('id',postId)
  }, [userId, boostedPosts, posts])

  const addComment = useCallback(async (postId, text) => {
    if (!userId) return
    await supabase.from('comments').insert({post_id:postId,author_id:userId,body:text})
    await loadPosts()
  }, [userId])

  const deletePost = useCallback(async postId => {
    if (!userId) return
    await supabase.from('posts').delete().eq('id',postId).eq('author_id',userId)
    setPosts(prev => prev.filter(p => p.id!==postId))
  }, [userId])

  const sendChat = useCallback(async text => {
    if (!userId) return
    await supabase.from('cloud_nine').insert({author_id:userId, body:text})
  }, [userId])

  const toggleFollow = useCallback(async targetId => {
    if (!userId||targetId===userId) return
    const isF = following.has(targetId)
    setFollowing(prev => { const n=new Set(prev); isF?n.delete(targetId):n.add(targetId); return n })
    if (isF) await supabase.from('follows').delete().match({follower_id:userId,following_id:targetId})
    else await supabase.from('follows').insert({follower_id:userId,following_id:targetId})
  }, [userId, following])

  const openFriendDM = useCallback(async friendId => {
    if (!userId) return
    const existing = friendChats.find(c => c.isDM && c.members.includes(friendId))
    if (existing) { setActiveFriendChat(existing.id); setTab('friends'); return }
    setTab('friends')
    const { data: chat } = await supabase.from('friend_chats').insert({is_dm:true,name:null}).select().single()
    if (!chat) return
    await supabase.from('friend_chat_members').insert([
      {chat_id:chat.id,user_id:userId},
      {chat_id:chat.id,user_id:friendId},
    ])
    await loadFriendChats()
    setActiveFriendChat(chat.id)
    setTab('friends')
  }, [userId, friendChats])

  const createGroupChat = useCallback(async (name, memberIds) => {
    if (!userId) return
    const { data: chat } = await supabase.from('friend_chats').insert({is_dm:false,name:name||'new group ✦'}).select().single()
    if (!chat) return
    await supabase.from('friend_chat_members').insert([
      {chat_id:chat.id,user_id:userId},
      ...memberIds.map(id=>({chat_id:chat.id,user_id:id})),
    ])
    await loadFriendChats()
    setActiveFriendChat(chat.id)
  }, [userId])

  const sendFriendMessage = useCallback(async (chatId, text) => {
    if (!userId) return
    await supabase.from('friend_messages').insert({chat_id:chatId,author_id:userId,body:text})
    await loadFriendChats()
  }, [userId])

  const leaveFriendChat = useCallback(async chatId => {
    if (!userId) return
    await supabase.from('friend_chat_members').delete().match({chat_id:chatId,user_id:userId})
    setFriendChats(prev=>prev.filter(c=>c.id!==chatId))
    setActiveFriendChat(null)
  }, [userId])

  return (
    <AppContext.Provider value={{
      tab, setTab, loading,
      posts, addPost, toggleLike, likedPosts, toggleBoost, boostedPosts, addComment, deletePost,
      chatMessages, sendChat,
      friendChats, activeFriendChat, setActiveFriendChat,
      openFriendDM, createGroupChat, sendFriendMessage, leaveFriendChat,
      users, getUserById, moods, trendingTags,
      profileModal, setProfileModal,
      following, followers, friends, toggleFollow,
      myStarCount, myFollowingCount, myFriendCount,
      myProfile, formatTime, uploadFile,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() { return useContext(AppContext) }
