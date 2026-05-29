import { createContext, useState, useCallback, useContext, useMemo } from "react";
import { SEED_USERS, SEED_POSTS, SEED_CHAT, MOODS, formatTime, nowTime, CHAT_AUTO_REPLIES } from "../data.js";

export const AppContext = createContext();

// seed: nova, kit, pearl all "follow" you back by default so you have some friends on first load
const SEED_FOLLOWERS = new Set(["nova","kit","pearl"]);

export function AppProvider({ children, initialProfile }) {
  const [tab, setTab]                   = useState("home");
  const [posts, setPosts]               = useState(SEED_POSTS);
  const [chatMessages, setChatMessages] = useState(SEED_CHAT);
  // friendGroupchats: { id, name, members:[userId], messages:[{id,userId,text,time}] }
  const [friendChats, setFriendChats]   = useState([]);
  const [activeFriendChat, setActiveFriendChat] = useState(null); // id of open DM/group
  const [profileModal, setProfileModal] = useState(null);
  const [likedPosts, setLikedPosts]     = useState(new Set());
  const [boostedPosts, setBoostedPosts] = useState(new Set());
  // following = people YOU follow
  const [following, setFollowing]       = useState(new Set());
  // followers = people who follow YOU (seeded so you have friends right away)
  const [followers, setFollowers]       = useState(SEED_FOLLOWERS);

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

  const users = SEED_USERS;
  const moods = MOODS;

  // ── DERIVED: friends = mutual follows ──────────────────────────────────────
  const friends = useMemo(() => {
    // a friend = someone you follow AND who follows you back
    const mutuals = new Set();
    for (const id of following) {
      if (followers.has(id)) mutuals.add(id);
    }
    return mutuals;
  }, [following, followers]);

  // star/follower counts for display
  const myStarCount    = followers.size;        // people following me
  const myFollowingCount = following.size;       // people I follow
  const myFriendCount  = friends.size;

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

  // ── CLOUD NINE (global chat) ────────────────────────────────────────────────
  const sendChat = useCallback(text => {
    setChatMessages(prev => [...prev, { id:`cm_${Date.now()}`, userId:"me", text, time:nowTime() }]);
    const repliers = ["nova","pearl","kit","clem","rae","sol"];
    setTimeout(() => {
      const r = repliers[Math.floor(Math.random()*repliers.length)];
      const t = CHAT_AUTO_REPLIES[Math.floor(Math.random()*CHAT_AUTO_REPLIES.length)];
      setChatMessages(prev => [...prev, { id:`cm_${Date.now()}+1`, userId:r, text:t, time:nowTime() }]);
    }, 1200 + Math.random()*1800);
  }, []);

  // ── FOLLOW / UNFOLLOW ──────────────────────────────────────────────────────
  const toggleFollow = useCallback(userId => {
    setFollowing(prev => {
      const n = new Set(prev);
      if (n.has(userId)) {
        n.delete(userId);
        // if they were a friend, remove the friend groupchat too
        setFriendChats(fc => fc.filter(c => !(c.isDM && c.members.includes(userId))));
      } else {
        n.add(userId);
        // simulate: some users follow back after a short delay
        const followBackChance = ["nova","kit","pearl","clem"].includes(userId);
        if (followBackChance) {
          setTimeout(() => {
            setFollowers(f => new Set([...f, userId]));
          }, 1500 + Math.random()*2000);
        }
      }
      return n;
    });
  }, []);

  // ── FRIEND GROUPCHATS ──────────────────────────────────────────────────────
  // Create or open a DM with a friend
  const openFriendDM = useCallback(friendId => {
    setFriendChats(prev => {
      const existing = prev.find(c => c.isDM && c.members.includes(friendId));
      if (existing) {
        setActiveFriendChat(existing.id);
        return prev;
      }
      const newChat = {
        id: `dm_${friendId}_${Date.now()}`,
        isDM: true,
        name: null, // will display friend name
        members: [friendId],
        messages: [],
      };
      setActiveFriendChat(newChat.id);
      return [...prev, newChat];
    });
  }, []);

  // Create a new group chat with selected friends
  const createGroupChat = useCallback((name, memberIds) => {
    const newChat = {
      id: `gc_${Date.now()}`,
      isDM: false,
      name: name || "new group ✦",
      members: memberIds,
      messages: [],
    };
    setFriendChats(prev => [...prev, newChat]);
    setActiveFriendChat(newChat.id);
  }, []);

  // Send a message in a friend chat
  const sendFriendMessage = useCallback((chatId, text) => {
    const time = nowTime();
    setFriendChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const newMsg = { id:`fm_${Date.now()}`, userId:"me", text, time };
      // simulate reply from friend after delay
      const replier = c.members[0];
      setTimeout(() => {
        const reply = CHAT_AUTO_REPLIES[Math.floor(Math.random()*CHAT_AUTO_REPLIES.length)];
        setFriendChats(fc => fc.map(ch =>
          ch.id === chatId
            ? { ...ch, messages:[...ch.messages, { id:`fm_${Date.now()}r`, userId:replier, text:reply, time:nowTime() }] }
            : ch
        ));
      }, 1200 + Math.random()*2000);
      return { ...c, messages:[...c.messages, newMsg] };
    }));
  }, []);

  const leaveFriendChat = useCallback(chatId => {
    setFriendChats(prev => prev.filter(c => c.id !== chatId));
    setActiveFriendChat(null);
  }, []);

  // ── MY PROFILE ─────────────────────────────────────────────────────────────
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
