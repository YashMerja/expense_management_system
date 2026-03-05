import { UserRole } from "@/lib/prisma"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: UserRole | "EMPLOYEE"
            accountType: "USER" | "PEOPLE"
            userId: number // The Owner's ID (User.userId)
            tokenVersion: number
            isDeleted: boolean
        } & DefaultSession["user"]
    }

    interface User {
        role: UserRole | "EMPLOYEE"
        accountType: "USER" | "PEOPLE"
        userId: number // The Owner's ID
        tokenVersion?: number
        isDeleted?: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: UserRole | "EMPLOYEE"
        accountType: "USER" | "PEOPLE"
        userId: number
        tokenVersion: number
        isDeleted: boolean
    }
}
