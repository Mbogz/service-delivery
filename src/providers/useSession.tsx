import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { Session } from "@supabase/supabase-js";
import supabase from "../utils/supabase";

interface SessionContextType {
  session: Session | null;
  isAuthenticated: boolean;
}
const SessionContext = createContext<SessionContextType | null>(null);

export default function SessionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <SessionContext.Provider value={{ isAuthenticated: !!session, session }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return ctx;
}