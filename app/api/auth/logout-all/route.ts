import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { emailAddress: session.user.email }
        })

        if (!user) {
            // Check if it's a Person (Employee)
            const people = await db.people.findFirst({
                where: { email: session.user.email, isDeleted: false }
            })

            if (people) {
                await db.people.update({
                    where: { peopleId: people.peopleId },
                    data: {
                        tokenVersion: { increment: 1 }
                    }
                })
                return NextResponse.json({ message: "Logged out from all devices" })
            }

            return NextResponse.json("User not found", { status: 404 })
        }

        // Increment tokenVersion to invalidate all existing sessions
        await db.user.update({
            where: { userId: user.userId },
            data: {
                tokenVersion: { increment: 1 }
            }
        })

        return NextResponse.json({ message: "Logged out from all devices" })
    } catch (error) {
        console.error("[LOGOUT_ALL]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
