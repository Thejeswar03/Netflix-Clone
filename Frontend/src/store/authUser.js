import axios from "axios";
import { toast }  from "react-hot-toast"; 
import { create } from "zustand";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if( token ) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
});

export const useAuthStore = create((set) => ({
  user:null,
  isSigningUp:false,
  isCheckingAuth:true,
  isLoggingOut:false,
  isLoggingIn:false,
  signup: async (credentials) => {
    console.log("Signup method called with credentials:", credentials);
    set({isSigningUp:true})
    try {
      console.log("Signup Credentials:", credentials);
      const response = await axios.post("/api/v1/auth/signup", credentials);
      localStorage.setItem('authToken', response.data.token);
      set({user:response.data.user, isSigningUp:false});
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      set({isSigningUp:false, user:null});
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post("api/v1/auth/login", credentials);
      localStorage.setItem('authToken', response.data.token);
      set({ user: response.data.user, isLoggingIn: false });
      toast.success("Logged in successfully")
    } catch (error) {
      set({ isLoggingIn: false, user: null });
      toast.error(error.response.data.message || "Log in failed");
    }
  },
  logout: async() => {
    try {
      await axios.post("api/v1/auth/logout");
      localStorage.removeItem('authToken');
      set({ user: null, isLoggingOut: false });
      toast.success("Logged out successfully");
    } catch (error) {
      set({ isLoggingOut: false });
      toast.error(error.response.data.message || "Logout Failed");
    }
  },
  authCheck: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      set({ isCheckingAuth: false, user: null });
      return;
    }

    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("api/v1/auth/authCheck");
      set({ user: response.data.user, isCheckingAuth: false});
    } catch (error) {
      localStorage.removeItem('authToken');
      set({ isCheckingAuth: false, user: null });
      //toast.error(error.response.data.message || "An error occurred");
    }
  },
}))