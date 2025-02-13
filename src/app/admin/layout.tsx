import type React from "react"
import { Sidebar } from "./components/sidebar"
import { SectionsProvider } from "./contexts/SectionsContext"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Если нет сессии, показываем только содержимое (форму входа)
  if (!session) {
    return <>{children}</>
  }

  // Если есть сессия, показываем сайдбар и содержимое
  return (
    <SectionsProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </SectionsProvider>
  )
}

