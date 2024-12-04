import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function Index() {
  return (

    <div className='flex gap-2 items-center justify-center'>
      <p>
        Bienvenido a la plataforma de gestión de plantillas docentes
      </p>
      <Link href={'/user'} passHref legacyBehavior>
        <Button color="primary">
          Comenzar
        </Button>
      </Link>
    </div>
  )
}