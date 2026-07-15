'use client'

import * as React from 'react'
import { Outlet } from '@tanstack/react-router'
import { Footer, HeaderClient } from '../components'

interface MainLayoutProps {
  children?: React.ReactNode
}

export function MainLayoutClient({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HeaderClient />
      <main className="flex-grow">{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}
