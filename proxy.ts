import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const user = req.auth?.user
    // Strict check: User must have userId to be considered fully logged in
    const isLoggedIn = !!user && !!user.userId

    // If we have a user object but no userId, it's a stale session.
    // The default NextAuth behavior might still think we are logged in.
    // We need to force a redirect to login if we are in a protected route but have stale session.

    const { pathname } = nextUrl

    // Allowed for everyone (User + People)
    const isPublicRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname === "/"

    // Routes allowed for BOTH User and People
    const isCommonRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/expenses") ||
        pathname.startsWith("/incomes") ||
        pathname.startsWith("/projects") ||
        pathname.startsWith("/categories") ||
        pathname.startsWith("/profile") // Assuming profile is accessible to change own password

    // Admin Only Routes
    const isAdminRoute =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/people") ||
        pathname.startsWith("/budgets")

    // Redirect logic
    if (isLoggedIn) {
        if (isPublicRoute) {
            return Response.redirect(new URL("/dashboard", nextUrl))
        }

        // const user = req.auth?.user // already declared above
        if (isAdminRoute && user?.accountType !== "USER") {
            // If try to access admin route but not USER accountType -> Redirect to dashboard
            return Response.redirect(new URL("/dashboard", nextUrl))
        }
    } else {
        if (!isPublicRoute) {
            return Response.redirect(new URL("/login", nextUrl))
        }
    }

    return
})

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
