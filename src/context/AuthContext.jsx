import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    try {
      const s = localStorage.getItem("sp4cie_session");
      return s ? JSON.parse(s) : { user: null, step: "landing" };
    } catch { return { user: null, step: "landing" }; }
  });

  function signup({ email, username, password }) {
    const users = JSON.parse(localStorage.getItem("sp4cie_users") || "[]");
    if (users.find(u => u.email === email))
      return { error: "An account with that email already exists ✦" };
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
      return { error: "That handle's taken — try another 🌙" };
    const newUser = { id:`u_${Date.now()}`, email, username, password, profile: null };
    localStorage.setItem("sp4cie_users", JSON.stringify([...users, newUser]));
    const session = { user: newUser, step: "setup" };
    localStorage.setItem("sp4cie_session", JSON.stringify(session));
    setAuthState(session);
    return { success: true };
  }

  function login({ emailOrUsername, password }) {
    const users = JSON.parse(localStorage.getItem("sp4cie_users") || "[]");
    const user = users.find(u =>
      (u.email === emailOrUsername || u.username.toLowerCase() === emailOrUsername.toLowerCase())
      && u.password === password
    );
    if (!user) return { error: "Those credentials don't match anything in our orbit 🌙" };
    const step = user.profile ? "app" : "setup";
    const session = { user, step };
    localStorage.setItem("sp4cie_session", JSON.stringify(session));
    setAuthState(session);
    return { success: true };
  }

  function completeSetup(profile) {
    const users = JSON.parse(localStorage.getItem("sp4cie_users") || "[]");
    const updated = users.map(u => u.id === authState.user.id ? { ...u, profile } : u);
    localStorage.setItem("sp4cie_users", JSON.stringify(updated));
    const updatedUser = { ...authState.user, profile };
    const session = { user: updatedUser, step: "app" };
    localStorage.setItem("sp4cie_session", JSON.stringify(session));
    setAuthState(session);
  }

  function logout() {
    localStorage.removeItem("sp4cie_session");
    setAuthState({ user: null, step: "landing" });
  }

  function goTo(step) { setAuthState(s => ({ ...s, step })); }

  return (
    <AuthContext.Provider value={{ authState, signup, login, logout, completeSetup, goTo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
