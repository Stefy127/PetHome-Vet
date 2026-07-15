import { useState, type ReactNode } from 'react'
import { Footer, HeaderClient } from '#/components/ui/Layout/components'
import { SidebarCliente } from '#/components/ui/Layout/components/SidebarCliente'

export function DashboardLayoutClient({
  children,
}: {
  children: ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#F8F9FA]">
      <SidebarCliente
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex h-screen flex-1 flex-col overflow-y-auto">
        <HeaderClient />
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6 pb-12">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
