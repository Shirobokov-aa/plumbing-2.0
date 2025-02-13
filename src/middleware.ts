import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Этот middleware будет работать только для /admin/* путей
export default withAuth(
  function middleware(req) {
    // Разрешаем доступ к странице входа
    if (req.nextUrl.pathname === "/admin/signin") {
      return NextResponse.next()
    }

    // Проверяем роль для остальных admin путей
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!req.nextauth.token?.role) {
        return NextResponse.redirect(new URL("/admin/signin", req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Всегда разрешаем доступ к странице входа
        if (req.nextUrl.pathname === "/admin/signin") {
          return true
        }
        // Для других admin путей требуем наличие токена
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}
