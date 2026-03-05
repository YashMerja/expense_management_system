import { getBudgets, getCategories } from "@/actions/data-actions";
import { BudgetClient } from "./client";

export default async function BudgetsPage() {
    const [budgets, categories] = await Promise.all([
        getBudgets(),
        getCategories(),
    ]);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <BudgetClient data={budgets} categories={categories} />
            </div>
        </div>
    );
}
