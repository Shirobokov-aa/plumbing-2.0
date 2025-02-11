import type React from "react"
import { Sidebar } from "./components/sidebar"
import { SectionsProvider } from "./contexts/SectionsContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SectionsProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </SectionsProvider>
  )
}

