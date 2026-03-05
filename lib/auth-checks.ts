import { auth } from "@/auth" // Import from auth.ts
import { redirect } from "next/navigation"

export async function validateSession() {
    const session = await auth()
    if (!session || !session.user) {
        redirect("/login")
    }
    return session
}

export async function checkExpenseAccess(expense: { peopleId: number }, session: any) {
    if (!session || !session.user) throw new Error("Unauthorized")

    // Admin (User account) has access to everything
    if (session.user.accountType === "USER") {
        return true
    }

    // Employee (People account) -> Can only access own expenses
    if (session.user.accountType === "PEOPLE") {
        if (expense.peopleId !== Number(session.user.id)) {
            throw new Error("Forbidden: You do not have permission to access this resource.")
        }
        return true
    }

    throw new Error("Unauthorized Access")
}

export async function checkAdminAccess(session: any) {
    if (!session || !session.user) throw new Error("Unauthorized")

    if (session.user.accountType !== "USER") {
        throw new Error("Forbidden: Admin access required.")
    }
    return true
}
