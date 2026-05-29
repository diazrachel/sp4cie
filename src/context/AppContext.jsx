import { createContext, useState, useCallback, useContext, useMemo } from "react";
import { SEED_USERS, SEED_POSTS, SEED_CHAT, MOODS, formatTime, nowTime } from "../data.js";

export const AppContext = createContext();

export function AppProvider({ children, initialProfile }) {
  const [tab, setTab]                   = useState("home");
  const [posts, setPosts]               = useState(SEED_POSTS);
  const [chatMessages, setChatMessages] = useState(SEED_CHAT);
  const [friendChats, setFriendChats]   = useState([]);
  const [activeFriendChat, setActiveFriendChat] = useState(null);
  const [profileModal, setProfileModal] = useState(null);
  const [likedPosts, setLikedPosts]     = useState(new Set());
  const [boostedPosts, setBoostedPosts] = useState(new Set());
  const [following, setFollowing]       = useState(new Set());
  const [followers, setFollowers]       = useState(new Set());

  const defaultProfile = {
    id:"me", name:"you", handle:"@you",
    avatar:"🌙", avatarBg:"linear-gradient(135deg,#ede7f6,#d1c4e9)",
    bannerBg:"linear-gradient(135deg,#b39ddb,#9fa8da)",
    bio:"just floating through the cosmos ☁️", website:"",
    interests:["☁️ clouds","🌙 space","✨ soft things"],
    mood:"🌙 lunar", isOnline:true,
    profileTheme:"lunar", profileFont:"sans", profileColor:"#b39ddb",
    badges:["🌟 early star"],
    aboutSections:[{ title:"about me", text:"new to sp4cie ✦" }],
    spotifyEmbed: null,
  };

  const [myProfile, setMyProfile] = useState(
    initialProfile ? { ...defaultProfile, ...initialProfile } : defaultProfile
  );

  // no seed/bot users — real users only
  const [users, setUsers] = useState(SEED_USERS);
  const moods = MOODS;

  // friends = mutual follows
  const friends = useMemo(() => {
    const mutuals = new Set();
    for (const id of following) {
      if (followers.has(id)) mutuals.add(id);
    }
    return mutuals;
  }, [following, followers]);

  const myStarCount     = followers.size;
  const myFollowingCount = following.size;
  const myFriendCount   = friends.size;

  const getUserById = useCallback(
    id => id === "me" ? myProfile : users.find(u => u.id === id),
    [users, myProfile]
  );

  // ── POSTS ──────────────────────────────────────────────────────────────────
  const addPost = useCallback(postData => {
    const p = {
      id:`p_${Date.now()}`, authorId:"me",
      body: postData.body || "",
      media: postData.media || null,
      mediaType: postData.mediaType || null,
      tags: (postData.body || "").match(/#\w+/g) || [],
      mood: postData.mood || moods[0],
      createdAt: Date.now(),
      likes:0, comments:[], boosts:0,
    };
    setPosts(prev => [p, ...prev]);
  }, [moods]);

  const toggleLike = useCallback(postId => {
    setLikedPosts(prev => {
      const n = new Set(prev);
      n.has(postId) ? n.delete(postId) : n.add(postId);
      return n;
    });
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likes: p.likes + (likedPosts.has(postId) ? -1 : 1) }
        : p
    ));
  }, [likedPosts]);

  const toggleBoost = useCallback(postId => {
    setBoostedPosts(prev => {
      const n = new Set(prev);
      n.has(postId) ? n.delete(postId) : n.add(postId);
      return n;
    });
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, boosts: p.boosts + (boostedPosts.has(postId) ? -1 : 1) }
        : p
    ));
  }, [boostedPosts]);

  const addComment = useCallback((postId, text) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id:Date.now(), userId:"me", text, time:"just now" }] }
        : p
    ));
  }, []);

  const deletePost = useCallback(postId => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  // ── CLOUD NINE (global live chat — real users only, no auto-replies) ────────
  const sendChat = useCallback(text => {
    setChatMessages(prev => [
      ...prev,
      { id:`cm_${Date.now()}`, userId:"me", text, time:nowTime() }
    ]);
  }, []);

  // ── FOLLOW ─────────────────────────────────────────────────────────────────
  const toggleFollow = useCallback(userId => {
    setFollowing(prev => {
      const n = new Set(prev);
      if (n.has(userId)) {
        n.delete(userId);
        setFriendChats(fc => fc.filter(c => !(c.isDM && c.members.includes(userId))));
      } else {
        n.add(userId);
      }
      return n;
    });
  }, []);

  // ── FRIEND CHATS ───────────────────────────────────────────────────────────
  const openFriendDM = useCallback(friendId => {
    setFriendChats(prev => {
      const existing = prev.find(c => c.isDM && c.members.includes(friendId));
      if (existing) { setActiveFriendChat(existing.id); return prev; }
      const newChat = {
        id:`dm_${friendId}_${Date.now()}`, isDM:true,
        name:null, members:[friendId], messages:[],
      };
      setActiveFriendChat(newChat.id);
      return [...prev, newChat];
    });
  }, []);

  const createGroupChat = useCallback((name, memberIds) => {
    const newChat = {
      id:`gc_${Date.now()}`, isDM:false,
      name: name || "new group ✦", members:memberIds, messages:[],
    };
    setFriendChats(prev => [...prev, newChat]);
    setActiveFriendChat(newChat.id);
  }, []);

  const sendFriendMessage = useCallback((chatId, text) => {
    const time = nowTime();
    setFriendChats(prev => prev.map(c =>
      c.id !== chatId ? c
        : { ...c, messages:[...c.messages, { id:`fm_${Date.now()}`, userId:"me", text, time }] }
    ));
  }, []);

  const leaveFriendChat = useCallback(chatId => {
    setFriendChats(prev => prev.filter(c => c.id !== chatId));
    setActiveFriendChat(null);
  }, []);

  const updateMyProfile = useCallback(updates => {
    setMyProfile(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppContext.Provider value={{
      tab, setTab,
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
      myProfile, updateMyProfile,
      formatTime,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
