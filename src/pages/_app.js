import { Layout } from '@/components/layout'
import { AreasProvider, ContextProvider } from '@/context'
import '@/styles/globals.css'
import Notify from '@/toast'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <ThemeProvider attribute='class' enableSystem>
        <ContextProvider>
          <Layout>
            <Notify />
            <AreasProvider>
              <Component {...pageProps} />
            </AreasProvider>
          </Layout>
        </ContextProvider>
      </ThemeProvider>
    </NextUIProvider>
  )
}
