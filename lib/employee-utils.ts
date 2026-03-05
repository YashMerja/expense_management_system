import { auth } from "@/auth"

export async function isEmployee() {
    const session = await auth()
    return session?.user?.accountType === "PEOPLE"
}

export async function checkEmployeeAccess(peopleId: number) {
    const session = await auth()
    if (session?.user?.accountType === "PEOPLE") {
        return Number(session.user.id) === peopleId
    }
    return false // If not employee (i.e. Admin), this specific check is false, but Admin has global access usually.
    // This function is specifically for "Is this the correct employee?"
}

export async function getEmployeeId() {
    const session = await auth()
    if (session?.user?.accountType === "PEOPLE") {
        return Number(session.user.id)
    }
    return null
}
