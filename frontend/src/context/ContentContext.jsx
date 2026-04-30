import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CACHE_KEY = "esperron_content_cache_v1";

const ContentContext = createContext(null);

// Read last-known-good content from localStorage synchronously (no flash)
const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const ContentProvider = ({ children, fallback }) => {
  // Prefer cache > fallback so reloads show the last-saved content instantly
  const [content, setContent] = useState(() => readCache() || fallback);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/content`);
      if (data) {
        setContent(data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {}
      }
    } catch {
      // keep whatever we already have (cache or fallback)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ContentContext.Provider value={{ content, setContent, refresh, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
};
