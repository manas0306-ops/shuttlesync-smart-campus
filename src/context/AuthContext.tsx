import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLiveSupabase: boolean;
  signIn: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, studentId: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'shuttlesync_active_session';
const LOCAL_USERS_DB_KEY = 'shuttlesync_registered_users_db';

// Pre-seeded demo student user for instant preview if needed
const DEFAULT_SEED_USER: UserProfile & { passwordHash: string } = {
  id: 'usr-lpu-student-01',
  email: 'student@lpu.in',
  passwordHash: 'Student@123',
  fullName: 'Aarav Sharma',
  studentId: '12214589',
  role: 'student',
  avatarUrl: '',
  favoriteStopIds: ['stop-block-34-lib', 'stop-uni-mall'],
  savedRouteIds: ['route-blue-express'],
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and restore persistent session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          // Live Supabase Authentication Session Check
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email || session.user.email || '',
                fullName: profile.full_name || 'LPU Commuter',
                studentId: profile.student_id || '12200000',
                role: (profile.role as UserRole) || 'student',
                avatarUrl: profile.avatar_url || '',
                favoriteStopIds: profile.favorite_stops || ['stop-block-34-lib'],
                savedRouteIds: profile.saved_routes || ['route-blue-express'],
                createdAt: profile.created_at || new Date().toISOString(),
              });
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                fullName: session.user.user_metadata?.full_name || 'LPU Commuter',
                studentId: session.user.user_metadata?.student_id || '12200000',
                role: 'student',
                favoriteStopIds: ['stop-block-34-lib'],
                savedRouteIds: ['route-blue-express'],
                createdAt: new Date().toISOString(),
              });
            }
          }

          // Listen to live Supabase auth state transitions
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
              if (session?.user) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();

                if (profile) {
                  setUser({
                    id: profile.id,
                    email: profile.email || session.user.email || '',
                    fullName: profile.full_name || 'LPU Commuter',
                    studentId: profile.student_id || '12200000',
                    role: (profile.role as UserRole) || 'student',
                    avatarUrl: profile.avatar_url || '',
                    favoriteStopIds: profile.favorite_stops || [],
                    savedRouteIds: profile.saved_routes || [],
                    createdAt: profile.created_at || new Date().toISOString(),
                  });
                }
              } else {
                setUser(null);
              }
            }
          );

          return () => {
            authListener.subscription.unsubscribe();
          };
        } else {
          // Local Persistent Auth (Restores session from localStorage across browser restarts)
          const savedSession = localStorage.getItem(LOCAL_SESSION_KEY);
          if (savedSession) {
            try {
              const parsedUser = JSON.parse(savedSession);
              setUser(parsedUser);
            } catch {
              localStorage.removeItem(LOCAL_SESSION_KEY);
            }
          }

          // Ensure local users db exists with default seed
          if (!localStorage.getItem(LOCAL_USERS_DB_KEY)) {
            localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify([DEFAULT_SEED_USER]));
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign In implementation supporting Email or Student ID
  const signIn = async (
    identifier: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedId = identifier.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedId,
          password,
        });

        if (error) return { success: false, error: error.message };

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || trimmedId,
            fullName: profile?.full_name || data.user.user_metadata?.full_name || 'LPU Student',
            studentId: profile?.student_id || data.user.user_metadata?.student_id || '12200000',
            role: (profile?.role as UserRole) || 'student',
            avatarUrl: profile?.avatar_url || '',
            favoriteStopIds: profile?.favorite_stops || ['stop-block-34-lib'],
            savedRouteIds: profile?.saved_routes || ['route-blue-express'],
            createdAt: profile?.created_at || new Date().toISOString(),
          };

          setUser(userProfile);
          return { success: true };
        }
        return { success: false, error: 'Authentication failed' };
      } catch (err: any) {
        return { success: false, error: err.message || 'An error occurred during login' };
      }
    } else {
      // Local persistent authentication engine
      const dbStr = localStorage.getItem(LOCAL_USERS_DB_KEY) || '[]';
      const usersDb: Array<UserProfile & { passwordHash: string }> = JSON.parse(dbStr);

      const matchedUser = usersDb.find(
        u => u.email.toLowerCase() === trimmedId || u.studentId.toLowerCase() === trimmedId
      );

      if (!matchedUser) {
        return { success: false, error: 'No registered student account found matching this Email or Student ID.' };
      }

      if (matchedUser.passwordHash !== password) {
        return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
      }

      const { passwordHash, ...cleanProfile } = matchedUser;
      setUser(cleanProfile);

      if (rememberMe) {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(cleanProfile));
      } else {
        sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(cleanProfile));
      }

      return { success: true };
    }
  };

  // Sign Up implementation
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    studentId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanStudentId = studentId.trim();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              student_id: cleanStudentId,
            },
          },
        });

        if (error) return { success: false, error: error.message };

        if (data.user) {
          const newProfile: UserProfile = {
            id: data.user.id,
            email: trimmedEmail,
            fullName: fullName.trim(),
            studentId: cleanStudentId,
            role: 'student',
            favoriteStopIds: ['stop-block-34-lib', 'stop-uni-mall'],
            savedRouteIds: ['route-blue-express'],
            createdAt: new Date().toISOString(),
          };
          setUser(newProfile);
          return { success: true };
        }
        return { success: false, error: 'Registration failed.' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration error.' };
      }
    } else {
      // Local engine
      const dbStr = localStorage.getItem(LOCAL_USERS_DB_KEY) || '[]';
      const usersDb: Array<UserProfile & { passwordHash: string }> = JSON.parse(dbStr);

      // Check duplicate email
      if (usersDb.some(u => u.email.toLowerCase() === trimmedEmail)) {
        return { success: false, error: 'An account with this email address already exists. Please log in instead.' };
      }

      // Check duplicate student id
      if (usersDb.some(u => u.studentId.toLowerCase() === cleanStudentId.toLowerCase())) {
        return { success: false, error: 'This Student ID is already registered.' };
      }

      const newUser: UserProfile & { passwordHash: string } = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        email: trimmedEmail,
        fullName: fullName.trim(),
        studentId: cleanStudentId,
        role: 'student',
        passwordHash: password,
        favoriteStopIds: ['stop-block-34-lib', 'stop-uni-mall'],
        savedRouteIds: ['route-blue-express'],
        createdAt: new Date().toISOString(),
      };

      usersDb.push(newUser);
      localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(usersDb));

      const { passwordHash, ...cleanProfile } = newUser;
      setUser(cleanProfile);
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(cleanProfile));

      return { success: true };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
    sessionStorage.removeItem(LOCAL_SESSION_KEY);
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);
      if (error) return { success: false, error: error.message };
      return { success: true, message: 'Password reset link sent to your registered email address.' };
    } else {
      const dbStr = localStorage.getItem(LOCAL_USERS_DB_KEY) || '[]';
      const usersDb: Array<UserProfile & { passwordHash: string }> = JSON.parse(dbStr);
      const userExists = usersDb.some(u => u.email.toLowerCase() === trimmedEmail);

      if (!userExists) {
        return { success: false, error: 'No registered account found with this email address.' };
      }

      return {
        success: true,
        message: 'Password recovery verification link dispatched to your inbox (Demo Mode: use Change Password in Profile).',
      };
    }
  };

  // Update Password for existing single account credential
  const updatePassword = async (newPassword: string) => {
    if (!user) return { success: false, error: 'You must be signed in to change your password.' };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      const dbStr = localStorage.getItem(LOCAL_USERS_DB_KEY) || '[]';
      const usersDb: Array<UserProfile & { passwordHash: string }> = JSON.parse(dbStr);

      const userIndex = usersDb.findIndex(u => u.id === user.id);
      if (userIndex === -1) return { success: false, error: 'Account not found.' };

      usersDb[userIndex].passwordHash = newPassword;
      localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(usersDb));

      return { success: true };
    }
  };

  // Update Profile details
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'Not authenticated.' };

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName || user.fullName,
          student_id: updates.studentId || user.studentId,
          favorite_stops: updates.favoriteStopIds || user.favoriteStopIds,
          saved_routes: updates.savedRouteIds || user.savedRouteIds,
        })
        .eq('id', user.id);
    } else {
      // Local DB
      const dbStr = localStorage.getItem(LOCAL_USERS_DB_KEY) || '[]';
      const usersDb: Array<UserProfile & { passwordHash: string }> = JSON.parse(dbStr);
      const idx = usersDb.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        usersDb[idx] = { ...usersDb[idx], ...updates };
        localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(usersDb));
      }
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updatedUser));
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isLiveSupabase: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
