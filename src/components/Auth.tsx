import React, { useState, useEffect } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { Button, Input } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSession } from '../actions/auth'

export default function Auth({ supabase, children }: { supabase: SupabaseClient, children: JSX.Element }) {

    // @ts-ignore
    const session = useSelector(state => state.rootReducer.session.session)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const dispatch = useDispatch()


    useEffect(() => {
        if (!supabase) {
            return
        }
        supabase.auth.getSession().then(({ data: { session } }) => {
            // @ts-ignore
            dispatch(setSession(session))
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            // @ts-ignore
            dispatch(setSession(session))
        })

        return () => subscription.unsubscribe()
    }, [dispatch, supabase])

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
