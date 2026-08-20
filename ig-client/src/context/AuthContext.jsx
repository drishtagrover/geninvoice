import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { baseURL } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const refresh = localStorage.getItem("refreshToken");
      const savedUser = localStorage.getItem("user");
      if (refresh && savedUser) {
        try {
          const res = await axios.post(`${baseURL}/users/refresh/`, { refresh });
          setAccessToken(res.data.access);
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, [baseURL]);

  const fetchUser = useCallback(async (token) => {
    const res = await axios.get(`${baseURL}/users/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  }, [baseURL]);

  const login = useCallback(async (email, password) => {
    const res = await axios.post(`${baseURL}/users/login/`, { email, password });
    const { access, refresh } = res.data;
    setAccessToken(access);
    localStorage.setItem("refreshToken", refresh);
    await fetchUser(access);
  }, [baseURL, fetchUser]);

  const register = useCallback(async (userData) => {
    const res = await axios.post(`${baseURL}/users/register/`, userData);
    const { access, refresh, user: newUser } = res.data;
    setAccessToken(access);
    setUser(newUser);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(newUser));
    return newUser;
  }, [baseURL]);

  const logout = useCallback(async () => {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        await axios.post(`${baseURL}/users/logout/`, { refresh });
      }
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }, [baseURL]);

  const getToken = useCallback(async () => accessToken, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated: !!user, loading, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
