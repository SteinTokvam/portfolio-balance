import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button, Input } from '@nextui-org/react'
import { Link } from 'react-router-dom'

const supabase = process.env.REACT_APP_SUPABASE_URL && createClient(process.env.REACT_APP_SUPABASE_URL as string, process.env.REACT_APP_SUPABASE_KEY as string)

export default function Auth() {
    const [session, setSession] = useState(null)

    const [countries, setCountries] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    if(!supabase) {
        return(<></>)
    }

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
        return (
            <div className='w-1/2 mx-auto space-y-2 grid grid-cols-1 mt-10'>
                {error && <p className='text-red-500'>Wrong email or password</p>}
                <Input type='email' label='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type='password' label='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={() => isSignUp ? supabase.auth.signUp({ email, password }) : supabase.auth.signInWithPassword({ email, password })
                    .then(({ error }) => {
                        if (error) {
                            setError(true)
                        } else {
                            setError(false)
                        }
                    })}>{isSignUp ? 'Sign up' : 'Log in'}</Button>
                <Link to='#' className='text-blue-500' onClick={() => supabase.auth.resetPasswordForEmail(email)}>Forgot password?</Link>
                <Link to='#' className='text-blue-500' onClick={() => isSignUp ? setIsSignUp(false) : setIsSignUp(true)}>{isSignUp ? 'Already have an account? Log in.' : 'No account? Sign up.'}</Link>
            </div>)
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
