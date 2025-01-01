import React, { createContext, useState, useEffect, useContext } from "react";
import { login, logout, refreshJWTToken } from "./authApi";
import api from "./axiosInstance";
import { useLoading } from "../src/contexts/LoadingContext";
import { getUser, setUser } from "../src/helpers/localStorageHandlers";
import { setAccessToken } from "./tokenUtils";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();
  const [verifying, setVerifying] = useState(true);
  // Fetch user profile on initial load or token refresh
  const fetchUser = async () => {
    setLoading(true);
    try {
      const profile = await api.get("/profile");
      setUser(profile.data);
      navigate("/" + user.role);
    } catch (error) {
      console.error("User  fetch failed:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // Silent login: Refresh access token when it expires
  const silentLogin = async () => {
    console.log("Entering silent login");
    try {
      setVerifying(true);
      setLoading(true);
      const data = await refreshJWTToken();
      console.log("Data of refreshJWTToken", data);
      if (!data) {
        console.log("No data returned from refreshJWTToken");
        return handleLogout();
      }
      console.log("Data of token", data.accessToken);
      setAccessToken(data.accessToken);
      fetchUser();
      setVerifying(false);
    } catch (error) {
      console.error("Silent login failed:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // Check token expiry and perform silent login if needed
  useEffect(() => {
    const user = getUser();
    if (!user) {
      silentLogin();
    } else {
      setVerifying(false);
    }
  }, []);

  // Handle login
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      return await login(credentials);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
      navigate("/");
    }
  };
  if (!verifying) {
    return (
      <AuthContext.Provider value={{ handleLogin, handleLogout }}>
        {children}
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => useContext(AuthContext);
