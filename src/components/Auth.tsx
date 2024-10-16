import { useState, useEffect } from 'react'
import { Button, Input } from '@nextui-org/react'
import { Link, useNavigate } from 'react-router-dom'
import { routes, styles } from '../Util/Global'
import { Logo } from '../icons/Logo'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabaseClient'

export default function Auth() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase) {
            return
        }
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
                    emailRedirectTo: 'https://portfolio-balance.vercel.app/',
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

                        navigate(routes.dashboard)
                    }
                })
        }
    }

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
