import React, { useState, useEffect, ReactNode } from 'react'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import { Button, Input } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { styles, useDb } from '../Util/Global'
import { getAccounts, getTransactions } from '../Util/Supabase'
import { useDispatch } from 'react-redux'
import { initSupabaseData } from '../actions/accounts'
import { Logo } from '../icons/Logo'
import { useTranslation } from 'react-i18next'

export default function Auth({ supabase, children }: { supabase: SupabaseClient, children: ReactNode }) {

    const [session, setSession] = useState<Session | null>(null)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch()
    const { t } = useTranslation();

    useEffect(() => {
        if (!supabase) {
            return
        }
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])//eslint-disable-line react-hooks/exhaustive-deps

    if (!supabase) {
        return (<></>)
    }

    function handleButton() {
        if (isSignUp) {
            supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'https://nrk.no',
                }
            })
        } else {
            supabase.auth.signInWithPassword({
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
                        if (useDb) {
                            getAccounts(supabase)
                                .then(accounts => {
                                    accounts.forEach(account => {
                                        getTransactions(supabase, account.key)
                                            .then(transactions => dispatch(initSupabaseData({ ...account, transactions })))
                                    });
                                })
                        }
                    }
                })
        }
    }

    if (!session) {
        return (
            <div className='w-2/3 sm:w-1/3 mx-auto space-y-2 grid grid-cols-1 mt-10'>
                <div className='flex justify-center'>
                    <Logo />
                    <p className="font-bold text-inherit p-3">{t('navbar.brand')}</p>
                </div>
                {error && <p className='text-red-500'>Wrong email or password</p>}
                <Input
                    classNames={styles.textInputStyle}
                    type='email'
                    label='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isClearable
                    isRequired
                    onClear={() => setEmail('')}
                />
                <Input
                    classNames={styles.textInputStyle}
                    type='password'
                    label='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isRequired
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            handleButton()
                        }
                    }}
                    isClearable
                    onClear={() => setPassword('')}
                />
                <Button
                    color='primary'
                    onKeyDown={(e) => {
                        console.log(e.key)
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            handleButton()
                        }
                    }}
                    onClick={() => {
                        handleButton()

                    }}>
                    {isSignUp ? 'Sign up' : 'Log in'}
                </Button>
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
