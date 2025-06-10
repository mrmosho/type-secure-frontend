import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'Unknown User',
          avatarUrl: session.user.user_metadata.avatar_url
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'Unknown User',
          avatarUrl: session.user.user_metadata.avatar_url
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call - would be replaced with actual auth API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful login
      const mockUser = {
        id: "1",
        name: "Test User",
        email: email,
      };
      
      // Store token in local storage
      localStorage.setItem("ts-auth-token", "mock-jwt-token");
      
      setUser(mockUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call - would be replaced with actual registration API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful registration and auto-login
      const mockUser = {
        id: "1",
        name: name,
        email: email,
      };
      
      // Store token in local storage
      localStorage.setItem("ts-auth-token", "mock-jwt-token");
      
      setUser(mockUser);
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("ts-auth-token");
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call - would be replaced with actual forgot password API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulating successful password reset request
    } catch (error) {
      console.error("Password reset failed:", error);
      throw new Error("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
