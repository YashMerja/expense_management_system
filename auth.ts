import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { z } from "zod"
import { db } from "@/lib/db"
import bcrypt from "bcrypt"
import { UserRole } from "@/lib/prisma"

async function getUser(email: string) {
    try {
        const user = await db.user.findUnique({ where: { emailAddress: email } })
        return user
    } catch (error) {
        console.error("Failed to fetch user:", error)
        throw new Error("Failed to fetch user.")
    }
}

async function getPeople(email: string) {
    try {
        const people = await db.people.findFirst({
            where: { email: email, isDeleted: false, isActive: true },
        })
        return people
    } catch (error) {
        console.error("Failed to fetch people:", error)
        throw new Error("Failed to fetch people.")
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(1),
                        loginType: z.enum(["USER", "PEOPLE"]).optional()
                    })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password, loginType } = parsedCredentials.data

                    // If loginType is specified, simpler logic
                    if (loginType === "USER") {
                        const user = await getUser(email)
                        if (user && !user.isDeleted) {
                            const passwordsMatch = await bcrypt.compare(password, user.password)
                            if (passwordsMatch) {
                                return {
                                    id: String(user.userId),
                                    name: user.userName,
                                    email: user.emailAddress,
                                    image: user.profileImage,
                                    role: user.role, // matches UserRole enum
                                    accountType: "USER",
                                    userId: user.userId,
                                    tokenVersion: user.tokenVersion,
                                    isDeleted: user.isDeleted,
                                }
                            }
                        }
                        return null
                    }

                    if (loginType === "PEOPLE") {
                        const people = await getPeople(email)
                        if (people && people.password && !people.isDeleted) {
                            const passwordsMatch = await bcrypt.compare(password, people.password)
                            if (passwordsMatch) {
                                return {
                                    id: String(people.peopleId),
                                    name: people.peopleName,
                                    email: people.email || "",
                                    image: null,
                                    role: "EMPLOYEE",
                                    accountType: "PEOPLE",
                                    userId: people.userId,
                                    tokenVersion: 0,
                                    isDeleted: people.isDeleted,
                                }
                            }
                        }
                        return null
                    }

                    // Fallback: Dual Check (Auto-detect)
                    // 1. Try to find as USER (Admin/Owner)
                    const user = await getUser(email)
                    if (user) {
                        const passwordsMatch = await bcrypt.compare(password, user.password)
                        if (passwordsMatch) {
                            if (user.isDeleted) return null
                            return {
                                id: String(user.userId),
                                name: user.userName,
                                email: user.emailAddress,
                                image: user.profileImage,
                                role: user.role, // matches UserRole enum
                                accountType: "USER",
                                userId: user.userId,
                                tokenVersion: user.tokenVersion,
                                isDeleted: user.isDeleted,
                            }
                        }
                    }

                    // 2. If not User, try to find as PEOPLE (Employee)
                    const people = await getPeople(email)
                    if (people && people.password) {
                        const passwordsMatch = await bcrypt.compare(password, people.password)
                        if (passwordsMatch) {
                            return {
                                id: String(people.peopleId),
                                name: people.peopleName,
                                email: people.email || "",
                                image: null,
                                role: "EMPLOYEE",
                                accountType: "PEOPLE",
                                userId: people.userId,
                                tokenVersion: 0,
                                isDeleted: people.isDeleted,
                            }
                        }
                    }
                }
                return null
            },
        }),
    ],
    basePath: "/api/auth",
})
