import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import Notify from '../toast'
import { AreasProvider, TemplatesProvider } from '../context'
import { Layout } from '../components/layout'

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
