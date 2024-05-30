import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Button } from '@nextui-org/react'

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL as string, process.env.REACT_APP_SUPABASE_KEY as string)

export default function AuthTest() {
    const [session, setSession] = useState(null)

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            // @ts-ignore
            setSession(session)
            getCountries()
        })

        async function getCountries() {
            const { data } = await supabase.from("countries").select();
            // @ts-ignore
            setCountries(data);
          }

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            // @ts-ignore
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!session) {
        return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
    }
    else {
        return (<div>
                <p>Logged in!</p>
                {countries.map(country => {
                    // @ts-ignore
                    return <p>{country.id} - {country.name} - {country.user_id}</p>
                })}
                <Button onClick={() => {
                    supabase.auth.signOut()
                    setCountries([])
                    }} >Logg ut</Button>
            </div>)
    }
}
