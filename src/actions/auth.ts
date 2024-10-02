import { Session } from "@supabase/supabase-js"


export const setSession = (session: Session | null) => {
    return {
        type: 'SET_SESSION',
        payload: session
    }
}