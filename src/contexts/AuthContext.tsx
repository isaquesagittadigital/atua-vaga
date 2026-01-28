
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';


interface UserProfile {
    id: string;
    email: string;
    role: 'candidate' | 'company_admin' | 'company_user' | 'super_admin';
    full_name: string;
}

interface Company {
    id: string;
    name: string;
    document: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    company: Company | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithPassword: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, additionalData?: object) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfileAndCompany = async (userId: string) => {
        try {
            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) {
                console.error("Error fetching profile:", profileError);
            } else {
                setProfile(profileData);

                // If company user/admin, fetch Company
                if (profileData.role === 'company_admin' || profileData.role === 'company_user') {
                    const { data: memberData, error: memberError } = await supabase
                        .from('company_members')
                        .select('companies(*)')
                        .eq('user_id', userId)
                        .single();

                    if (memberData && memberData.companies) {
                        // Supabase returns array or object depending on relationship. 
                        // With single() companies should be an object if 1:1 or N:1. 
                        // Because of select('companies(*)') and assuming the fk.
                        setCompany(memberData.companies as any);
                    }
                }
            }
        } catch (err) {
            console.error("Error loading user data:", err);
        }
    };

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfileAndCompany(session.user.id).then(() => setLoading(false));
            } else {
                setLoading(false);
            }
        });

        // Listen for changes on auth state
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // If we just logged in, fetch profile
                fetchProfileAndCompany(session.user.id);
            } else {
                setProfile(null);
                setCompany(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
    };

    const signInWithPassword = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
    };

    const signUp = async (email: string, password: string, additionalData?: object) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: additionalData
            }
        });

        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        setProfile(null);
        setCompany(null);
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, session, profile, company, loading, signInWithGoogle, signInWithPassword, signUp, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
