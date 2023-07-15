import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../helper/supabase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<{session: Session | null | undefined, user: User | null | undefined, signOut: () => void}>({session: null, user: null, signOut: () => {}});
// AuthProviderProps
export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const setData = async () => {
            const {data: {session}, error} = await supabase.auth.getSession();
            if (error) throw error;
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }
        
        
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            console.log('event', event);

            // Quando a autenticação mudar, redireciona para a página inicial
            navigate('/');
        });
        
        setData();

        return () => {
            listener?.subscription?.unsubscribe();
        }

    }, []);

    const value = {
        session,
        user,
        signOut: async () => {
                setLoading(true)
                try {
                    const { error } = await supabase.auth.signOut()
                    if (error) throw error
                    navigate("/login")
                } catch (error) {
                    throw error
                } finally {
                    setLoading(false)
                }
        }
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}