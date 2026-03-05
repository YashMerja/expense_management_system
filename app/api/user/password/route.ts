import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcrypt"

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { currentPassword, newPassword } = passwordSchema.parse(body)

        const user = await db.user.findUnique({
            where: { emailAddress: session.user.email },
        })

        if (!user || !user.password) {
            // Check if it's a Person (Employee)
            const people = await db.people.findFirst({
                where: { email: session.user.email, isDeleted: false }
            })

            if (people && people.password) {
                const isPasswordValid = await bcrypt.compare(currentPassword, people.password)

                if (!isPasswordValid) {
                    return new NextResponse("Invalid current password", { status: 400 })
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10)

                await db.people.update({
                    where: { peopleId: people.peopleId },
                    data: {
                        password: hashedPassword,
                    },
                })
                return NextResponse.json({ message: "Password updated successfully" })
            }

            return NextResponse.json({ message: "User not found or using OAuth" }, { status: 400 })
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

        if (!isPasswordValid) {
            return new NextResponse("Invalid current password", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password and increment tokenVersion to logout other sessions?
        // Requirement says "Logout from all sessions" is a separate feature, but changing password usually implies it.
        // I'll stick to just password change for now, or maybe do it.
        // "Security rules" in plan didn't explicitly say "logout others", but it is good practice.
        // I will increment tokenVersion just in case to force re-login or at least invalidate compromised sessions.
        // Wait, if I increment `tokenVersion`, the *current* session also becomes invalid unless I update it?
        // But `auth()` session is statless JWT usually.
        // If I update `tokenVersion` in DB, the next JWT check will fail.
        // So the user will be logged out.
        // This is usually desired on password change.
        // But I need to handle the UX.
        // Let's just update password for now. The "Logout all" is a separate button.

        await db.user.update({
            where: { userId: user.userId },
            data: {
                password: hashedPassword,
            },
        })

        return NextResponse.json({ message: "Password updated successfully" })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        console.error("[PASSWORD_UPDATE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
