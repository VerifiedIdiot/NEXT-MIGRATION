import type { Metadata } from 'next'
import { ReactNode } from 'react'
import ReactQueryProvider from '@/providers/ReactQueryProvider'

import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Welcome to my Next Template',
    default: 'Loading . . .',
  },
  description: 'Such a dynamic developer ever',
}

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return <main className='w-full min-h-dvh flex flex-col justify-center items-center bg-white'>{children}</main>
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang='en'>
      <body>
        <ReactQueryProvider>

            <DefaultLayout>{children}</DefaultLayout>

        </ReactQueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
