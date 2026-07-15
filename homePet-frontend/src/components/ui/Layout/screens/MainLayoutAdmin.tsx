'use client'

import * as React from 'react'
import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Sidebar, HeaderAdmin as Topbar } from '../components'

interface MainLayoutAdminProps {
  children?: React.ReactNode
}

export function MainLayoutAdmin({ children }: MainLayoutAdminProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar - Columna fija a la izquierda */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Área de Contenido Principal (Columna derecha) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar persistente arriba */}
        <Topbar />

        {/* Área con scroll independiente para las páginas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* Renderiza el children si se pasa manualmente, 
                de lo contrario usa el Outlet del Router 
            */}
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}
