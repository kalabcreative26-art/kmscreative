import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  loading: boolean;
  userId: string | null;
  email: string;
  isOwner: boolean;
};

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    userId: null,
    email: "",
    isOwner: false,
  });

  useEffect(() => {
    let active = true;

    const resolve = async (userId: string | null, email: string) => {
      if (!userId) {
        if (active) setState({ loading: false, userId: null, email: "", isOwner: false });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "owner")
        .maybeSingle();
      if (active) setState({ loading: false, userId, email, isOwner: !!data });
    };

    supabase.auth.getSession().then(({ data }) => {
      resolve(data.session?.user?.id ?? null, data.session?.user?.email ?? "");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      resolve(session?.user?.id ?? null, session?.user?.email ?? "");
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
