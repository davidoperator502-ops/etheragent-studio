import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'davicho4522@gmail.com';

interface StoredAuth {
  user: User;
  timestamp: number;
}

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const supabaseUser = session.user as unknown as SupabaseUser;
            setUser({
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
              role: supabaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
              avatar: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const supabaseUser = session.user as unknown as SupabaseUser;
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
            role: supabaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
            avatar: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
          });
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error.message);
          setIsLoading(false);
          return false;
        }

        setIsLoading(false);
        return true;
      } catch (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }
    }

    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, message: error.message };
        }

        setIsLoading(false);
        return { 
          success: true, 
          message: data.user?.email_confirmed_at 
            ? 'Account created successfully!' 
            : 'Check your email to confirm your account!' 
        };
      } catch (error) {
        setIsLoading(false);
        return { success: false, message: 'Signup failed. Please try again.' };
      }
    }

    setIsLoading(false);
    return { success: false, message: 'Supabase not configured' };
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
