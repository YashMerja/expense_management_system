"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: "project" | "expense" | "income" | "budget-warning";
    amount?: number;
    status?: string;
    description?: string;
    meta?: any; // For extra data like category, project ID, etc.
}

async function getAuthenticatedUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const id = Number(session.user.id);
    const userId = Number(session.user.userId);
    const role = session.user.role;
    const accountType = session.user.accountType;

    if (isNaN(id) || isNaN(userId)) {
        redirect("/login");
    }

    return { id, userId, role, accountType };
}

export async function getFinancialEvents(): Promise<CalendarEvent[]> {
    const { userId, accountType, id } = await getAuthenticatedUser();

    // Common helper to format date to start of day for consistency if needed, 
    // but DB dates are usually enough. ensuring they are Date objects.

    const events: CalendarEvent[] = [];

    // 1. Fetch Projects
    // Projects are owned by Admin (userId). 
    // Employees ideally see projects they are assigned to, or all if permission allows.
    // For now, fetching all projects for the User (Organization).
    const projects = await db.project.findMany({
        where: { userId, isDeleted: false },
    });

    projects.forEach(p => {
        // Skip if no start date
        if (!p.projectStartDate) return;

        // Project Duration Event
        events.push({
            id: `project-${p.projectId}`,
            title: p.projectName,
            start: p.projectStartDate,
            end: p.projectEndDate || p.projectStartDate, // Default to start date if no end date
            type: "project",
            status: p.isActive ? "Active" : "Inactive",
            description: p.description || "",
            meta: {
                projectId: p.projectId,
                description: p.description,
                status: p.isActive ? 'Active' : 'Inactive',
                // Mock budget for now since schema doesn't have it
                budget: 10000,
                totalSpent: 0 // Placeholder, ideal would be to aggregate expenses for this project
            }
        });

    });

    // 2. Fetch Expenses
    const expenseWhere: any = { userId, isDeleted: false };
    if (accountType === "PEOPLE") {
        expenseWhere.peopleId = id; // Employees see their own expenses
    }

    const expenses = await db.expense.findMany({
        where: expenseWhere,
        include: { category: true, people: true, project: true }
    });

    expenses.forEach(e => {
        events.push({
            id: `expense-${e.expenseId}`,
            title: `-${Number(e.amount)}`,
            start: e.expenseDate,
            end: e.expenseDate, // Single day
            type: "expense",
            amount: Number(e.amount),
            description: e.description || "",
            meta: {
                expenseId: e.expenseId,
                categoryName: e.category?.categoryName || "Uncategorized",
                personName: e.people?.peopleName || "Unknown",
                projectName: e.project?.projectName,
                description: e.description
            }
        });
    });

    // 3. Fetch Incomes (Admin Only usually, or if shared)
    if (accountType === "USER") {
        const incomes = await db.income.findMany({
            where: { userId, isDeleted: false },
            include: { category: true, people: true, project: true }
        });

        incomes.forEach(i => {
            events.push({
                id: `income-${i.incomeId}`,
                title: `+${Number(i.amount)}`,
                start: i.incomeDate,
                end: i.incomeDate,
                type: "income",
                amount: Number(i.amount),
                description: i.description || "",
                meta: {
                    incomeId: i.incomeId,
                    categoryName: i.category?.categoryName || "Uncategorized",
                    personName: i.people?.peopleName || "Admin",
                    projectName: i.project?.projectName,
                    description: i.description
                }
            });
        });
    }

    return events;
}
