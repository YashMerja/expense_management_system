import { getExpenses, getCategories, getProjects, getPeople } from "@/actions/data-actions";
import { ExpenseClient } from "./client";
import { auth } from "@/auth";

export default async function ExpensesPage() {
    const [expenses, categories, projects, people] = await Promise.all([
        getExpenses(),
        getCategories(),
        getProjects(),
        getPeople(),
    ]);

    const session = await auth();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <ExpenseClient
                    data={expenses}
                    categories={categories}
                    projects={projects}
                    people={people}
                    role={session?.user?.accountType}
                    userId={session?.user?.id}
                />
            </div>
        </div>
    );
}
