import { Link } from '@nextui-org/react'
import React from 'react'
import { routes } from '../Util/Global'

export default function ConfirmMail() {
    return (
        <div className='w-1/2 mx-auto'>
            <h1>Please go to your Email inbox and confirm your email to login.</h1>
            <Link href={routes.dashboard}>Go back</Link>
        </div>
    )
}