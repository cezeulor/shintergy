import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const AuthContext = createContext(null);
const TOKEN_KEY = "shintergy_admin_token";

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const setToken = (t) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
    setTokenState(t);
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      setChecking(false);
      return;
    }
    axios
      .get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setUser(r.data))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, [token]);

  const login = async (username, code) => {
    const { data } = await axios.post(`${API}/auth/login`, { username, code });
    setToken(data.access_token);
    setUser({ username: data.username });
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const authHeader = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider
      value={{ user, token, checking, login, logout, authHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
