import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    image: z.string().optional(),
})

export async function PATCH(req: Request) {
    try {
        const session = await auth()
        console.log("[PROFILE_API] Session User:", session?.user)

        if (!session?.user?.id) {
            console.error("[PROFILE_API] No user ID provided in session")
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { name, image } = profileSchema.parse(body)

        if (session.user.accountType === "PEOPLE") {
            const peopleIdInt = parseInt(session.user.id)
            if (isNaN(peopleIdInt)) {
                console.error("[PROFILE_API] Invalid People ID format:", session.user.id)
                return new NextResponse("Invalid People ID", { status: 400 })
            }

            const people = await db.people.update({
                where: {
                    peopleId: peopleIdInt
                },
                data: {
                    peopleName: name,
                    profileImage: image
                }
            })
            console.log("[PROFILE_API] People updated:", people.peopleId)
            return NextResponse.json(people)
        }

        const userIdInt = parseInt(session.user.id)
        if (isNaN(userIdInt)) {
            console.error("[PROFILE_API] Invalid User ID format:", session.user.id)
            return new NextResponse("Invalid User ID", { status: 400 })
        }

        const user = await db.user.update({
            where: {
                userId: userIdInt,
            },
            data: {
                userName: name,
                profileImage: image,
            },
        })

        console.log("[PROFILE_API] User updated:", user.userId)
        return NextResponse.json(user)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        console.error("[PROFILE_UPDATE_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
