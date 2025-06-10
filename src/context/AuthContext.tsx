import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { RateLimiter } from "@/lib/utils/rateLimit";

// Initialize rate limiter
const COOLDOWN_DURATION = 60 * 1000; // 1 minute in milliseconds
const rateLimiter = new RateLimiter(5, COOLDOWN_DURATION);

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  register: (name: string, email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Starting registration with:', { name, email });
      
      // Get the site URL from env or use production URL
      const siteUrl = import.meta.env.VITE_APP_URL || 'https://type-secure.online';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        console.error('Auth error:', error);
        throw error;
      }

      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (!rateLimiter.canAttempt()) {
        throw new Error(`Please wait ${rateLimiter.getRemainingTime()} seconds before trying again.`);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.session) {
        throw new Error('No session created');
      }

      // Check if email is verified using the user metadata
      if (!data.user?.email_confirmed_at) {
        throw new Error('Please verify your email before logging in.');
      }

      console.log('Login successful:', data);
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
