import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
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
  const moods  = MOODS
  const userId = session?.user?.id
  const userIdRef = useRef(userId)
  useEffect(() => { userIdRef.current = userId }, [userId])

  const loadPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(id,username,name,avatar,avatar_bg,banner_bg,mood,profile_theme,profile_pic_url,banner_url,profile_font), comments(id)')
      .order('created_at', { ascending: false })
    if (error) { console.error('loadPosts:', error); return }
    if (!data) return
    const mapped = data.map(p => ({
      id:p.id, authorId:p.author_id,
      author: p.profiles ? dbToProfile(p.profiles) : null,
      body:p.body||'', media:p.media_url||null, mediaType:p.media_type||null,
      audioUrl:p.audio_url||null, tags:p.tags||[],
      mood: p.mood_label ? {label:p.mood_label,bg:p.mood_bg,color:p.mood_color} : null,
      likes:p.likes||0, boosts:p.boosts||0, comments:p.comments||[],
      createdAt: new Date(p.created_at).getTime(),
    }))
    setPosts(mapped)
    const weekAgo = Date.now()-7*24*3600000
    const tc = {}
    mapped.filter(p=>p.createdAt>weekAgo).forEach(p=>p.tags.forEach(t=>{tc[t]=(tc[t]||0)+1}))
    setTrendingTags(Object.entries(tc).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([tag,count])=>({tag,count})))
  }, [dbToProfile])

  const loadUsers = useCallback(async () => {
    const uid = userIdRef.current; if (!uid) return
    const { data } = await supabase.from('profiles').select('*').neq('id', uid)
    if (data) setUsers(data.map(dbToProfile))
  }, [dbToProfile])

  const loadChatMessages = useCallback(async () => {
    const { data } = await supabase
      .from('cloud_nine')
      .select('*, profiles(id,username,name,avatar,avatar_bg,profile_pic_url)')
      .order('created_at', { ascending: true }).limit(80)
    if (data) setChatMessages(data.map(m=>({
      id:m.id, userId:m.author_id,
      author: m.profiles ? dbToProfile(m.profiles) : null,
      text:m.body,
      time: new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
    })))
  }, [dbToProfile])

  const loadFollowData = useCallback(async () => {
    const uid = userIdRef.current; if (!uid) return
    const [{data:fing},{data:fers}] = await Promise.all([
      supabase.from('follows').select('following_id').eq('follower_id',uid),
      supabase.from('follows').select('follower_id').eq('following_id',uid),
    ])
    if (fing) setFollowing(new Set(fing.map(r=>r.following_id)))
    if (fers) setFollowers(new Set(fers.map(r=>r.follower_id)))
  }, [])

  const loadLikes = useCallback(async () => {
    const uid = userIdRef.current; if (!uid) return
    const {data} = await supabase.from('likes').select('post_id').eq('user_id',uid)
    if (data) setLikedPosts(new Set(data.map(r=>r.post_id)))
  }, [])

  const loadFriendChats = useCallback(async () => {
    const uid = userIdRef.current; if (!uid) return
    const {data:memberRows} = await supabase.from('friend_chat_members').select('chat_id').eq('user_id',uid)
    if (!memberRows?.length) { setFriendChats([]); return }
    const chatIds = memberRows.map(r=>r.chat_id)
    const {data:chats} = await supabase.from('friend_chats').select('*').in('id',chatIds)
    if (!chats) return
    const full = await Promise.all(chats.map(async chat => {
      const [{data:members},{data:messages}] = await Promise.all([
        supabase.from('friend_chat_members').select('user_id').eq('chat_id',chat.id),
        supabase.from('friend_messages').select('*, profiles(id,username,name,avatar,avatar_bg,profile_pic_url)').eq('chat_id',chat.id).order('created_at',{ascending:true}),
      ])
      return {
        id:chat.id, isDM:chat.is_dm, name:chat.name,
        members:(members||[]).map(m=>m.user_id).filter(id=>id!==uid),
        messages:(messages||[]).map(m=>({
          id:m.id, userId:m.author_id,
          author:m.profiles?dbToProfile(m.profiles):null,
          text:m.body,
          time:new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
        })),
      }
    }))
    setFriendChats(full)
  }, [dbToProfile])

  useEffect(() => {
    if (!userId) return
    Promise.all([loadPosts(),loadUsers(),loadChatMessages(),loadFollowData(),loadLikes(),loadFriendChats()])
      .finally(()=>setLoading(false))
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const s1=supabase.channel('rt-posts').on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},()=>loadPosts()).on('postgres_changes',{event:'DELETE',schema:'public',table:'posts'},p=>setPosts(prev=>prev.filter(x=>x.id!==p.old.id))).subscribe()
    const s2=supabase.channel('rt-cn').on('postgres_changes',{event:'INSERT',schema:'public',table:'cloud_nine'},()=>loadChatMessages()).subscribe()
    const s3=supabase.channel('rt-dm').on('postgres_changes',{event:'INSERT',schema:'public',table:'friend_messages'},()=>loadFriendChats()).subscribe()
    const s4=supabase.channel('rt-fw').on('postgres_changes',{event:'*',schema:'public',table:'follows'},()=>loadFollowData()).subscribe()
    return ()=>{supabase.removeChannel(s1);supabase.removeChannel(s2);supabase.removeChannel(s3);supabase.removeChannel(s4)}
  }, [userId,loadPosts,loadChatMessages,loadFriendChats,loadFollowData])

  const friends = useMemo(()=>{const m=new Set();for(const id of following){if(followers.has(id))m.add(id)}return m},[following,followers])
  const myStarCount=followers.size, myFollowingCount=following.size, myFriendCount=friends.size

  const getUserById = useCallback(id=>{
    if(!id)return null
    if(id===userId)return myProfile
    return users.find(u=>u.id===id)||null
  },[users,myProfile,userId])

  const uploadFile = useCallback(async (file,bucket,path)=>{
    const {error}=await supabase.storage.from(bucket).upload(path,file,{upsert:true})
    if(error){console.error('upload:',error);return null}
    const {data}=supabase.storage.from(bucket).getPublicUrl(path)
    return data?.publicUrl||null
  },[])

  const addPost = useCallback(async ({body,media,mediaType,audioFile,mood})=>{
    const uid=userIdRef.current; if(!uid)return
    let mediaUrl=null,audioUrl=null
    if(media){try{const blob=await fetch(media).then(r=>r.blob());const ext=mediaType==='video'?'mp4':'jpg';mediaUrl=await uploadFile(blob,'sp4cie-media',`${uid}/${Date.now()}.${ext}`)}catch(e){console.warn('media skip',e)}}
    if(audioFile){try{audioUrl=await uploadFile(audioFile,'sp4cie-media',`${uid}/audio_${Date.now()}.mp3`)}catch(e){console.warn('audio skip',e)}}
    const {data,error}=await supabase.from('posts').insert({
      author_id:uid, body:body||'',
      media_url:mediaUrl, media_type:mediaUrl?mediaType:null, audio_url:audioUrl,
      tags:(body||'').match(/#\w+/g)||[],
      mood_label:mood?.label||null, mood_bg:mood?.bg||null, mood_color:mood?.color||null,
    }).select().single()
    if(error){console.error('addPost:',error);return}
    if(data&&myProfile){
      setPosts(prev=>[{id:data.id,authorId:uid,author:myProfile,body:data.body,media:mediaUrl,mediaType:mediaUrl?mediaType:null,audioUrl,tags:data.tags||[],mood:mood||null,likes:0,boosts:0,comments:[],createdAt:Date.now()},...prev])
    }
  },[uploadFile,myProfile])

  const likedPostsRef=useRef(likedPosts)
  useEffect(()=>{likedPostsRef.current=likedPosts},[likedPosts])

  const toggleLike=useCallback(async postId=>{
    const uid=userIdRef.current; if(!uid)return
    const liked=likedPostsRef.current.has(postId)
    setLikedPosts(prev=>{const n=new Set(prev);liked?n.delete(postId):n.add(postId);return n})
    setPosts(prev=>prev.map(p=>p.id===postId?{...p,likes:p.likes+(liked?-1:1)}:p))
    if(liked)await supabase.from('likes').delete().match({user_id:uid,post_id:postId})
    else await supabase.from('likes').insert({user_id:uid,post_id:postId})
  },[])

  const boostedPostsRef=useRef(boostedPosts)
  useEffect(()=>{boostedPostsRef.current=boostedPosts},[boostedPosts])

  const toggleBoost=useCallback(async postId=>{
    const uid=userIdRef.current; if(!uid)return
    const boosted=boostedPostsRef.current.has(postId)
    setBoostedPosts(prev=>{const n=new Set(prev);boosted?n.delete(postId):n.add(postId);return n})
    setPosts(prev=>prev.map(p=>{if(p.id!==postId)return p;const nb=p.boosts+(boosted?-1:1);supabase.from('posts').update({boosts:nb}).eq('id',postId);return{...p,boosts:nb}}))
  },[])

  const addComment=useCallback(async(postId,text)=>{
    const uid=userIdRef.current; if(!uid)return
    await supabase.from('comments').insert({post_id:postId,author_id:uid,body:text})
    await loadPosts()
  },[loadPosts])

  const deletePost=useCallback(async postId=>{
    const uid=userIdRef.current; if(!uid)return
    await supabase.from('posts').delete().eq('id',postId).eq('author_id',uid)
    setPosts(prev=>prev.filter(p=>p.id!==postId))
  },[])

  const sendChat=useCallback(async text=>{
    const uid=userIdRef.current; if(!uid)return
    const {error}=await supabase.from('cloud_nine').insert({author_id:uid,body:text})
    if(error)console.error('sendChat:',error)
  },[])

  const toggleFollow=useCallback(async targetId=>{
    const uid=userIdRef.current; if(!uid||targetId===uid)return
    setFollowing(prev=>{const n=new Set(prev);const isF=n.has(targetId);isF?n.delete(targetId):n.add(targetId);if(isF)supabase.from('follows').delete().match({follower_id:uid,following_id:targetId});else supabase.from('follows').insert({follower_id:uid,following_id:targetId});return n})
  },[])

  const openFriendDM=useCallback(async friendId=>{
    const uid=userIdRef.current; if(!uid)return
    // check existing DM in DB
    const {data:myChats}=await supabase.from('friend_chat_members').select('chat_id').eq('user_id',uid)
    if(myChats?.length){
      const {data:shared}=await supabase.from('friend_chat_members').select('chat_id').eq('user_id',friendId).in('chat_id',myChats.map(r=>r.chat_id))
      // also check is_dm
      if(shared?.length){
        const {data:dmChat}=await supabase.from('friend_chats').select('id').eq('id',shared[0].chat_id).eq('is_dm',true).single()
        if(dmChat){
          await loadFriendChats()
          setActiveFriendChat(dmChat.id)
          setTab('friends')
          return
        }
      }
    }
    // create new
    const {data:chat,error}=await supabase.from('friend_chats').insert({is_dm:true,name:null}).select().single()
    if(error||!chat){console.error('DM create:',error);return}
    await supabase.from('friend_chat_members').insert([{chat_id:chat.id,user_id:uid},{chat_id:chat.id,user_id:friendId}])
    await loadFriendChats()
    setActiveFriendChat(chat.id)
    setTab('friends')
  },[loadFriendChats])

  const createGroupChat=useCallback(async(name,memberIds)=>{
    const uid=userIdRef.current; if(!uid)return
    const {data:chat}=await supabase.from('friend_chats').insert({is_dm:false,name:name||'new group ✦'}).select().single()
    if(!chat)return
    await supabase.from('friend_chat_members').insert([{chat_id:chat.id,user_id:uid},...memberIds.map(id=>({chat_id:chat.id,user_id:id}))])
    await loadFriendChats()
    setActiveFriendChat(chat.id)
  },[loadFriendChats])

  const sendFriendMessage=useCallback(async(chatId,text)=>{
    const uid=userIdRef.current; if(!uid)return
    const {error}=await supabase.from('friend_messages').insert({chat_id:chatId,author_id:uid,body:text})
    if(error){console.error('sendFriendMsg:',error);return}
    await loadFriendChats()
  },[loadFriendChats])

  const leaveFriendChat=useCallback(async chatId=>{
    const uid=userIdRef.current; if(!uid)return
    await supabase.from('friend_chat_members').delete().match({chat_id:chatId,user_id:uid})
    setFriendChats(prev=>prev.filter(c=>c.id!==chatId))
    setActiveFriendChat(null)
  },[])

  return (
    <AppContext.Provider value={{
      tab,setTab,loading,
      posts,addPost,toggleLike,likedPosts,toggleBoost,boostedPosts,addComment,deletePost,
      chatMessages,sendChat,
      friendChats,activeFriendChat,setActiveFriendChat,
      openFriendDM,createGroupChat,sendFriendMessage,leaveFriendChat,
      users,getUserById,moods,trendingTags,
      profileModal,setProfileModal,
      following,followers,friends,toggleFollow,
      myStarCount,myFollowingCount,myFriendCount,
      myProfile,formatTime,uploadFile,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(){return useContext(AppContext)}
