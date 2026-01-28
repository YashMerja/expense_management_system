import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const user = auth?.user as any;
            const isLoggedIn = !!user && !!user.userId;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")

            console.log(`[MIDDLEWARE] Path: ${nextUrl.pathname}, LoggedIn: ${isLoggedIn}, UserID: ${user?.userId}`)

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn && isAuthPage) {
                return Response.redirect(new URL("/dashboard", nextUrl))
            }
            return true
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                // Ensure we cast to any to access custom fields
                const u = user as any;
                token.id = u.id
                token.email = u.email
                token.name = u.name
                token.picture = u.image
                token.role = u.role
                token.accountType = u.accountType
                token.userId = u.userId
                token.tokenVersion = u.tokenVersion ?? 0
                token.isDeleted = u.isDeleted ?? false
            }

            if (trigger === "update" && session) {
                token.name = session.name ?? token.name
                token.picture = session.image ?? token.picture
            }

            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                // Use string literal or ANY to avoid Prisma Client dependency in Edge
                session.user.role = token.role as any
                session.user.accountType = token.accountType as "USER" | "PEOPLE"
                session.user.userId = token.userId as number
                session.user.tokenVersion = token.tokenVersion as number
                session.user.isDeleted = token.isDeleted as boolean
                session.user.name = token.name
                session.user.image = token.picture
            }
            return session
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
