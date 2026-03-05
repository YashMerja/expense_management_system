import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = Number(session.user.userId); // Admin ID or Owner ID
        const id = Number(session.user.id); // Primary ID of logged in entity (User or People)
        const accountType = session.user.accountType; // "USER" or "PEOPLE"

        if (isNaN(id)) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }

        let where: any = {};

        if (accountType === "PEOPLE") {
            // Fetch notifications for this Employee
            where = { peopleId: id };
        } else {
            // Fetch notifications for Admin (User)
            // Ideally use `id` if `id` matches `userId` for Admins.
            // In `auth.config.ts`, for User login: `token.id = user.userId`.
            where = { userId: id };
        }

        const notifications = await db.notification.findMany({
            where,
            orderBy: { created: "desc" },
            take: 50,
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
