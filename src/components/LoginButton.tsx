import { Avatar, Button, Chip } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { UseTemplates } from '../context'

export const LoginButton = () => {
    const router = useRouter()
    const { memory: { user } } = UseTemplates()
    if (router.pathname === '/user') {
        return null
    }
    return (
        <Link href="/user" passHref legacyBehavior>
            {
                user ? (
                    <Chip className='cursor-pointer' avatar={<Avatar color="primary" />}>
                        {user}
                    </Chip>
                ) : (
                    <Button variant='bordered'>
                        Iniciar sesión
                    </Button>
                )
            }
        </Link>
    )
}
