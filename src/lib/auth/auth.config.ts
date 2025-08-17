import { NextAuthConfig } from "next-auth";

// Динамическое определение базового URL
const getBaseUrl = () => {
  // В продакшне используем переменную окружения или дефолтный URL
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXTAUTH_URL || "https://abelsberg.com";
  }

  // В разработке используем переменную окружения или localhost
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
};

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/admin");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const authOptions = {
  ...authConfig,
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "P2FAfG/vbpXELKQ88TTY2UanVypNqiGqFOl1MkhAZ/w=",
  url: getBaseUrl(),
  basePath: "/api/auth",
  debug: process.env.NODE_ENV === "development"
};
