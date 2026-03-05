import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+ (or recent 14?) or just simple object depending on version. 
    // Wait, recent Next.js versions (15) make params async. I should check package.json or assume generic.
    // To be safe and compatible with both, I'll await it if it's a promise, or just access it.
    // Actually, distinct signature for Next 15: params: Promise<{ id: string }>
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const notificationId = Number(id);

        if (isNaN(notificationId)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const userId = Number(session.user.userId);

        // Verify ownership
        const notification = await db.notification.findUnique({
            where: { notificationId },
        });

        if (!notification) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (notification.userId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const updatedNotification = await db.notification.update({
            where: { notificationId },
            data: { isRead: true },
        });

        return NextResponse.json(updatedNotification);
    } catch (error) {
        console.error("[NOTIFICATION_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
