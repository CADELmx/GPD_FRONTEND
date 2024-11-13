import { Layout } from '@/components/layout'
import { AreasProvider, TemplatesProvider } from '@/context'
import '@/styles/globals.css'
import Notify from '@/toast'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <ThemeProvider attribute='class' enableSystem>
        <TemplatesProvider>
          <Layout>
            <Notify />
            <AreasProvider>
              <Component {...pageProps} />
            </AreasProvider>
          </Layout>
        </TemplatesProvider>
      </ThemeProvider>
    </NextUIProvider>
  )
}
