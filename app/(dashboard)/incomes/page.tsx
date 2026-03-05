import { getIncomes, getCategories, getProjects, getPeople } from "@/actions/data-actions";
import { IncomeClient } from "./client";
import { auth } from "@/auth";

export default async function IncomesPage() {
    const session = await auth();
    const [incomes, categories, projects, people] = await Promise.all([
        getIncomes(),
        getCategories(),
        getProjects(),
        getPeople(),
    ]);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Incomes</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <IncomeClient
                    data={incomes}
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
