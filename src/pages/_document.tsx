import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es-MX">
      <Head title='Gestión de plantillas docentes'/>
      <link rel="manifest" href="/manifest.json" />
      <body className='bg-background text-foreground min-h-screen relative overflow-y-auto'>
        <Main />
        <NextScript />
        <footer className="flex self-center items-center justify-center h-30 static py-5 mt-5 w-full bottom-0">
          <p>
          {new Date().getFullYear()} - UTIM &copy;
          </p>
        </footer>
      </body>
    </Html>
  )
}
