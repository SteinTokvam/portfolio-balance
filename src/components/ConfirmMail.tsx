import { Link } from '@nextui-org/react'
import { routes } from '../Util/Global'

export default function ConfirmMail() {
    return (
        <div className='w-2/3 mx-auto'>
            <h1>Please go to your Email inbox and confirm your email to login.</h1>
            <Link href={routes.dashboard}>Go back</Link>
        </div>
    )
}