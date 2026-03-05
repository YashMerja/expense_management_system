import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { emailAddress: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        // Soft delete
        await db.user.update({
            where: { userId: user.userId },
            data: {
                isDeleted: true,
                tokenVersion: { increment: 1 } // Invalidate current tokens immediately
            }
        })

        return NextResponse.json({ message: "Account deleted successfully" })
    } catch (error) {
        console.error("[ACCOUNT_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
