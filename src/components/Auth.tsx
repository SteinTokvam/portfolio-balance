import React, { useState, useEffect, ReactNode } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { Button, Input } from '@nextui-org/react'
import { Link } from 'react-router-dom'

export default function Auth({ supabase, children }: { supabase: SupabaseClient, children: ReactNode }) {

    // @ts-ignore
    const [session, setSession] = useState(null)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);


    useEffect(() => {
        if (!supabase) {
            return
        }
        supabase.auth.getSession().then(({ data: { session } }) => {
            // @ts-ignore
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            // @ts-ignore
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!supabase) {
        return (<></>)
    }

    if (!session) {
        return (
            <div className='w-1/2 mx-auto space-y-2 grid grid-cols-1 mt-10'>
                {error && <p className='text-red-500'>Wrong email or password</p>}
                <Input type='email' label='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type='password' label='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={() => isSignUp ? supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        emailRedirectTo: 'https://nrk.no',
                    }
                 }) : supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                })
                    .then(({ error }) => {
                        if (error) {
                            setError(true)
                        } else {
                            setError(false)
                            setEmail('')
                            setPassword('')
                        }
                    })}>{isSignUp ? 'Sign up' : 'Log in'}</Button>
                <Link to='#' className='text-blue-500' onClick={() => supabase.auth.resetPasswordForEmail(email)}>Forgot password?</Link>
                <Link to='#' className='text-blue-500' onClick={() => isSignUp ? setIsSignUp(false) : setIsSignUp(true)}>{isSignUp ? 'Already have an account? Log in.' : 'No account? Sign up.'}</Link>
            </div>)
    }
    else {
        return (
            <div>
                {children}
            </div>
        )
    }
}
