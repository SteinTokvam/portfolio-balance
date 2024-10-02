import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";

const initialState = {
    session: await supabase.auth.getSession().then(({ data: { session } }) => session)
}

const authReducer = (state = initialState, action: { type: string; payload: Session | null }) => {
    switch (action.type) {
        case 'SET_SESSION':
            return {
                ...state,
                session: action.payload
            }
        default:
            return state
    }
}

export default authReducer