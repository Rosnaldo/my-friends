import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css';
import './globals.css'
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My friends',
  description: 'app for dating friends',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body suppressHydrationWarning className={inter.className}>
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
