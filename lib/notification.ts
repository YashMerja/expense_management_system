import { db } from "@/lib/db";

interface CreateNotificationParams {
    userId?: number; // Admin
    peopleId?: number; // Employee
    title: string;
    message: string;
    type: "expense" | "income" | "project" | "budget" | "activity" | "calendar";
    referenceId?: number;
    referenceType?: string;
}

export async function createNotification({
    userId,
    peopleId,
    title,
    message,
    type,
    referenceId,
    referenceType,
}: CreateNotificationParams) {
    try {
        if (!userId && !peopleId) {
            console.error("Failed to create notification: Missing userId or peopleId");
            return;
        }

        await db.notification.create({
            data: {
                userId,
                peopleId,
                title,
                message,
                type,
                referenceId,
                referenceType,
            },
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
}

// Helper to notify all admins
export async function notifyAdmins({
    title,
    message,
    type,
    referenceId,
    referenceType,
}: Omit<CreateNotificationParams, "userId" | "peopleId">) {
    try {
        const admins = await db.user.findMany({
            where: { role: "ADMIN", isDeleted: false },
        });

        for (const admin of admins) {
            await createNotification({
                userId: admin.userId,
                title,
                message,
                type,
                referenceId,
                referenceType,
            });
        }
    } catch (error) {
        console.error("Failed to notify admins:", error);
    }
}
