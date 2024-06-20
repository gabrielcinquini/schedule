import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/ui/theme-provider'

import { ClientProviderLayout } from './layouts/client-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agenda',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/" type="image/png" sizes="32x32" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviderLayout>{children}</ClientProviderLayout>
        </ThemeProvider>
      </body>

      <Toaster position="bottom-right" richColors closeButton duration={2500} />
    </html>
  )
}
